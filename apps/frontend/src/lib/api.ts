import { notFound } from "@tanstack/react-router";
import { VerifiableCredential } from "@scc/backend/types/credentials";
import type { CreateCredentialDto } from "@scc/backend/dto/create-credential";

const baseApiPath = "/api";
type FetchOptions = NonNullable<Parameters<typeof fetch>[1]>;
async function apiFetch(path: string, options?: FetchOptions) {
  const result = await fetch(baseApiPath + path, options);

  if (!result.ok) {
    if (result.status === 404) {
      throw notFound({ data: "The requested data does not seem to exist." });
    }

    throw new Error(`${options?.method || "GET"} request to ${path} failed.`);
  }

  return result;
}

class API {
  /**
   * Returns all credentials stored in the backend
   */
  static async getCredentials(): Promise<VerifiableCredential[]> {
    const result = await apiFetch("/credentials");
    return result.json();
  }

  /**
   * Returns the credential with the given id if it is stored in the backend
   */
  static async getCredential(id: string): Promise<VerifiableCredential> {
    const result = await apiFetch(`/credentials/${id}`);
    return result.json();
  }

  /**
   * Sends the given credential data to the backend where a new verifiable credential is issued
   */
  static async createCredential(data: CreateCredentialDto) {
    const result = await apiFetch("/credentials", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result.json();
  }

  /**
   * Deletes the credential with the given id from the backend
   */
  static async deleteCredential(id: string) {
    await apiFetch(`/credentials/${id}`, { method: "DELETE" });
  }

  /**
   * Creates a derived credential from the credential with the given id (if it exists) that can then be shared with others
   *
   * @param discloseKeys a list of paths to properties that should be included in the derived credential (e.g. "/credentialSubject/name")
   */
  static async shareCredential(
    id: string,
    discloseKeys: string[],
  ): Promise<VerifiableCredential> {
    const result = await apiFetch(`/credentials/${id}/share`, {
      method: "POST",
      body: JSON.stringify(discloseKeys),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result.json();
  }

  /**
   * Sends the given string to the backend to verify that it is a valid not manipulated credential
   *
   * @param data data is expected to be valid json otherwise the request will fail
   */
  static async verifyCredential(data: string) {
    await apiFetch("/credentials/verification", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default API;
