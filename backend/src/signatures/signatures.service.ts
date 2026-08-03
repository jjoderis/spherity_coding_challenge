import { Injectable } from '@nestjs/common';

import * as ecdsaSd2023Cryptosuite from '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import * as vc from '@digitalcredentials/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
  Credential,
  VerifiableCredential,
} from '../credentials/interfaces/credentials.interface';
import { KeysService } from '../keys/keys.service';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

const { defaultDocumentLoader } = vc;
const {
  createSignCryptosuite,
  createDiscloseCryptosuite,
  createVerifyCryptosuite,
} = ecdsaSd2023Cryptosuite;

@Injectable()
export class SignaturesService {
  constructor(
    private keysService: KeysService,
    private configService: ConfigService,
  ) {}

  /**
   * The vc library tries to resolve some urls (e.g. the @context, verificationMethod, and controller) to verify a credential
   * This custom loader will allow it to access necessary data that exists inside the wallet (e.g. the public key and some other information about the "issuer")
   */
  async customDocumentLoader(url: string) {
    const walletURL = this.configService.get<string>('WALLET_URL');
    if (url.startsWith(`${walletURL}/api/keys`)) {
      const keyId = url.replace(`${walletURL}/api/keys/`, '');
      const publicKey = await this.keysService.getPublicKey(keyId);
      return { document: publicKey };
    } else if (url === `${walletURL}/api/issuer`) {
      return { document: await this.getIssuerInfo() };
    }
    return defaultDocumentLoader(url);
  }

  /**
   * Returns issuer information that will be required for credential verification
   */
  async getIssuerInfo() {
    // ensure that a public key exists
    await this.keysService.getOrCreateKeypair('issuer');
    const publicKey = await this.keysService.getPublicKey('issuer');
    return {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        'https://w3id.org/security/multikey/v1',
      ],
      id: `${this.configService.get<string>('WALLET_URL')}/api/issuer`,
      verificationMethod: [publicKey],
      assertionMethod: [publicKey.id],
    };
  }

  /**
   * Creates a proof for the given credential and embeds it in the credential
   */
  async issue(credential: Credential) {
    // get a keypair to sign the credential with
    const keyPair = await this.keysService.getOrCreateKeypair('issuer', {
      controller: `${this.configService.get<string>('WALLET_URL')}/api/issuer`,
    });

    const suite = new DataIntegrityProof({
      signer: keyPair.signer(),
      cryptosuite: createSignCryptosuite({}),
    });

    const proofId = `urn:uuid:${v4()}`;
    suite.proof = { id: proofId };

    return (await vc.issue({
      credential,
      suite,
      documentLoader: (url) => this.customDocumentLoader(url),
    })) as VerifiableCredential;
  }

  /**
   * Creates a derived credential that can be shared with others which might contain only selected parts of the original credential
   *
   * @param credential the credential to derive from
   * @param [selectivePointers=['/credentialSubject', '/issuer']] the properties to disclose as paths from the root of the credential (paths need to start with a "/")
   */
  async derive(
    credential: VerifiableCredential,
    selectivePointers: string[] = ['/credentialSubject', '/issuer'],
  ) {
    const suite = new DataIntegrityProof({
      cryptosuite: createDiscloseCryptosuite({
        proofId: (credential as any).proof.id,
        selectivePointers,
      }),
    });

    const derivedVC = await vc.derive({
      verifiableCredential: credential,
      suite,
      documentLoader: (url: string) => this.customDocumentLoader(url),
    });

    return derivedVC;
  }

  /*
   * Verifies a given credential by checking its content against the embedded proof
   */
  async verify(credential: VerifiableCredential) {
    const suite = new DataIntegrityProof({
      cryptosuite: createVerifyCryptosuite({}),
    });

    return await vc.verifyCredential({
      credential,
      suite,
      documentLoader: (url: string) => this.customDocumentLoader(url),
    });
  }
}
