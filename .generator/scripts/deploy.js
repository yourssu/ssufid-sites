import { glob } from "glob";
import { readFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../..");
const generatorRoot = resolve(__dirname, "..");
const distDir = resolve(generatorRoot, "dist");
const distIndexPath = resolve(distDir, "index.html");

console.log("📦 Starting deployment...\n");

// dist/index.html 확인
if (!existsSync(distIndexPath)) {
  console.error("❌ dist/index.html not found!");
  process.exit(1);
}

// sites.json 읽기
const sitesJsonPath = resolve(projectRoot, "sites.json");
if (!existsSync(sitesJsonPath)) {
  console.error("❌ sites.json not found! Run 'pnpm generate-sitemap' first.");
  process.exit(1);
}

const sites = JSON.parse(readFileSync(sitesJsonPath, "utf-8"));

console.log("📦 Deploying index.html to directories...");

// 루트에 index.html 복사
const rootIndexPath = resolve(projectRoot, "index.html");
copyFileSync(distIndexPath, rootIndexPath);
console.log("✅ Deployed to root: index.html");

// 각 사이트 디렉토리에 index.html 복사
sites.forEach((site) => {
  const siteDir = resolve(projectRoot, site.slug);
  const siteIndexPath = resolve(siteDir, "index.html");

  if (!existsSync(siteDir)) {
    mkdirSync(siteDir, { recursive: true });
  }

  copyFileSync(distIndexPath, siteIndexPath);
  console.log(`✅ Deployed to ${site.slug}/index.html`);
});

// 에셋 파일들도 루트에 복사
console.log("\n📦 Copying assets to root...");
const assetFiles = glob.sync("assets/**/*", {
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

console.log("🎉 Deployment completed successfully!");
console.log(`\n📊 Summary:`);
console.log(`  - Sites: ${sites.length}`);
console.log(`  - Generated files: ${sites.length + 1} index.html files`);
console.log(`  - Assets: ${assetFiles.length} files\n`);
