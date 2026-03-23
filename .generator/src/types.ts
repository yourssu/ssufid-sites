export interface SsufidPost {
  attachments: string[];
  author: string;
  category: string[];
  content: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: string;
  description: null | string;
  id: string;
  metadata: unknown;
  thumbnail: null | string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  updated_at: null | string;
  url: string;
}

export interface SiteData {
  description: string;
  items: SsufidPost[];
  source: string;
  title: string;
}

export interface SiteMetadata {
  description: string;
  itemCount: number;
  slug: string;
  source: string;
  title: string;
}
