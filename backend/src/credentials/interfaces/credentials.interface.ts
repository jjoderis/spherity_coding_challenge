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

export class VerifiableCredential extends Credential {
  proof: {
    id: string;
    type: string;
    created: string;
    verificationMethod: string;
    cryptoSuite: string;
    proofPurpose: string;
    proofValue: string;
  };
}
