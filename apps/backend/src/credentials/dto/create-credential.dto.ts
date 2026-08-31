import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCredentialDto {
  @IsArray()
  '@context': string[];
  /**
   * A concise human readable name for the credential
   */
  @IsOptional()
  @IsString()
  name?: string;
  /**
   * A human readable description for the credential
   */
  @IsOptional()
  @IsString()
  description?: string;
  @IsArray()
  type: string[];
  /**
   * The date and time after which the credentials starts being valid
   */
  @IsOptional()
  @IsString()
  validFrom?: string;
  /**
   * The date and time after which the credentials ceases to be valid
   */
  @IsOptional()
  @IsString()
  validUntil?: string;
  /**
   * A list of claims about the subject of this credential
   */
  @IsObject()
  credentialSubject: Record<string, any>;
}
