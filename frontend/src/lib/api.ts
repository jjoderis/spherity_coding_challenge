import { notFound } from "@tanstack/react-router";
import { VerifiableCredential } from "../../../backend/src/credentials/interfaces/credentials.interface";
import type { CreateCredentialDto } from "../../../backend/src/credentials/dto/create-credential.dto";

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
  static async getCredentials(): Promise<VerifiableCredential[]> {
    const result = await apiFetch("/credentials");
    return result.json();
  }

  static async getCredential(id: string): Promise<VerifiableCredential> {
    const result = await apiFetch(`/credentials/${id}`);
    return result.json();
  }

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

  static async deleteCredential(id: string) {
    await apiFetch(`/credentials/${id}`, { method: "DELETE" });
  }

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
