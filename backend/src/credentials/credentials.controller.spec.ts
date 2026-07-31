import { Test } from '@nestjs/testing';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { NotFoundException } from '@nestjs/common';
import { SignaturesModule } from '../signatures/signatures.module';
import { VerifiableCredential } from './interfaces/credentials.interface';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

const exampleCredential = {
  '@context': ['https://www.w3.org/ns/credentials/v2'],
  issuer: 'did:example:testissuer',
  type: ['VerifiableCredential'],
  credentialSubject: {
    name: 'Test Subject',
    age: 42,
  },
};

describe('CredentialsController', () => {
  let credentialsController: CredentialsController;
  let credentialsService: CredentialsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CredentialsController],
      providers: [CredentialsService],
      imports: [
        SignaturesModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
      ],
    }).compile();

    credentialsService = moduleRef.get(CredentialsService);
    credentialsController = moduleRef.get(CredentialsController);
  });

  describe('/credentials', () => {
    describe('GET', () => {
      it('should return an empty array if there are not credentials', () => {
        jest.spyOn(credentialsService, 'getAll').mockImplementation(() => []);

        expect(credentialsController.getAll()).toStrictEqual([]);
      });
      it('should return all known credentials', () => {
        jest
          .spyOn(credentialsService, 'getAll')
          .mockImplementation(() => [
            exampleCredential as unknown as VerifiableCredential,
          ]);

        expect(credentialsController.getAll()).toStrictEqual([
          exampleCredential,
        ]);
      });
    });

    describe('POST', () => {
      it('should create a new verifiable credential', async () => {
        const spiedOn = jest.spyOn(credentialsService, 'issue');

        await credentialsController.issue(exampleCredential);
        expect(spiedOn).toHaveBeenCalledWith(exampleCredential);
      });
    });

    describe('credentials/:id', () => {
      describe('GET', () => {
        it('should return the credential with the given id', () => {
          jest
            .spyOn(credentialsService, 'get')
            .mockImplementation(() => exampleCredential);

          expect(credentialsController.get('testcredentialid')).toBe(
            exampleCredential,
          );
        });

        it('should throw an http error when no credential exists for the given id', () => {
          jest
            .spyOn(credentialsService, 'get')
            .mockImplementation(() => undefined);

          expect(() =>
            credentialsController.get('unknowncredentialid'),
          ).toThrow(NotFoundException);
        });
      });

      describe('DELETE', () => {
        it('should remove the credential with the given id', () => {
          const spiedOn = jest.spyOn(credentialsService, 'delete');

          credentialsController.delete('testcredentialid');
          expect(spiedOn).toHaveBeenCalledWith('testcredentialid');
        });
      });
    });
  });
});
