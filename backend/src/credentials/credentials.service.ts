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
      issuer: `${this.configService.get<string>('WALLET_URL')}/issuer`,
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
}
