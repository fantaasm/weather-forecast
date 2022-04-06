import { argon2id } from "hash-wasm";

/**
 * @description - Hashes a password using Argon2id
 * @param {string} password - The password to hash
 *
 * @returns {string} - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2id({
    password: password,
    memorySize: parseInt(process.env.NEXT_PUBLIC_ARGON_MEMORY as string),
    // @ts-ignore
    salt: Uint8Array.from(process.env.NEXT_PUBLIC_ARGON_SALT),
    iterations: parseInt(process.env.NEXT_PUBLIC_ARGON_ITERATIONS as string),
    parallelism: parseInt(process.env.NEXT_PUBLIC_ARGON_PARALLELISM as string),
    hashLength: parseInt(process.env.NEXT_PUBLIC_ARGON_HASH_LENGTH as string),
  });
}
