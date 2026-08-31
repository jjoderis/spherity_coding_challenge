import { Controller, Get } from '@nestjs/common';
import { SignaturesService } from './signatures.service';

@Controller()
export class SignaturesController {
  constructor(private signaturesService: SignaturesService) {}

  /*
   * Expose information about the issuer that is required by verifiers that want to verify credentials issued by this wallet
   */
  @Get('/api/issuer')
  async getIssuer() {
    return await this.signaturesService.getIssuerInfo();
  }
}
