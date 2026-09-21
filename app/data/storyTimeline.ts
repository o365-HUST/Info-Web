import type { Milestone, MilestoneType } from "@/app/types";
import { sortKeyOf } from "@/app/lib/milestoneBoard";

export type StoryTimelineVariant =
  | "default"
  | "founding"
  | "achievement"
  | "alumni"
  | "photo";

export type StoryTimelineIcon =
  | "flag"
  | "trophy"
  | "graduation-cap"
  | "image"
  | "sparkles"
  | "users"
  | "heart"
  | "rocket"
  | "award"
  | "megaphone";

export interface StoryTimelineEntry extends Milestone {
  variant: StoryTimelineVariant;
  icon: StoryTimelineIcon;
  accentClass?: string;
}

function variantFor(m: Milestone): StoryTimelineVariant {
  if (m.type === "alumni") return "alumni";
  if (m.type === "photo") return "photo";
  if (m.type === "thanh_tich") return "achievement";
  if (
    m.id === "tien-than-2023" ||
    m.id === "ngay-sinh-2024" ||
    m.id === "doi-ten-o365-2024"
  ) {
    return "founding";
  }
  return "default";
}

function iconFor(m: Milestone): StoryTimelineIcon {
  switch (m.type) {
    case "thanh_tich":
      if (m.title.toLowerCase().includes("fanpage")) return "megaphone";
      if (m.title.toLowerCase().includes("tuổi")) return "heart";
      return "trophy";
    case "alumni":
      return "graduation-cap";
    case "photo":
      return "image";
    default:
      if (m.id.includes("recruitment") || m.id.includes("tuyen")) return "users";
      if (m.id.includes("khoi-dong") || m.id === "ctv-chuyen-doi-so-2024")
        return "rocket";
      if (m.id === "tam-ngung-2023") return "flag";
      return "flag";
  }
}

function accentFor(m: Milestone): string | undefined {
  switch (variantFor(m)) {
    case "founding":
      return "bg-yellow-300 text-ink";
    case "achievement":
      return "bg-pink-400 text-ink";
    case "alumni":
      return "bg-emerald-400 text-ink";
    case "photo":
      return "bg-orange-400 text-ink";
    default:
      return "bg-blue-400 text-ink";
  }
}

