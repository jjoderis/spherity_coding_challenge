import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsService } from './credentials.service';
import { VerifiableCredential } from './interfaces/credentials.interface';

@Controller('/api/credentials')
export class CredentialsController {
  constructor(private credentialsService: CredentialsService) {}

  /**
   * Get all the credentials stored in the backend
   */
  @Get()
  getAllCredentials(): VerifiableCredential[] {
    return this.credentialsService.getAll();
  }

  /**
   * Creates a new verifiable credential by signing the provided credential data and stores the result
   */
  @Post()
  async issueCredential(
    @Body() createCredentialDto: CreateCredentialDto,
  ): Promise<VerifiableCredential> {
    return this.credentialsService.issue(createCredentialDto);
  }

  /**
   * Returns the credential with the given id if it is stored in the backend
   */
  @Get(':id')
  getCredential(@Param('id') id: string): VerifiableCredential {
    const credential = this.credentialsService.get(id);

    if (!credential) throw new NotFoundException();

    return credential;
  }

  /**
   * Deletes the credential with the given id from the backend
   */
  @Delete(':id')
  deleteCredential(@Param('id') id: string) {
    this.credentialsService.delete(id);
  }

  /**
   * Creates a derived credential from the credential with the given id (if it exists) that can the be shared with others
   *
   * @param selectivePointers a list of path to properties that should be included in the derived credentials (e.g. "/credentialSubject/name")
   */
  @Post(':id/share')
  async shareCredential(
    @Param('id') id: string,
    @Body() selectivePointers?: string[],
  ): Promise<VerifiableCredential> {
    const derivedVC = await this.credentialsService.derive(
      id,
      selectivePointers,
    );

    if (!derivedVC) throw new NotFoundException();

    return derivedVC;
  }

  /**
   * Verifies that the given credential string is a valid non-manipulated credential
   */
  @Post('verification')
  async verifyCredential(@Body() credential: VerifiableCredential) {
    const result = await this.credentialsService.verify(credential);

    if (!result.verified) throw new BadRequestException();

    return result;
  }
}
