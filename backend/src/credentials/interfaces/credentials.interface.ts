export class Credential {
  '@context': string[];
  id?: string;
  name?: string;
  type: string[];
  issuer: string;
  issuanceDate?: string;
  validFrom?: string;
  validUntil?: string;
  credentialSubject: Record<string, any>;
}
