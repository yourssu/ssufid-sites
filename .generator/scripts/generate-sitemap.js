import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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

const NoticeSiteDataSchema = z.object({
  description: z.string(),
  items: z.array(NoticeItemSchema),
  source: z.string(),
  title: z.string(),
});

const CalendarItemSchema = z.object({
  description: z.string().nullable(),
  ends_at: z.string(),
  id: z.string(),
  location: z.string().nullable(),
  starts_at: z.string(),
  title: z.string(),
  url: z.string(),
});

const CalendarSiteDataSchema = z.object({
  description: z.string(),
  items: z.array(CalendarItemSchema),
  source: z.string(),
  title: z.string(),
});

const SiteMetadataSchema = z.object({
  description: z.string(),
  itemCount: z.number().int().nonnegative(),
  slug: z.string(),
  source: z.string(),
  title: z.string(),
});

function createOpenApiDocument(siteEntries, sites) {
  const attachmentSchema = z.toJSONSchema(AttachmentSchema);
  const noticeItemSchema = z.toJSONSchema(NoticeItemSchema);
  const noticeSiteDataSchema = z.toJSONSchema(NoticeSiteDataSchema);
  const calendarItemSchema = z.toJSONSchema(CalendarItemSchema);
  const calendarSiteDataSchema = z.toJSONSchema(CalendarSiteDataSchema);
  const siteMetadataSchema = z.toJSONSchema(SiteMetadataSchema);
  const siteIndexSchema = z.toJSONSchema(z.array(SiteMetadataSchema));
  const paths = {
    '/sites.json': {
      get: {
        description: '배포 중인 SSUFID feed 목록입니다.',
        responses: {
          200: {
            content: {
              'application/json': {
                examples: {
                  default: {
                    value: sites,
                  },
                },
                schema: {
                  $ref: '#/components/schemas/SiteIndex',
                },
              },
            },
            description: 'Published site index',
          },
        },
        summary: 'Published site index',
        tags: ['Site index'],
      },
    },
  };

  siteEntries.forEach((site) => {
    const siteDescription = [site.description, site.source ? `원본 사이트: ${site.source}` : null]
      .filter(Boolean)
      .join('\n\n');
    const isCalendarFeed = site.feedType === 'calendar';
    const dataSchemaRef = isCalendarFeed
      ? '#/components/schemas/CalendarSiteData'
      : '#/components/schemas/NoticeSiteData';
    const dataSummary = `${site.title} JSON feed`;

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
                  $ref: dataSchemaRef,
                },
              },
            },
            description: dataSummary,
          },
        },
        summary: dataSummary,
        tags: [isCalendarFeed ? 'Calendar feeds' : 'Notice feeds'],
      },
    };

    if (site.hasRss) {
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
          tags: ['Notice feeds'],
        },
      };
    }

    if (site.hasCalendarIcs) {
      paths[`/${site.slug}/calendar.ics`] = {
        get: {
          description: siteDescription || undefined,
          responses: {
            200: {
              content: {
                'text/calendar': {
                  schema: {
                    type: 'string',
                  },
                },
              },
              description: `${site.title} iCalendar feed`,
            },
          },
          summary: `${site.title} iCalendar feed`,
          tags: ['Calendar feeds'],
        },
      };
    }
  });

  const firstNoticeEntry = siteEntries.find((site) => site.feedType === 'notice');
  const firstCalendarEntry = siteEntries.find((site) => site.feedType === 'calendar');

  return {
    components: {
      schemas: {
        Attachment: attachmentSchema,
        CalendarItem: calendarItemSchema,
        CalendarSiteData: {
          ...calendarSiteDataSchema,
          examples: firstCalendarEntry ? [firstCalendarEntry.data] : undefined,
        },
        NoticeItem: noticeItemSchema,
        NoticeSiteData: {
          ...noticeSiteDataSchema,
          examples: firstNoticeEntry ? [firstNoticeEntry.data] : undefined,
        },
        SiteIndex: {
          ...siteIndexSchema,
          examples: sites.length > 0 ? [sites] : undefined,
        },
        SiteMetadata: siteMetadataSchema,
      },
    },
    info: {
      description:
        'SSUFID가 배포하는 숭실대학교 공지사항/캘린더 JSON, RSS, iCalendar feed와 site index의 통합 OpenAPI 문서입니다.',
      title: 'SSUFID Feed API',
      version: '1.1.0',
    },
    openapi: '3.1.0',
    paths,
    servers: [{ url: 'https://ssufid.yourssu.com' }],
    tags: [
      {
        description: '배포 중인 SSUFID feed 목록',
        name: 'Site index',
      },
      {
        description: '숭실대학교 공지사항 JSON/RSS feed',
        name: 'Notice feeds',
      },
      {
        description: '숭실대학교 일정 JSON/iCalendar feed',
        name: 'Calendar feeds',
      },
    ],
  };
}

function parseSiteEntry(filePath) {
  const fullPath = resolve(projectRoot, filePath);
  const slug = dirname(filePath);
  const siteDir = resolve(projectRoot, slug);
  const rssPath = resolve(siteDir, 'rss.xml');
  const calendarIcsPath = resolve(siteDir, 'calendar.ics');
  const rawData = JSON.parse(readFileSync(fullPath, 'utf-8'));
  const noticeResult = NoticeSiteDataSchema.safeParse(rawData);
  const calendarResult = CalendarSiteDataSchema.safeParse(rawData);
  const hasRss = existsSync(rssPath);
  const hasCalendarIcs = existsSync(calendarIcsPath);

  let data;
  let feedType;

  if (hasCalendarIcs) {
    if (!calendarResult.success) {
      throw calendarResult.error;
    }

    data = calendarResult.data;
    feedType = 'calendar';
  } else if (hasRss) {
    if (!noticeResult.success) {
      throw noticeResult.error;
    }

    data = noticeResult.data;
    feedType = 'notice';
  } else if (noticeResult.success && !calendarResult.success) {
    data = noticeResult.data;
    feedType = 'notice';
  } else if (calendarResult.success && !noticeResult.success) {
    data = calendarResult.data;
    feedType = 'calendar';
  } else {
    throw new Error(`Unable to determine feed type for ${filePath}`);
  }

  return {
    data,
    description: data.description || '',
    feedType,
    hasCalendarIcs,
    hasRss,
    itemCount: data.items.length,
    slug,
    source: data.source || '',
    title: data.title || slug,
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
  .map((filePath) => parseSiteEntry(filePath))
  .sort((a, b) => a.title.localeCompare(b.title, 'ko'));

const sites = siteEntries.map(({ description, itemCount, slug, source, title }) => ({
  description,
  itemCount,
  slug,
  source,
  title,
}));

const openApiDocument = createOpenApiDocument(siteEntries, sites);
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
console.log(`   Total items: ${sites.reduce((sum, site) => sum + site.itemCount, 0)}\n`);
