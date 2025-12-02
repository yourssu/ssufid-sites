import { glob } from "glob";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../..");

console.log("📂 Scanning for data.json files...");

// 모든 data.json 파일 탐색
const dataJsonFiles = glob.sync("**/data.json", {
  cwd: projectRoot,
  absolute: false,
  ignore: [".*/**", "node_modules/**", ".generator/**"],
});

console.log(`Found ${dataJsonFiles.length} data.json files:\n`);
dataJsonFiles.forEach((file) => console.log(`  - ${file}`));
console.log();

// sites.json 생성
console.log("📝 Generating sites.json...");
const sites = dataJsonFiles
  .map((filePath) => {
    const fullPath = resolve(projectRoot, filePath);
    const data = JSON.parse(readFileSync(fullPath, "utf-8"));
    const slug = dirname(filePath);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      source: data.source || "",
      itemCount: data.items?.length || 0,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title, "ko"));

// sites.json을 프로젝트 루트와 .generator/src 폴더에 생성
const sitesJsonPath = resolve(projectRoot, "sites.json");
const generatorSitesJsonPath = resolve(
  projectRoot,
  ".generator/src/sites.json",
);

writeFileSync(sitesJsonPath, JSON.stringify(sites, null, 2), "utf-8");
writeFileSync(generatorSitesJsonPath, JSON.stringify(sites, null, 2), "utf-8");

console.log(`✅ sites.json created with ${sites.length} sites`);
console.log(`   - ${sitesJsonPath}`);
console.log(`   - ${generatorSitesJsonPath}`);
console.log(
  `   Total notices: ${sites.reduce((sum, site) => sum + site.itemCount, 0)}\n`,
);
