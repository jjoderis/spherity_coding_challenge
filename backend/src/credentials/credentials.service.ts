import { Injectable } from '@nestjs/common';
import { Credential } from './interfaces/credentials.interface';

@Injectable()
export class CredentialsService {
  private credentials: Credential[] = [];

  create(credential: Credential) {
    this.credentials.push(credential);
  }

  getAll(): Credential[] {
    return this.credentials;
  }

  get(id: string): Credential | undefined {
    return this.credentials.find((c) => c.id === id);
  }

  delete(id: string) {
    this.credentials = this.credentials.filter((c) => c.id !== id);
  }
}
