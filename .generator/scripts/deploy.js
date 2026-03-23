import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../..');
const generatorRoot = resolve(__dirname, '..');
const distDir = resolve(generatorRoot, 'dist');
const distIndexPath = resolve(distDir, 'index.html');
const distOpenApiPath = resolve(distDir, 'openapi.json');

console.log('📦 Starting deployment...\n');

if (!existsSync(distIndexPath)) {
  console.error('❌ dist/index.html not found!');
  process.exit(1);
}

if (!existsSync(distOpenApiPath)) {
  console.error('❌ dist/openapi.json not found! Run \"pnpm generate-sitemap\" first.');
  process.exit(1);
}

const sitesJsonPath = resolve(projectRoot, 'sites.json');
if (!existsSync(sitesJsonPath)) {
  console.error("❌ sites.json not found! Run 'pnpm generate-sitemap' first.");
  process.exit(1);
}

const sites = JSON.parse(readFileSync(sitesJsonPath, 'utf-8'));

console.log('📦 Deploying index.html to directories...');

const rootIndexPath = resolve(projectRoot, 'index.html');
copyFileSync(distIndexPath, rootIndexPath);
console.log('✅ Deployed to root: index.html');

const docsDir = resolve(projectRoot, 'docs');
const docsIndexPath = resolve(docsDir, 'index.html');
mkdirSync(docsDir, { recursive: true });
copyFileSync(distIndexPath, docsIndexPath);
console.log('✅ Deployed to docs/index.html');

sites.forEach((site) => {
  const siteDir = resolve(projectRoot, site.slug);
  const siteIndexPath = resolve(siteDir, 'index.html');

  if (!existsSync(siteDir)) {
    mkdirSync(siteDir, { recursive: true });
  }

  copyFileSync(distIndexPath, siteIndexPath);
  console.log(`✅ Deployed to ${site.slug}/index.html`);
});

const rootOpenApiPath = resolve(projectRoot, 'openapi.json');
copyFileSync(distOpenApiPath, rootOpenApiPath);
console.log('✅ Deployed to root: openapi.json');

console.log('\n📦 Copying assets to root...');
const assetFiles = glob.sync('assets/**/*', {
  cwd: distDir,
  absolute: false,
  nodir: true,
});

assetFiles.forEach((assetFile) => {
  const srcPath = resolve(distDir, assetFile);
  const destPath = resolve(projectRoot, assetFile);
  const destDir = dirname(destPath);

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  copyFileSync(srcPath, destPath);
});

console.log(`✅ Copied ${assetFiles.length} asset files\n`);
console.log('🎉 Deployment completed successfully!');
console.log(`\n📊 Summary:`);
console.log(`  - Sites: ${sites.length}`);
console.log(`  - Generated files: ${sites.length + 2} index.html files`);
console.log(`  - OpenAPI spec: 1 file`);
console.log(`  - Assets: ${assetFiles.length} files\n`);
