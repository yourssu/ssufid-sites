import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../..');
const generatorPublicDir = resolve(projectRoot, '.generator/public');

const AttachmentSchema = z.object({
  mime_type: z.string().nullable(),
  name: z.string().nullable(),
  url: z.string(),
});

const NoticeItemSchema = z.object({
  attachments: z.array(AttachmentSchema),
  author: z.string().nullable(),
  category: z.array(z.string()),
  content: z.string(),
  created_at: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  metadata: z.record(z.string(), z.string()).nullable(),
  thumbnail: z.string().nullable(),
  title: z.string(),
  updated_at: z.string().nullable(),
  url: z.string(),
});

const SiteDataSchema = z.object({
  description: z.string(),
  items: z.array(NoticeItemSchema),
  source: z.string(),
  title: z.string(),
});

function createOpenApiDocument(siteEntries) {
  const attachmentSchema = z.toJSONSchema(AttachmentSchema);
  const noticeItemSchema = z.toJSONSchema(NoticeItemSchema);
  const siteDataSchema = z.toJSONSchema(SiteDataSchema);
  const paths = {};

  siteEntries.forEach((site) => {
    const siteDescription = [site.description, site.source ? `원본 사이트: ${site.source}` : null]
      .filter(Boolean)
      .join('\n\n');

    paths[`/${site.slug}/data.json`] = {
      get: {
        description: siteDescription || undefined,
        responses: {
          200: {
            content: {
              'application/json': {
                examples: {
                  default: {
                    value: site.data,
                  },
                },
                schema: {
                  $ref: '#/components/schemas/SiteData',
                },
              },
            },
            description: `${site.title} JSON feed`,
          },
        },
        summary: `${site.title} JSON feed`,
      },
    };

    paths[`/${site.slug}/rss.xml`] = {
      get: {
        description: siteDescription || undefined,
        responses: {
          200: {
            content: {
              'application/rss+xml': {
                schema: {
                  type: 'string',
                },
              },
              'application/xml': {
                schema: {
                  type: 'string',
                },
              },
            },
            description: `${site.title} RSS feed`,
          },
        },
        summary: `${site.title} RSS feed`,
      },
    };
  });

  return {
    components: {
      schemas: {
        Attachment: attachmentSchema,
        NoticeItem: noticeItemSchema,
        SiteData: {
          ...siteDataSchema,
          examples: siteEntries[0] ? [siteEntries[0].data] : undefined,
        },
      },
    },
    info: {
      description: 'SSUFID가 배포하는 숭실대학교 공지사항 JSON/RSS feed의 통합 OpenAPI 문서입니다.',
      title: 'SSUFID Feed API',
      version: '1.0.0',
    },
    openapi: '3.1.0',
    paths,
    servers: [{ url: 'https://ssufid.yourssu.com' }],
  };
}

console.log('📂 Scanning for data.json files...');

const dataJsonFiles = glob.sync('**/data.json', {
  absolute: false,
  cwd: projectRoot,
  ignore: ['.*/**', 'node_modules/**', '.generator/**'],
});

console.log(`Found ${dataJsonFiles.length} data.json files:\n`);
dataJsonFiles.forEach((file) => console.log(`  - ${file}`));
console.log();

console.log('📝 Generating sites.json and openapi.json...');
const siteEntries = dataJsonFiles
  .map((filePath) => {
    const fullPath = resolve(projectRoot, filePath);
    const parsed = SiteDataSchema.parse(JSON.parse(readFileSync(fullPath, 'utf-8')));
    const slug = dirname(filePath);

    return {
      data: parsed,
      description: parsed.description || '',
      itemCount: parsed.items.length,
      slug,
      source: parsed.source || '',
      title: parsed.title || slug,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title, 'ko'));

const sites = siteEntries.map(({ description, itemCount, slug, source, title }) => ({
  description,
  itemCount,
  slug,
  source,
  title,
}));

const openApiDocument = createOpenApiDocument(siteEntries);
const sitesJsonPath = resolve(projectRoot, 'sites.json');
const generatorSitesJsonPath = resolve(projectRoot, '.generator/src/sites.json');
const openApiJsonPath = resolve(projectRoot, 'openapi.json');
const generatorOpenApiJsonPath = resolve(generatorPublicDir, 'openapi.json');

mkdirSync(generatorPublicDir, { recursive: true });

writeFileSync(sitesJsonPath, JSON.stringify(sites, null, 2), 'utf-8');
writeFileSync(generatorSitesJsonPath, JSON.stringify(sites, null, 2), 'utf-8');
writeFileSync(openApiJsonPath, JSON.stringify(openApiDocument, null, 2), 'utf-8');
writeFileSync(generatorOpenApiJsonPath, JSON.stringify(openApiDocument, null, 2), 'utf-8');

console.log(`✅ sites.json created with ${sites.length} sites`);
console.log(`   - ${sitesJsonPath}`);
console.log(`   - ${generatorSitesJsonPath}`);
console.log('✅ openapi.json created');
console.log(`   - ${openApiJsonPath}`);
console.log(`   - ${generatorOpenApiJsonPath}`);
console.log(`   Total notices: ${sites.reduce((sum, site) => sum + site.itemCount, 0)}\n`);
