import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const USER_AGENT = 'japan2027-image-vendor/1.0 (GitHub Pages build)';

async function readPhotoMap(fileName, variableName) {
  const source = await readFile(join(DIST, fileName), 'utf8');
  const sandbox = {};
  vm.runInNewContext(`${source}\nthis.__photoMap = ${variableName};`, sandbox, {
    filename: fileName,
    timeout: 2_000
  });
  return sandbox.__photoMap;
}

function localExtension(fileName) {
  return extname(fileName).toLowerCase() === '.svg' ? '.svg' : '.jpg';
}

function commonsImageUrl(fileName) {
  const encoded = encodeURIComponent(fileName.replaceAll(' ', '_'));
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encoded}?width=960`;
}

async function fetchImage(fileName) {
  const url = commonsImageUrl(fileName);
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'user-agent': USER_AGENT, accept: 'image/*' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get('content-type') || '';
      if (!type.startsWith('image/')) throw new Error(`unexpected content-type ${type}`);
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 1_500));
    }
  }
  throw new Error(`Could not download ${fileName}: ${lastError?.message || lastError}`);
}

async function vendorGroup(directory, entries, byteCache) {
  const targetDir = join(DIST, 'images', directory);
  await mkdir(targetDir, { recursive: true });

  let cursor = 0;
  const workers = Array.from({ length: 4 }, async () => {
    while (cursor < entries.length) {
      const [key, value] = entries[cursor++];
      const fileName = value[0];
      let bytes = byteCache.get(fileName);
      if (!bytes) {
        bytes = await fetchImage(fileName);
        byteCache.set(fileName, bytes);
      }
      await writeFile(join(targetDir, `${key}${localExtension(fileName)}`), bytes);
      console.log(`Vendored ${directory}/${key}`);
    }
  });
  await Promise.all(workers);
}

const activityPhotos = await readPhotoMap('activities.js', 'activityPhotos');
const foodPhotos = await readPhotoMap('food.js', 'foodPhotos');
const byteCache = new Map();

await vendorGroup('activities', Object.entries(activityPhotos), byteCache);
await vendorGroup('food', Object.entries(foodPhotos), byteCache);

console.log(`Vendored ${Object.keys(activityPhotos).length} activity images and ${Object.keys(foodPhotos).length} food images.`);
