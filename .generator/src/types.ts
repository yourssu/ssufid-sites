export interface NoticeItem {
  attachments: string[];
  author: string;
  category: string[];
  content: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_at: string;
  id: string;
  link: string;
  title: string;
}

export interface SiteData {
  description: string;
  items: NoticeItem[];
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
