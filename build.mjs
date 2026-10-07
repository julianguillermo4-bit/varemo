import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const value = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL;
if (!value) throw new Error('Set SITE_URL or deploy as a Render Static Site, which provides RENDER_EXTERNAL_URL.');
const address = new URL(value);
if (address.protocol !== 'https:' || address.username || address.password || address.search || address.hash || address.pathname !== '/') {
  throw new Error('The public URL must be an HTTPS origin without credentials, a path, query or fragment.');
}
const origin = address.origin;
const output = join(root, 'dist');
await mkdir(output, { recursive: true });
await cp(join(root, 'site'), output, { recursive: true });
const index = join(output, 'index.html');
const template = await readFile(index, 'utf8');
if (!template.includes('__VAREMO_PUBLIC_ORIGIN__')) throw new Error('Expected public-origin markers are missing.');
await writeFile(index, template.replaceAll('__VAREMO_PUBLIC_ORIGIN__', origin));
console.log('Varemo static site prepared with its assigned public URL.');
