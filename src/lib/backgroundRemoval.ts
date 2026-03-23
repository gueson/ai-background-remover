'use client';

import { createClient, removeBackground } from '@imgly/background-removal';

let client: ReturnType<typeof createClient> | null = null;

export async function getBackgroundRemovalClient() {
  if (!client) {
    client = await createClient();
  }
  return client;
}

export async function removeBackground(file: File): Promise<Blob> {
  const client = await getBackgroundRemovalClient();
  const result = await removeBackground({ image: file }, client);
  return result;
}