const RAW_ENTRIES: Omit<StoryTimelineEntry, "variant" | "icon" | "accentClass">[] =
  [
    {
      id: "tien-than-2023",
      type: "moc",
      year: 2023,
      dateLabel: "08/2023",
      sortKey: "2023-08",
      title: "Thành lập tiền thân Office 365",
      description:
        "CLB Office 365 được thành lập – tiền thân là Chi bộ sinh viên Đại học bao gồm các Khoa Toán Tin, Vật lý kỹ thuật, Sư phạm kỹ thuật,… Đây là quá trình thành lập chưa chính thức, chưa có đề án giấy tờ, văn bản cụ thể xác minh. Đơn vị bảo trợ: Ban CTSV.",
    },
    {
      id: "tam-ngung-2023",
      type: "moc",
      year: 2023,
      dateLabel: "10/2023",
      sortKey: "2023-10",
      title: "Tạm ngưng hoạt động",
      description:
        "Do không có định hướng cụ thể sau khi hoạt động 2 tháng, CLB tạm ngưng hoạt động vô thời hạn.",
    },
    {
      id: "khoi-dong-lai-2024",
      type: "moc",
      year: 2024,
      dateLabel: "04/2024",
      sortKey: "2024-04",
      title: "Khởi động lại đề án thành lập",
      description:
        "Đề án thành lập CLB o365 được khởi động lại. Trong suốt 1 tháng lên ý tưởng và xác định tầm nhìn, CLB đổi mới cơ cấu tổ chức và định hướng phát triển.",
    },
    {
      id: "doi-ten-o365-2024",
      type: "moc",
      year: 2024,
      dateLabel: "02/05/2024",
      sortKey: "2024-05-02",
      title: "Đổi tên thành CLB o365 – HUST",
      description:
        "CLB đổi tên thành CLB o365 – HUST với chủ nhiệm đầu tiên là Dương Đức Tùng – người ký đề án xác nhận thành lập và chịu trách nhiệm CLB. Đơn vị trực thuộc Ban CTSV ĐHBKHN.",
    },
    {
      id: "ngay-sinh-2024",
      type: "moc",
      year: 2024,
      dateLabel: "05/05/2024",
      sortKey: "2024-05-05",
      title: "Ngày sinh chính thức của CLB",
      description:
        "CLB o365 – HUST chính thức thay màu cho Fanpage và đây cũng là dấu mốc được lựa chọn làm ngày sinh của CLB.",
    },
    {
      id: "ctv-chuyen-doi-so-2024",
      type: "moc",
      year: 2024,
      dateLabel: "16/10/2024",
      sortKey: "2024-10-16",
      title: "Trở thành CTV Trung tâm Chuyển đổi số",
      description:
        "CLB o365 – HUST tiếp tục phát triển, trở thành Cộng tác viên của Trung tâm Chuyển đổi số đại học.",
    },
    {
      id: "tuyen-ctv-gen1-2024",
      type: "moc",
      year: 2024,
      dateLabel: "09–12/2024",
      sortKey: "2024-11",
      title: "Tuyển CTV Gen 1.0",
      description:
        "CLB o365 – HUST tiến hành tuyển CTV Gen 1.0. Số lượng CTV sau phỏng vấn: 37.",
    },
    {
      id: "fanpage-10k-2024",
      type: "thanh_tich",
      year: 2024,
      dateLabel: "12/2024",
      sortKey: "2024-12",
      title: "Fanpage đạt 10k followers",
      description: "Fanpage CLB o365 – HUST đạt 10k followers.",
    },
    {
      id: "kien-toan-khoa1-2025",
      type: "thanh_tich",
      year: 2025,
      dateLabel: "02/2025",
      sortKey: "2025-02",
      title: "Kiện toàn khóa 1.0",
      description:
        "Kiện toàn khóa 1.0 của CLB. Số lượng thành viên chính thức: 52.",
    },
    {
      id: "anh-kienn-toan-khoa1-2025",
      type: "photo",
      year: 2025,
      dateLabel: "02/2025",
      sortKey: "2025-02-a",
      title: "Kiện toàn khóa 1.0",
      description:
        "Khoảnh khắc kiện toàn khóa 1.0 — 52 thành viên chính thức cùng nhau tạo nên bước ngoặt quan trọng của CLB.\n\nXem thêm bài viết về hành trình xây dựng đội ngũ.",
      relatedPostId: "devlog-phan-ban",
      images: ["/assets/marquee/marquee-08.jpg"],
    },
    {
      id: "quan-ly-moswc-2025",
      type: "thanh_tich",
      year: 2025,
      dateLabel: "03–04/2025",
      sortKey: "2025-03",
      title: "Chủ trì đội tuyển MOSWC ĐHBK",
      description:
        "CLB là đầu mối, đơn vị chủ trì quản lý đội tuyển MOSWC của ĐHBKHN.",
      relatedPostId: "moswc-2026",
    },
    {
      id: "mot-tuoi-2025",
      type: "thanh_tich",
      year: 2025,
      dateLabel: "05/05/2025",
      sortKey: "2025-05-05",
      title: "CLB tròn 1 tuổi",
      description: "CLB o365 – HUST tròn 1 tuổi.",
    },
    {
      id: "fanpage-24k-2025",
      type: "thanh_tich",
      year: 2025,
      dateLabel: "Giữa 05/2025",
      sortKey: "2025-05-mid",
      title: "Fanpage đạt 24k followers",
      description: "Fanpage CLB o365 – HUST đạt 24k followers.",
    },
    {
      id: "recruitment-2-2025",
      type: "moc",
      year: 2025,
      dateLabel: "08/09/2025",
      sortKey: "2025-09-08",
      title: "RECRUITMENT 2.0",
      description:
        "CLB o365 – HUST mở chiến dịch tuyển quân RECRUITMENT 2.0.",
    },
    {
      id: "hoi-nghi-kien-toan-2026",
      type: "moc",
      year: 2026,
      dateLabel: "16/01/2026",
      sortKey: "2026-01-16",
      title: "Hội nghị kiện toàn nhân sự 2025 – 2026",
      description:
        "Hội nghị kiện toàn nhân sự CLB o365 – HUST năm học 2025 – 2026.",
    },
    {
      id: "hai-tuoi-2026",
      type: "thanh_tich",
      year: 2026,
      dateLabel: "05/05/2026",
      sortKey: "2026-05-05",
      title: "CLB tròn 2 tuổi",
      description: "CLB o365 – HUST tròn 2 tuổi.",
    },
    {
      id: "recruitment-3-2026",
      type: "moc",
      year: 2026,
      dateLabel: "03/09/2026",
      sortKey: "2026-09-03",
      title: "RECRUITMENT 3.0",
      description:
        "CLB o365 – HUST mở chiến dịch tuyển quân RECRUITMENT 3.0.",
    },
    {
      id: "fanpage-42k-2026",
      type: "thanh_tich",
      year: 2026,
      dateLabel: "10/09/2026",
      sortKey: "2026-09-10",
      title: "Fanpage đạt 42k followers",
      description: "Fanpage CLB o365 – HUST đạt 42k followers.",
    },
  ];

function enrich(entry: (typeof RAW_ENTRIES)[number]): StoryTimelineEntry {
  const milestone = entry as Milestone;
  return {
    ...entry,
    variant: variantFor(milestone),
    icon: iconFor(milestone),
    accentClass: accentFor(milestone),
  };
}

export const STORY_TIMELINE: StoryTimelineEntry[] = RAW_ENTRIES.map(enrich).sort(
  (a, b) => sortKeyOf(a).localeCompare(sortKeyOf(b)) || a.title.localeCompare(b.title),
);

export function storyEntryToMilestone(entry: StoryTimelineEntry): Milestone {
  const { variant: _v, icon: _i, accentClass: _a, ...milestone } = entry;
  return milestone;
}

export function resolveTimelineVariant(type: MilestoneType): StoryTimelineVariant {
  return variantFor({ type } as Milestone);
}

// {
//   id: "alumni-spotlight-2026",
//   type: "alumni",
//   year: 2026,
//   dateLabel: "09/2026",
//   sortKey: "2026-09-15",
//   title: "Cựu thành viên tiêu biểu",
//   alumniName: "Nguyễn Minh Anh",
//   alumniRole: "Microsoft MVP · Cựu Trưởng ban Kỹ thuật",
//   alumniAvatar: "/assets/marquee/marquee-08.jpg",
//   alumniQuote:
//     "CLB o365 là nơi mình học cách biến kỹ năng Office thành giá trị thật cho cộng đồng sinh viên Bách khoa.",
//   alumniLink: "https://www.microsoft.com",
//   description:
//     "Gen 1.0 — góp phần xây dựng hệ thống quản trị và website CLB trong giai đoạn đầu.",
//   relatedPostId: "devlog-phan-ban",
//   threaded: false,
// },