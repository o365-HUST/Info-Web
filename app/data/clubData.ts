import type {
  ClubInfo,
  RecruitmentInfo,
  Department,
  BlogPost,
  EventItem,
  StatItem,
} from "../types";

export const CLUB_INFO: ClubInfo = {
  name: "CLB o365 - HUST",
  officialTitle: "Câu lạc bộ o365 - Đại học Bách khoa Hà Nội",
  role: "Đại sứ Chuyển đổi số trường Đại học Bách khoa Hà Nội",
  affiliation:
    "Ban Công tác Sinh viên (Ban CTSV) - Đại học Bách khoa Hà Nội",
  leader: {
    name: "Dương Đức Tùng",
    role: "Chủ nhiệm CLB",
    phone: "098 128 92 50",
  },
  email: "clbo365@husteduvn.onmicrosoft.com",
  phone: "098 128 92 50",
  locations: [
    {
      title: "Trạm hỗ trợ Thư viện",
      detail: "Phòng 907, Tầng 9 — Thư viện Tạ Quang Bửu",
    },
    {
      title: "Văn phòng sinh hoạt",
      detail: "Tầng 2 — Tòa nhà Alumni (Cựu sinh viên)",
    },
    {
      title: "Điểm tư vấn D4",
      detail: "Phòng 105 - Nhà D4, ĐHBK Hà Nội",
    },
    {
      title: "Điểm tư vấn C1",
      detail: "Phòng 101 - Nhà C1, ĐHBK Hà Nội",
    },
  ],
  portalUrl: "https://husteduvn.sharepoint.com/sites/o365public",
  fanpageUrl: "https://www.facebook.com/o365.hust",
  groupUrl: "https://www.facebook.com/groups/o365.hust",
  messengerUrl: "https://m.me/128378800356813",
  tiktokUrl: "https://www.tiktok.com/@clbo365_hust",
  youtubeUrl: "https://www.youtube.com/@clbo365hust",
};

export const RECRUITMENT_INFO: RecruitmentInfo = {
  campaignName: "RECRUITMENT 3.0",
  generation: "Gen 3.0",
  deadlineDate: "2026-09-12T23:59:59+07:00",
  deadlineDisplay: "23h59 ngày 12/09/2026",
  formUrl:
    "https://forms.cloud.microsoft/pages/responsepage.aspx?id=n7jxBugHT0a0COwbRXA_MSSvKm1-gMtKoJa8JBvvNn1UMVpTOVQ4OVJEMkpQODZTTUhHWlRXUDRTRy4u&origin=lprLink&route=shorturl",
  callToAction: "Đăng ký ngay",
};

export const STATS: StatItem[] = [
  { value: 100, suffix: "+", label: "Thành viên", icon: "Users" },
  { value: 15, suffix: "+", label: "Sự kiện/năm", icon: "Calendar" },
  { value: 5, suffix: "", label: "Năm hoạt động", icon: "Award" },
];

