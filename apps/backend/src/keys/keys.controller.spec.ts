import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { KeysController } from './keys.controller';
import { KeysService } from './keys.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

const exampleKey = {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'http://localhost:3000/keys/issuer',
  type: 'Multikey',
  controller: 'http://localhost:3000/issuer',
  publicKeyMultibase: 'zDnaevRW9EzfZEYAaJLkp3YFUAJgBGKCtbkVdWtoWkm3mjYF8',
};

describe('CredentialsController', () => {
  let keysController: KeysController;
  let keysService: KeysService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [KeysController],
      providers: [KeysService],
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    keysService = moduleRef.get(KeysService);
    keysController = moduleRef.get(KeysController);
  });

  describe('/keys/:id', () => {
    describe('GET', () => {
      it('should return the key with the given id', async () => {
        jest
          .spyOn(keysService, 'getPublicKey')
          .mockImplementation(() => new Promise((res) => res(exampleKey)));

        await expect(keysController.get('issuer')).resolves.toBe(exampleKey);
      });

      it('should throw an http error when no key exists for the given id', async () => {
        jest
          .spyOn(keysService, 'getPublicKey')
          .mockImplementation(() => new Promise((res) => res(undefined)));

        await expect(() =>
          keysController.get('unknown-key-id'),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
