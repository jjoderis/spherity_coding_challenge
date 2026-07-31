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
const { createSignCryptosuite } = ecdsaSd2023Cryptosuite;

@Injectable()
export class SignaturesService {
  constructor(
    private keysService: KeysService,
    private configService: ConfigService,
  ) {}

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
      id: `${this.configService.get<string>('WALLET_URL')}/issuer`,
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
      controller: `${this.configService.get<string>('WALLET_URL')}/issuer`,
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
      documentLoader: defaultDocumentLoader,
    })) as VerifiableCredential;
  }
}
