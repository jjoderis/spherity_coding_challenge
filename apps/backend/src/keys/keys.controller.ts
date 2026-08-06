import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { KeysService } from './keys.service';

@Controller('/api/keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  /**
   * Expose information about public keys that are required by verifiers that want to verify credentials issued by this wallet
   */
  @Get(':id')
  async get(@Param('id') id: string) {
    const key = await this.keysService.getPublicKey(id);

    if (!key) throw new NotFoundException();

    return key;
  }
}
