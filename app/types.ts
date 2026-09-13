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
  /** Show recruitment CTAs on navbar, hero, and department pages */
  visible: boolean;
}

export interface DepartmentBentoItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type: "photo" | "stat" | "quote" | "skills" | "activity";
  colSpan?: string; // Tailwind grid col class e.g. "col-span-1" | "col-span-2"
  accent?: string;
  badge?: string;
  description?: string;
  quoteAuthor?: string;
  skills?: string[];
  statValue?: string;
  statLabel?: string;
}

export interface DepartmentGallerySlide {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  fit?: "cover" | "contain";
}

export interface Department {
  id: string;
  index: string;
  name: string;
  slugs?: string[];
  icon: string; // lucide icon name
  image: string;
  color: string; // pastel hex for card bg
  accentColor: string; // stronger accent for icon/border
  tagline: string;
  description: string;
  fullDescription?: string;
  mission?: string;
  leader?: { name: string; role: string; quote?: string; avatar?: string };
  viceLeaders?: Array<{ name: string; role: string; avatar?: string }>;
  stats?: Array<{ label: string; value: string; desc?: string }>;
  keyActivities?: Array<{ title: string; desc: string; icon?: string }>;
  skillsLearned?: string[];
  /** Thành tích / dấu ấn thành viên tiêu biểu */
  memberHighlights?: Array<{ name: string; detail: string }>;
  /** Activity photos for the Điểm nhấn gallery (not the hero team shot) */
  gallery?: DepartmentGallerySlide[];
  bentoItems?: DepartmentBentoItem[];
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

export interface Advisor {
  id: string;
  name: string;
  medal: string;
  event: string;
  app: "excel" | "powerpoint" | "word";
  medalTier: "gold" | "bronze";
  subjectLabel: string;
  year: number;
}

export interface MissionItem {
  title: string;
  detail: string;
  image: string;
  imageAlt: string;
}

export type ResourceAttachmentType =
  | "office"
  | "pdf"
  | "image"
  | "video"
  | "other";

export interface ResourceAttachment {
  id: string;
  name: string;
  url: string;
  type: ResourceAttachmentType;
  size?: number;
  /** Firebase Storage object path — used for reliable deletes */
  storagePath?: string;
}

export interface ResourcePageData {
  title: string;
  content: string;
  attachments: ResourceAttachment[];
  updatedAt?: string;
}
