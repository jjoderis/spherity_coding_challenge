import { z } from 'zod';

export const createCredentialSchema = z.object({
  '@context': z.string().array(),
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().array(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  credentialSubject: z.record(z.string(), z.any()),
});

export type CreateCredentialDto = z.infer<typeof createCredentialSchema>;
