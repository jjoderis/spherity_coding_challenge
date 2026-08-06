import { Injectable } from '@nestjs/common';
import { VerifiableCredential } from './interfaces/credentials.interface';
import { SignaturesService } from '../signatures/signatures.service';
import { v4 } from 'uuid';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CredentialsService {
  private credentials: VerifiableCredential[] = [];

  constructor(
    private signaturesService: SignaturesService,
    private configService: ConfigService,
  ) {}

  /*
   * Sign and store incoming credential objects
   */
  async issue(credential: CreateCredentialDto) {
    const signedCredential = await this.signaturesService.issue({
      ...credential,
      id: `urn:uuid:${v4()}`,
      issuer: `${this.configService.get<string>('WALLET_URL')}/api/issuer`,
      issuanceDate: new Date().toISOString(),
    });
    this.credentials.push(signedCredential);
    return signedCredential;
  }

  getAll() {
    return this.credentials;
  }

  get(id: string) {
    return this.credentials.find((c) => c.id === id);
  }

  delete(id: string) {
    this.credentials = this.credentials.filter((c) => c.id !== id);
  }

  /**
   * Creates a derived credential that can be shared with others which might contain only selected parts of the original credential
   *
   * @param id the id of the credential to derive from
   * @param [selectivePointers] the properties to disclose as paths from the root of the credential (paths need to start with a "/")
   */
  async derive(id: string, selectivePointers?: string[]) {
    const credential = this.get(id);
    if (!credential) return;
    return await this.signaturesService.derive(credential, selectivePointers);
  }

  /*
   * Verifies a given credential by checking its content against the embedded proof
   */
  async verify(credential: VerifiableCredential) {
    return this.signaturesService.verify(credential);
  }
}
