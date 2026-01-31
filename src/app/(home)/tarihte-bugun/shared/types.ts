export type OnThisDayPage = {
  title: string;
  normalizedtitle?: string;
  displaytitle?: string;
  extract?: string;
  extract_html?: string;
  thumbnail?: {
    source: string;
    width?: number;
    height?: number;
  };
  content_urls?: {
    desktop?: { page?: string };
    mobile?: { page?: string };
  };
};

export type OnThisDayEvent = {
  text: string;
  year: number;
  pages?: OnThisDayPage[];
};

export type OnThisDayResponse = {
  events?: OnThisDayEvent[];
};

export type WikiSummary = {
  title: string;
  extract?: string;
  thumbnail?: { source: string; width?: number; height?: number };
  content_urls?: {
    desktop?: { page?: string };
    mobile?: { page?: string };
  };
};
