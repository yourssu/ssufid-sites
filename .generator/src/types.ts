export interface Attachment {
  mime_type: null | string;
  name: null | string;
  url: string;
}

export interface SsufidPost {
  attachments: Attachment[];
  author: null | string;
  category: string[];
  content: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: string;
  description: null | string;
  id: string;
  metadata: null | Record<string, string>;
  thumbnail: null | string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updated_at: null | string;
  url: string;
}

export interface CalendarItem {
  description: null | string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ends_at: string;
  id: string;
  location: null | string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  starts_at: string;
  title: string;
  url: string;
}

export interface NoticeSiteData {
  description: string;
  items: SsufidPost[];
  source: string;
  title: string;
}

export interface CalendarSiteData {
  description: string;
  items: CalendarItem[];
  source: string;
  title: string;
}

export type SiteData = CalendarSiteData | NoticeSiteData;

export interface SiteMetadata {
  description: string;
  itemCount: number;
  slug: string;
  source: string;
  title: string;
}
