import { ApiProperty } from '@nestjs/swagger';

export class Credential {
  '@context': string[];
  /**
   * Unique identifier of the credential
   */
  id: string = '';
  /**
   * A concise human readable name for the credential
   */
  name?: string;
  /**
   * A human readable description for the credential
   */
  description?: string;
  type: string[] = ['VerifiableCredential'];
  /**
   * The entity that issued this credential
   */
  issuer: string = '';
  /**
   * The time at which this credential was issued',
   */
  issuanceDate: string = '';
  /**
   * The date and time after which the credentials starts being valid
   */
  validFrom?: string;
  /**
   * The date and time after which the credentials ceases to be valid
   */
  validUntil?: string;
  /**
   * A list of claims about the subject of this credential
   */
  credentialSubject: Record<string, any> = {};
}

export class VerifiableCredential extends Credential {
  /**
   * The embedded proof that can be used to verify that this credential was not altered
   */
  proof: {
    id: string;
    type: string;
    created: string;
    verificationMethod: string;
    cryptoSuite: string;
    proofPurpose: string;
    proofValue: string;
  } = {
    id: '',
    type: '',
    created: '',
    verificationMethod: '',
    cryptoSuite: '',
    proofPurpose: '',
    proofValue: '',
  };
}
