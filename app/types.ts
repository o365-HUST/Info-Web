export interface ClubInfo {
  name: string;
  officialTitle: string;
  role: string;
  affiliation: string;
  leader: { name: string; role: string; phone: string };
  email: string;
  phone: string;
  locations: Array<{ title: string; detail: string }>;
  portalUrl: string;
  fanpageUrl: string;
  groupUrl: string;
  messengerUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
}

export interface RecruitmentInfo {
  campaignName: string;
  generation: string;
  deadlineDate: string;
  deadlineDisplay: string;
  formUrl: string;
  callToAction: string;
}

export interface Department {
  id: string;
  index: string;
  name: string;
  icon: string; // lucide icon name
  image: string;
  color: string; // pastel hex for card bg
  accentColor: string; // stronger accent for icon/border
  tagline: string;
  description: string;
  leader?: { name: string; role: string };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  thumbnail: string;
  url: string;
  content?: string;
  published?: boolean;
  author?: string;
}

export type EventStatus = "ongoing" | "upcoming" | "past";

export interface EventItem {
  id: string;
  month: string;
  title: string;
  linkLabel: string;
  linkUrl: string;
  description?: string;
  location?: string;
  status?: EventStatus;
  category?: string;
  drl?: string;
  isHighlight?: boolean;
  funnyQuote?: string;
  targetDate?: string;
  reactions?: Record<string, number>;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: string; // lucide icon name
}
