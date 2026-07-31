import { Injectable } from '@nestjs/common';

import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeysService {
  private keyMap: Record<string, any> = {};

  constructor(private configService: ConfigService) {}

  /**
   * Creates a new keypair for a given entity (issuer, holder) or returns an existing one if it has been created before
   */
  async getOrCreateKeypair(
    id: string,
    createOptions = {} as Record<string, any>,
  ) {
    if (this.keyMap[id]) return this.keyMap[id];

    // we use the ecdsa-sd-2023 cryptosuite to allow selective disclosure so we need a respective keypair
    const keyPair = await EcdsaMultikey.generate({
      curve: 'P-256',
      id: `${this.configService.get<string>('WALLET_URL')}/${id}`,
      ...createOptions,
    });

    this.keyMap[id] = keyPair;

    return keyPair;
  }

  /**
   * Returns the public key object of an existing key pair
   */
  async getPublicKey(id: string) {
    const keyPair = this.keyMap[id];
    if (!keyPair) return undefined;
    return await keyPair.export({ publicKey: true });
  }
}