export const DEPARTMENTS: Department[] = [
  {
    id: "ban-chu-nhiem",
    index: "01",
    name: "Ban Chủ nhiệm",
    icon: "Crown",
    image: "/assets/departments/dept-01-leadership.jpg",
    color: "#EEF2FF",
    accentColor: "#4F46E5",
    tagline: "Định hướng chiến lược, dẫn dắt đội ngũ",
    description:
      "Bộ phận điều hành cấp cao, chịu trách nhiệm hoạch định chiến lược, điều phối hoạt động giữa các ban và đại diện CLB trong mọi công tác đối ngoại.",
    leader: {
      name: "Dương Đức Tùng",
      role: "Chủ nhiệm CLB",
    },
  },
  {
    id: "chuyen-mon",
    index: "02",
    name: "Ban Chuyên môn",
    icon: "BookOpen",
    image: "/assets/departments/dept-02-academic.jpg",
    color: "#EFF6FF",
    accentColor: "#0078D4",
    tagline: "Làm chủ tri thức, khai phá công nghệ",
    description:
      "Nghiên cứu chuyên sâu hệ sinh thái Microsoft 365, bồi dưỡng kỹ năng tin học văn phòng quốc tế MOS và huấn luyện đội tuyển tham gia đấu trường MOSWC.",
    leader: {
      name: "Trần Bảo Long",
      role: "Trưởng ban Chuyên môn",
    },
  },
  {
    id: "truyen-thong",
    index: "03",
    name: "Ban Truyền thông",
    icon: "Megaphone",
    image: "/assets/departments/dept-03-media.jpg",
    color: "#FFFBEB",
    accentColor: "#F59E0B",
    tagline: "Thắp sáng hình ảnh thương hiệu o365",
    description:
      "Sáng tạo nội dung, thiết kế ấn phẩm đồ họa thị giác, nhiếp ảnh và phát triển đa kênh truyền thông chính thức của CLB trên toàn trường.",
    leader: {
      name: "Nguyễn Thảo Linh",
      role: "Trưởng ban Truyền thông",
    },
  },
  {
    id: "su-kien",
    index: "04",
    name: "Ban Sự kiện",
    icon: "PartyPopper",
    image: "/assets/departments/dept-04-events.jpg",
    color: "#FEF2F2",
    accentColor: "#EF4444",
    tagline: "Thổi bùng năng lượng mọi chương trình",
    description:
      "Lên ý tưởng kịch bản, điều phối hậu cần và tổ chức các sự kiện quy mô lớn: Vòng loại MOSWC HUST, workshop công nghệ và teambuilding gắn kết.",
    leader: {
      name: "Vũ Hoàng Minh",
      role: "Trưởng ban Sự kiện",
    },
  },
  {
    id: "tai-chinh-nhan-su",
    index: "05",
    name: "Ban Tài chính & Nhân sự",
    icon: "Heart",
    image: "/assets/departments/dept-05-hr.jpg",
    color: "#ECFDF5",
    accentColor: "#10B981",
    tagline: "Ươm mầm và gắn kết từng thành viên",
    description:
      "Quản trị tài nguyên con người và nguồn lực vận hành, chăm sóc đời sống tinh thần, đào tạo kỹ năng mềm và xây dựng cầu nối bền vững giữa các thế hệ.",
    leader: {
      name: "Lê Phương Thảo",
      role: "Trưởng ban Nhân sự",
    },
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "devlog-phan-ban",
    title: "Devlog: Hành trình xây dựng website mới cho CLB o365",
    excerpt:
      "Chia sẻ quá trình thiết kế, lựa chọn công nghệ và những bài học rút ra khi đội ngũ kỹ thuật bắt tay vào dự án web mới.",
    tag: "Devlog",
    date: "05/09/2026",
    thumbnail: "/assets/blog/thumb-devlog.jpg",
    url: "#",
  },
  {
    id: "moswc-2026",
    title: "MOSWC 2026: Hành trình chinh phục kỹ năng số quốc tế",
    excerpt:
      "Tổng kết vòng loại MOSWC tại ĐHBK Hà Nội — từ khâu tổ chức, ôn luyện đến những gương mặt xuất sắc đại diện trường.",
    tag: "Cuộc thi",
    date: "28/08/2026",
    thumbnail: "/assets/blog/thumb-moswc.jpg",
    url: "#",
  },
  {
    id: "hanh-trinh-do",
    title: "Hành trình Đỏ Quảng Tây: Khi o365 vươn tầm quốc tế",
    excerpt:
      "Câu chuyện về chuyến nghiên cứu học tập tại Trung Quốc — nơi các thành viên CLB trải nghiệm và hỗ trợ đoàn đại biểu nhà trường.",
    tag: "Hành trình",
    date: "21/04/2026",
    thumbnail: "/assets/blog/thumb-redjourney.jpg",
    url: "#",
  },
];

export const EVENTS: EventItem[] = [
  {
    id: "recruitment-3",
    month: "Tháng 9",
    title: "Tuyển thành viên Gen 3.0",
    linkLabel: "Đăng ký ứng tuyển",
    linkUrl: RECRUITMENT_INFO.formUrl,
  },
  {
    id: "workshop-ai",
    month: "Tháng 10",
    title: "Workshop AI Skills for Students",
    linkLabel: "Cổng CTSV — Lấy ĐRL",
    linkUrl: "#",
  },
  {
    id: "teambuilding",
    month: "Tháng 11",
    title: "Teambuilding Mùa Thu 2026",
    linkLabel: "Đăng ký nội bộ",
    linkUrl: "#",
  },
  {
    id: "moswc-qualifier",
    month: "Tháng 12",
    title: "Vòng loại MOSWC HUST 2027",
    linkLabel: "Xem chi tiết",
    linkUrl: "#",
  },
];

export const NAV_LINKS = [
  { label: "Trang chủ", href: "#top" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Cơ cấu ban", href: "#departments" },
  { label: "Blog", href: "#blog" },
  { label: "Sự kiện", href: "#events" },
] as const;
