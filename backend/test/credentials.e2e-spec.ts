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

  describe('/credentials', () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get('/credentials')
        .expect(200)
        .expect('[]');
    });

    it('POST', async () => {
      await request(app.getHttpServer())
        .post('/credentials')
        .send({ invalid: 'properties' })
        .expect(400);

      await request(app.getHttpServer())
        .post('/credentials')
        .send(exampleCredential)
        .expect(201);

      await request(app.getHttpServer())
        .get('/credentials')
        .expect(200)
        .then((response) =>
          expect(response.body).toStrictEqual([
            {
              ...exampleCredential,
              id: expect.any(String),
              issuer: 'http://localhost:3000/issuer',
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

    describe('/credentials/:id', () => {
      let credentialId = 'unknown';
      beforeEach(async () => {
        const result = await request(app.getHttpServer())
          .post('/credentials')
          .send(exampleCredential)
          .expect(201);

        credentialId = result.body.id;
      });

      it('GET', async () => {
        await request(app.getHttpServer())
          .get(`/credentials/${credentialId}`)
          .expect(200)
          .then((response) =>
            expect(response.body).toStrictEqual({
              ...exampleCredential,
              id: credentialId,
              issuer: 'http://localhost:3000/issuer',
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
          .get('/credentials/unknowncredentialid')
          .expect(404);
      });

      it('DELETE', async () => {
        // check that there is a credential before the deletion is executed
        await request(app.getHttpServer())
          .get('/credentials')
          .expect(200)
          .then((response) =>
            expect(response.body).toStrictEqual([
              {
                ...exampleCredential,
                id: credentialId,
                issuer: 'http://localhost:3000/issuer',
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
          .delete(`/credentials/${credentialId}`)
          .expect(200);

        // check that the deletion actually removed the credential
        await request(app.getHttpServer())
          .get('/credentials')
          .expect(200)
          .expect('[]');

        // when there is nothing to delete we consider the deletion to have "succeded"
        return request(app.getHttpServer())
          .delete('/credentials/unknowncredentialid')
          .expect(200);
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
