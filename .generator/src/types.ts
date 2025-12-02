export interface NoticeItem {
  id: string;
  title: string;
  link: string;
  author: string;
  created_at: string;
  content: string;
  category: string[];
  attachments: string[];
}

export interface SiteData {
  title: string;
  source: string;
  description: string;
  items: NoticeItem[];
}

export interface SiteMetadata {
  slug: string;
  title: string;
  description: string;
  source: string;
  itemCount: number;
}
