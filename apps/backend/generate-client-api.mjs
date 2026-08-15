import fs from 'fs';
import path from 'path';
import { createClient } from '@hey-api/openapi-ts';

const __dirname = import.meta.dirname;

/**
 * Generates code for a typescript library for use in the frontend that contains functions which provide an easy way to access the endpoints exposed by the backend
 */
async function generateClientApiCode() {
  // get the openAPI schema json that is exposed by the development build of the backend
  const result = await fetch('http://localhost:3000/api-json');
  const data = await result.json();

  const clientSourcePath = path.join(__dirname, 'src', 'client');
  const openApiSchemaPath = path.join(clientSourcePath, 'swagger.json');

  // store the openAPI schema json locally for the next step
  fs.writeFileSync(openApiSchemaPath, JSON.stringify(data, null, 2));

  // generate client code from the openAPI schema json and store it locally
  await createClient({
    input: openApiSchemaPath,
    output: clientSourcePath,
  });
}

generateClientApiCode();
