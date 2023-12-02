import { Readable } from "stream";
import { createGunzip } from "zlib";

// Helper function to unzip a stream
export function unzipStream(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];

  const gunzip = createGunzip();
  stream.pipe(gunzip);

  return new Promise((resolve, reject) => {
    gunzip.on('data', (chunk: Uint8Array) => {
      chunks.push(chunk);
    });

    gunzip.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    gunzip.on('error', reject);
  });
}
