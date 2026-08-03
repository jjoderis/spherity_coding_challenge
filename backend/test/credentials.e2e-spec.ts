import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const exampleCredential = {
  '@context': ['https://www.w3.org/ns/credentials/v2'],
  type: ['VerifiableCredential'],
  credentialSubject: {
    name: 'Test Subject',
    age: 42,
  },
};

describe('CredentialsController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/credentials', () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get('/api/credentials')
        .expect(200)
        .expect('[]');
    });

    it('POST', async () => {
      await request(app.getHttpServer())
        .post('/api/credentials')
        .send({ invalid: 'properties' })
        .expect(400);

      await request(app.getHttpServer())
        .post('/api/credentials')
        .send(exampleCredential)
        .expect(201);

      await request(app.getHttpServer())
        .get('/api/credentials')
        .expect(200)
        .then((response) =>
          expect(response.body).toStrictEqual([
            {
              ...exampleCredential,
              id: expect.any(String),
              issuer: 'http://localhost:3000/api/issuer',
              issuanceDate: expect.any(String),
              proof: {
                created: expect.any(String),
                cryptosuite: expect.any(String),
                id: expect.any(String),
                type: 'DataIntegrityProof',
                verificationMethod: expect.any(String),
                proofPurpose: expect.any(String),
                proofValue: expect.any(String),
              },
            },
          ]),
        );
    });

    describe('/api/credentials/:id', () => {
      let credentialId = 'unknown';
      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .post('/api/credentials')
          .send(exampleCredential)
          .expect(201);

        credentialId = result.body.id;
      });

      it('GET', async () => {
        await request(app.getHttpServer())
          .get(`/api/credentials/${credentialId}`)
          .expect(200)
          .then((response) =>
            expect(response.body).toStrictEqual({
              ...exampleCredential,
              id: credentialId,
              issuer: 'http://localhost:3000/api/issuer',
              issuanceDate: expect.any(String),
              proof: {
                created: expect.any(String),
                cryptosuite: expect.any(String),
                id: expect.any(String),
                type: 'DataIntegrityProof',
                verificationMethod: expect.any(String),
                proofPurpose: expect.any(String),
                proofValue: expect.any(String),
              },
            }),
          );

        return request(app.getHttpServer())
          .get('/api/credentials/unknowncredentialid')
          .expect(404);
      });

      it('DELETE', async () => {
        // check that there is a credential before the deletion is executed
        await request(app.getHttpServer())
          .get('/api/credentials')
          .expect(200)
          .then((response) =>
            expect(response.body).toStrictEqual([
              {
                ...exampleCredential,
                id: credentialId,
                issuer: 'http://localhost:3000/api/issuer',
                issuanceDate: expect.any(String),
                proof: {
                  created: expect.any(String),
                  cryptosuite: expect.any(String),
                  id: expect.any(String),
                  type: 'DataIntegrityProof',
                  verificationMethod: expect.any(String),
                  proofPurpose: expect.any(String),
                  proofValue: expect.any(String),
                },
              },
            ]),
          );

        await request(app.getHttpServer())
          .delete(`/api/credentials/${credentialId}`)
          .expect(200);

        // check that the deletion actually removed the credential
        await request(app.getHttpServer())
          .get('/api/credentials')
          .expect(200)
          .expect('[]');

        // when there is nothing to delete we consider the deletion to have "succeded"
        return request(app.getHttpServer())
          .delete('/api/credentials/unknowncredentialid')
          .expect(200);
      });

      describe('credentials/:id/share', () => {
        describe('POST', () => {
          it('creates a new credential from an existing credential with a derived proof', async () => {
            const { body: originalCredential } = await request(
              app.getHttpServer(),
            ).get(`/api/credentials/${credentialId}`);

            const { body: derivedCredential } = await request(
              app.getHttpServer(),
            )
              .post(`/api/credentials/${credentialId}/share`)
              .expect(201);

            delete originalCredential.issuanceDate;

            expect(derivedCredential).toStrictEqual({
              ...originalCredential,
              proof: {
                ...originalCredential.proof,
                proofValue: expect.any(String),
              },
            });

            expect(derivedCredential.proof.proofValue).not.toEqual(
              originalCredential.proof.proofValue,
            );
          });

          it('allows selective disclosure of the contents of the original credential', async () => {
            const { body: derivedCredential } = await request(
              app.getHttpServer(),
            )
              .post(`/api/credentials/${credentialId}/share`)
              .send(['/credentialSubject/name'])
              .expect(201);

            expect(derivedCredential).not.toHaveProperty('issuer');
            expect(derivedCredential.credentialSubject).not.toHaveProperty(
              'age',
            );
          });

          it('Returns a 404 error when the requested credential does not exist', async () => {
            return request(app.getHttpServer())
              .post(`/api/credentials/unknownid/share`)
              .expect(404);
          });
        });
      });

      describe('credentials/verification', () => {
        it('provides a way to verify derived credentials', async () => {
          const { body: derivedCredential } = await request(app.getHttpServer())
            .post(`/api/credentials/${credentialId}/share`)
            .send(['/credentialSubject/name', '/issuer'])
            .expect(201);

          return request(app.getHttpServer())
            .post('/api/credentials/verification')
            .send(derivedCredential)
            .expect(201);
        });

        it('returns a 400 error when the provided credential has been tampered with', async () => {
          const { body: derivedCredential } = await request(app.getHttpServer())
            .post(`/api/credentials/${credentialId}/share`)
            .send([
              '/credentialSubject/name',
              '/credentialSubject/age',
              '/issuer',
            ])
            .expect(201);

          expect(derivedCredential.credentialSubject.age).toBe(
            exampleCredential.credentialSubject.age,
          );

          const manipulatedCredential = {
            ...derivedCredential,
            credentialSubject: {
              ...derivedCredential.credentialSubject,
              age: exampleCredential.credentialSubject.age + 1,
            },
          };

          return request(app.getHttpServer())
            .post('/api/credentials/verification')
            .send(manipulatedCredential)
            .expect(400);
        });
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
