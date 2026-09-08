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
    slugs: ["ban-chu-nhiem", "chu-nhiem", "leadership"],
    icon: "Crown",
    image: "/assets/departments/dept-01-leadership.jpg",
    color: "#EEF2FF",
    accentColor: "#4F46E5",
    tagline: "Định hướng chiến lược, dẫn dắt đội ngũ",
    description:
      "Bộ phận điều hành cấp cao, chịu trách nhiệm hoạch định chiến lược, điều phối hoạt động giữa các ban và đại diện CLB trong mọi công tác đối ngoại.",
    fullDescription:
      "Ban Chủ nhiệm là đầu tàu dẫn dắt toàn bộ hệ sinh thái CLB o365 - HUST. Với vai trò kết nối trực tiếp cùng Ban Công tác Sinh viên (CTSV) và Trung tâm Chuyển đổi số Đại học Bách khoa Hà Nội, Ban Chủ nhiệm đảm bảo các mục tiêu phát triển văn hóa số, phổ cập Microsoft 365 và MOSWC luôn đi đúng hướng và tạo ra giá trị bền vững cho hàng chục ngàn sinh viên.",
    mission:
      "Kiến tạo môi trường mở, thúc đẩy tinh thần tiên phong số và trao quyền cho từng thành viên o365 phát triển vượt bậc.",
    stats: [
      { label: "Nhiệm kỳ", value: "Gen 3.0", desc: "Kế thừa và bứt phá" },
      { label: "Ban trực thuộc", value: "05 Ban", desc: "Vận hành nhịp nhàng" },
      { label: "Đối tác trường & doanh nghiệp", value: "10+", desc: "Hợp tác chiến lược" },
    ],
    leader: {
      name: "Ban Chủ nhiệm o365",
      role: "Chủ nhiệm & Phó Chủ nhiệm CLB",
      quote: "Chúng mình không chỉ xây dựng một câu lạc bộ, mà đang cùng nhau kiến tạo một cộng đồng số truyền cảm hứng cho sinh viên Bách Khoa.",
    },
    viceLeaders: [
      { name: "Phó Chủ nhiệm Phụ trách Chuyên môn", role: "Điều hành Học thuật & MOSWC" },
      { name: "Phó Chủ nhiệm Phụ trách Vận hành", role: "Điều hành Sự kiện & Truyền thông" },
    ],
    keyActivities: [
      {
        title: "Hoạch định chiến lược nhiệm kỳ",
        desc: "Xây dựng lộ trình hoạt động năm học, chỉ tiêu MOSWC và chương trình đồng hành chuyển đổi số.",
      },
      {
        title: "Đối ngoại & Hợp tác doanh nghiệp",
        desc: "Làm việc cùng Microsoft Việt Nam, IIG Việt Nam và các đơn vị đồng hành tài trợ.",
      },
      {
        title: "Điều phối liên ban & Văn hóa CLB",
        desc: "Gắn kết các ban chuyên môn, duy trì ngọn lửa nhiệt huyết và tinh thần đồng đội Bách Khoa.",
      },
    ],
    skillsLearned: [
      "Quản trị tổ chức & nhân sự",
      "Kỹ năng đàm phán & đối ngoại",
      "Tư duy chiến lược dài hạn",
      "Kỹ năng giải quyết khủng hoảng",
      "Lãnh đạo truyền cảm hứng",
    ],
    bentoItems: [
      {
        id: "lead-hero",
        title: "Họp Định Hướng Chiến Lược Toàn CLB",
        subtitle: "Không gian làm việc & thảo luận kế hoạch hành động Gen 3.0",
        type: "photo",
        image: "/assets/departments/dept-01-leadership.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Chiến Lược",
      },
      {
        id: "lead-stat",
        title: "Quy Mô Kết Nối",
        type: "stat",
        statValue: "35.000+",
        statLabel: "Sinh viên ĐHBK Hà Nội tiếp cận mỗi năm",
        description: "Thông qua các cổng dịch vụ O365, workshop kỹ năng số và chiến dịch MOSWC.",
        colSpan: "col-span-1",
        accent: "#4F46E5",
      },
      {
        id: "lead-quote",
        title: "Tuyên Ngôn Hành Động",
        type: "quote",
        description: "Dẫn dắt bằng sự thấu hiểu, đồng hành bằng sự tận tâm, chuyển đổi số bắt đầu từ con người.",
        quoteAuthor: "Ban Chủ nhiệm o365 - HUST",
        colSpan: "col-span-1",
      },
      {
        id: "lead-skills",
        title: "Kỹ Năng Rèn Luyện Tại Ban",
        type: "skills",
        skills: ["Lãnh đạo", "Chiến lược", "Đối ngoại", "Xử lý vấn đề", "Quản lý ngân sách"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "chuyen-mon",
    index: "02",
    name: "Ban Chuyên môn",
    slugs: ["chuyen-mon", "ban-chuyen-mon", "academic"],
    icon: "BookOpen",
    image: "/assets/departments/dept-02-academic.jpg",
    color: "#EFF6FF",
    accentColor: "#0078D4",
    tagline: "Làm chủ tri thức, khai phá công nghệ",
    description:
      "Nghiên cứu chuyên sâu hệ sinh thái Microsoft 365, bồi dưỡng kỹ năng tin học văn phòng quốc tế MOS và huấn luyện đội tuyển tham gia đấu trường MOSWC.",
    fullDescription:
      "Ban Chuyên môn là hạt nhân tri thức của o365. Nơi hội tụ các kiện tướng Tin học văn phòng, cựu thí sinh đạt giải quốc gia MOS World Championship và các bạn đam mê giải pháp số như Microsoft Copilot, Power Automate, Excel VBA. Ban đảm nhiệm việc biên soạn giáo trình, tổ chức lớp training và hỗ trợ sinh viên chinh phục chứng chỉ quốc tế.",
    mission:
      "Xóa bỏ rào cản công nghệ, giúp mọi sinh viên Bách Khoa thành thạo các công cụ số thiết yếu và đạt chuẩn quốc tế ngay từ ghế nhà trường.",
    stats: [
      { label: "Giải thưởng MOSWC", value: "20+", desc: "Cấp Quốc gia & Thành phố" },
      { label: "Sinh viên được đào tạo", value: "1.200+", desc: "Qua các khóa học ngắn hạn" },
      { label: "Bộ tài liệu chuyên đề", value: "15+", desc: "Word, Excel, PowerPoint, AI" },
    ],
    leader: {
      name: "Trần Văn A",
      role: "Trưởng ban Chuyên môn",
      quote: "Học công nghệ không phải để trở thành lập trình viên, mà để biến ý tưởng của bạn thành hiện thực với tốc độ nhanh nhất.",
    },
    keyActivities: [
      {
        title: "Đào tạo & Ôn luyện MOSWC HUST",
        desc: "Huấn luyện kỹ năng thực chiến bài thi MOS Word, Excel, PowerPoint chuẩn quốc tế Certiport.",
      },
      {
        title: "Nghiên cứu ứng dụng Microsoft Copilot & AI",
        desc: "Thử nghiệm các tiện ích AI mới nhất để ứng dụng vào làm báo cáo, slide và tự động hóa tác vụ.",
      },
      {
        title: "Trạm Hỗ trợ Học thuật (Peer Support)",
        desc: "Tư vấn và giải đáp thắc mắc về cài đặt Office 365 bản quyền, lỗi OneDrive và các hàm tính toán phức tạp.",
      },
    ],
    skillsLearned: [
      "Làm chủ Microsoft Word, Excel, PowerPoint chuẩn MOS",
      "Ứng dụng Microsoft Copilot & Prompt Engineering",
      "Kỹ năng sư phạm & đứng lớp giảng dạy",
      "Tư duy phân tích dữ liệu và tự động hóa",
      "Biên soạn tài liệu học tập chuyên nghiệp",
    ],
    bentoItems: [
      {
        id: "academic-hero",
        title: "Phòng Huấn Luyện Đội Tuyển MOSWC",
        subtitle: "Rèn luyện kỹ năng thực chiến cùng các cựu đại sứ đạt giải quốc gia",
        type: "photo",
        image: "/assets/departments/dept-02-academic.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Học Thuật",
      },
      {
        id: "academic-stat",
        title: "Thành Tích MOSWC",
        type: "stat",
        statValue: "100%",
        statLabel: "Thành viên ban đạt chứng chỉ MOS Specialist & Expert",
        description: "Nền tảng vững chắc để hướng dẫn và hỗ trợ sinh viên toàn trường.",
        colSpan: "col-span-1",
        accent: "#0078D4",
      },
      {
        id: "academic-quote",
        title: "Phương Châm Tri Thức",
        type: "quote",
        description: "Một hàm Excel thông minh có thể tiết kiệm 5 giờ làm việc thủ công. Công nghệ sinh ra là để phục vụ bạn.",
        quoteAuthor: "Đội ngũ Chuyên môn o365",
        colSpan: "col-span-1",
      },
      {
        id: "academic-skills",
        title: "Hệ Sinh Thái Kỹ Năng Đào Tạo",
        type: "skills",
        skills: ["Word Expert", "Excel Mastery", "PowerPoint Design", "Copilot AI", "Power BI", "Data Analysis"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "truyen-thong",
    index: "03",
    name: "Ban Truyền thông",
    slugs: ["truyen-thong", "ban-truyen-thong", "media"],
    icon: "Megaphone",
    image: "/assets/departments/dept-03-media.jpg",
    color: "#FFFBEB",
    accentColor: "#F59E0B",
    tagline: "Thắp sáng hình ảnh thương hiệu o365",
    description:
      "Sáng tạo nội dung, thiết kế ấn phẩm đồ họa thị giác, nhiếp ảnh và phát triển đa kênh truyền thông chính thức của CLB trên toàn trường.",
    fullDescription:
      "Ban Truyền thông là người kể chuyện và xây dựng bộ nhận diện thị giác độc đáo của o365 HUST. Từ những bài viết dí dỏm chuẩn tâm lý sinh viên Bách Khoa trên fanpage, những bộ ấn phẩm đồ họa phong cách Neo-Brutalist sắc sảo, cho đến các thước phim recap sự kiện triệu view trên TikTok — Ban Truyền thông kết nối câu chuyện công nghệ đến từng giảng đường.",
    mission:
      "Biến những kiến thức tin học khô khan thành những câu chuyện gần gũi, sáng tạo và thu hút sinh viên thế hệ số.",
    stats: [
      { label: "Lượt theo dõi Fanpage", value: "25.000+", desc: "Kênh truyền thông chính thức" },
      { label: "Ấn phẩm thiết kế / kỳ", value: "150+", desc: "Poster, Infographic, Banner" },
      { label: "Tương tác trung bình", value: "3.500+", desc: "Mỗi chiến dịch truyền thông" },
    ],
    leader: {
      name: "Trần Văn A",
      role: "Trưởng ban Truyền thông",
      quote: "Hình ảnh đẹp khiến người ta dừng lại 3 giây, nhưng thông điệp chân thành mới là điều giữ người xem ở lại lâu dài.",
    },
    keyActivities: [
      {
        title: "Sáng tạo nội dung & Copywriting",
        desc: "Sản xuất chuỗi bài viết chia sẻ mẹo tin học văn phòng, điểm tin công nghệ và câu chuyện đời sống Bách Khoa.",
      },
      {
        title: "Thiết kế đồ họa & Visual Branding",
        desc: "Thiết kế toàn bộ hệ thống ấn phẩm nhận diện, slide hội thảo và poster tuyển quân.",
      },
      {
        title: "Nhiếp ảnh & Sản xuất Video",
        desc: "Ghi lại những khoảnh khắc bùng nổ trong các sự kiện, phỏng vấn và dựng video ngắn xu hướng.",
      },
    ],
    skillsLearned: [
      "Thiết kế Photoshop, Illustrator, Figma",
      "Copywriting & Kỹ năng xây dựng góc nhìn truyền thông",
      "Chụp ảnh sự kiện & quay dựng video ngắn Premiere / CapCut",
      "Quản trị Fanpage & phân tích dữ liệu mạng xã hội",
      "Tư duy thẩm mỹ và xây dựng câu chuyện thị giác",
    ],
    bentoItems: [
      {
        id: "media-hero",
        title: "Không Gian Sáng Tạo & Thiết Kế Ấn Phẩm",
        subtitle: "Nơi ra đời những bộ nhận diện sự kiện mang đậm dấu ấn sinh viên số Bách Khoa",
        type: "photo",
        image: "/assets/departments/dept-03-media.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Truyền Thông",
      },
      {
        id: "media-stat",
        title: "Tầm Ảnh Hưởng",
        type: "stat",
        statValue: "150K+",
        statLabel: "Lượt tiếp cận bài viết mỗi chiến dịch tuyển quân",
        description: "Lan tỏa hình ảnh năng động, sáng tạo của Đại sứ Số HUST.",
        colSpan: "col-span-1",
        accent: "#F59E0B",
      },
      {
        id: "media-quote",
        title: "DNA Truyền Thông",
        type: "quote",
        description: "Sáng tạo không có giới hạn, nhưng luôn phải chạm đúng nhu cầu và cảm xúc của sinh viên.",
        quoteAuthor: "Đội ngũ Truyền thông o365",
        colSpan: "col-span-1",
      },
      {
        id: "media-skills",
        title: "Công Cụ & Kỹ Năng Chủ Lực",
        type: "skills",
        skills: ["Figma Design", "Photoshop", "Illustrator", "Premiere", "Social Media Strategy", "Storytelling"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "su-kien",
    index: "04",
    name: "Ban Sự kiện",
    slugs: ["su-kien", "ban-su-kien", "events"],
    icon: "PartyPopper",
    image: "/assets/departments/dept-04-events.jpg",
    color: "#FEF2F2",
    accentColor: "#EF4444",
    tagline: "Thổi bùng năng lượng mọi chương trình",
    description:
      "Lên ý tưởng kịch bản, điều phối hậu cần và tổ chức các sự kiện quy mô lớn: Vòng loại MOSWC HUST, workshop công nghệ và teambuilding gắn kết.",
    fullDescription:
      "Ban Sự kiện là trái tim nhiệt huyết vận hành mọi chương trình của CLB o365. Từ việc lên kịch bản chi tiết, dàn dựng sân khấu tại Hội trường C2, điều phối âm thanh ánh sáng cho đến tổ chức các chuyến dã ngoại teambuilding gắn kết hàng trăm thành viên — Ban Sự kiện luôn biến mọi ý tưởng trên giấy thành những trải nghiệm bùng nổ ngoài đời thực.",
    mission:
      "Mang đến những sân chơi học thuật chuyên nghiệp, giàu cảm xúc và kết nối sinh viên Bách Khoa qua từng khoảnh khắc đáng nhớ.",
    stats: [
      { label: "Sự kiện tổ chức / năm", value: "15+", desc: "Hội thảo, Cuộc thi, Teambuilding" },
      { label: "Quy mô người tham dự", value: "3.000+", desc: "Sinh viên trực tiếp tại hội trường" },
      { label: "Tỷ lệ hài lòng", value: "98%", desc: "Theo khảo sát sau sự kiện" },
    ],
    leader: {
      name: "Trần Văn A",
      role: "Trưởng ban Sự kiện",
      quote: "Sự kiện thành công không nằm ở sân khấu hoành tráng, mà ở nụ cười và giá trị mà mỗi bạn sinh viên mang về sau buổi tối hôm đó.",
    },
    keyActivities: [
      {
        title: "Tổ chức Vòng loại MOSWC cấp Trường",
        desc: "Điều phối phòng máy thi, đón tiếp hàng trăm thí sinh và tổ chức lễ trao giải vinh danh.",
      },
      {
        title: "Chuỗi Workshop Kỹ năng số & AI",
        desc: "Chuẩn bị hội trường, đón tiếp diễn giả Microsoft và điều phối hoạt động tương tác nhận ĐRL.",
      },
      {
        title: "Teambuilding & Gala thường niên",
        desc: "Thiết kế các trò chơi teambuilding ngoài trời, lửa trại và đêm gala tổng kết nhiệm kỳ.",
      },
    ],
    skillsLearned: [
      "Lập kế hoạch kịch bản chi tiết & Timeline sự kiện",
      "Quản trị rủi ro & xử lý tình huống phát sinh tại hiện trường",
      "Kỹ năng dẫn chương trình (MC) & hoạt náo đám đông",
      "Điều phối nhân sự hậu cần & thiết bị âm thanh ánh sáng",
      "Làm việc nhóm dưới áp lực cao",
    ],
    bentoItems: [
      {
        id: "event-hero",
        title: "Hội Trường C2 — Nơi Bùng Nổ Cảm Xúc Sự Kiện",
        subtitle: "Không khí sôi động của hàng trăm sinh viên Bách Khoa tham gia Workshop Kỹ năng số",
        type: "photo",
        image: "/assets/departments/dept-04-events.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Sự Kiện",
      },
      {
        id: "event-stat",
        title: "Kỷ Lục Tham Dự",
        type: "stat",
        statValue: "800+",
        statLabel: "Sinh viên tham dự trong 1 buổi hội thảo công nghệ",
        description: "Điểm đến quen thuộc để tích lũy kiến thức và Điểm Rèn Luyện cấp trường.",
        colSpan: "col-span-1",
        accent: "#EF4444",
      },
      {
        id: "event-quote",
        title: "Tinh Thần Sự Kiện",
        type: "quote",
        description: "Cháy hết mình trên sân khấu, thầm lặng cống hiến phía sau cánh gà. Đó là niềm tự hào của Ban Sự kiện.",
        quoteAuthor: "Tập thể Ban Sự kiện o365",
        colSpan: "col-span-1",
      },
      {
        id: "event-skills",
        title: "Kỹ Năng & Lĩnh Vực Hoạt Động",
        type: "skills",
        skills: ["Lập kế hoạch", "Điều phối sân khấu", "Kỹ năng MC", "Quản lý rủi ro", "Hậu cần kỹ thuật"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "tai-chinh-nhan-su",
    index: "05",
    name: "Ban Tài chính & Nhân sự",
    slugs: ["tai-chinh-nhan-su", "ban-tai-chinh-nhan-su", "ban-nhan-su", "hr"],
    icon: "Heart",
    image: "/assets/departments/dept-05-hr.jpg",
    color: "#ECFDF5",
    accentColor: "#10B981",
    tagline: "Ươm mầm và gắn kết từng thành viên",
    description:
      "Quản trị tài nguyên con người và nguồn lực vận hành, chăm sóc đời sống tinh thần, đào tạo kỹ năng mềm và xây dựng cầu nối bền vững giữa các thế hệ.",
    fullDescription:
      "Ban Tài chính & Nhân sự (HR) là điểm tựa ấm áp và là chất keo kết dính của đại gia đình o365 HUST. Ban chịu trách nhiệm tổ chức các đợt tuyển quân thường niên, theo dõi lộ trình phát triển của từng thành viên, tổ chức sinh nhật, chăm sóc đời sống tinh thần và quản lý minh bạch quỹ hoạt động của CLB.",
    mission:
      "Xây dựng một môi trường câu lạc bộ văn minh, ấm áp, nơi mỗi thành viên đều được lắng nghe, tôn trọng và tìm thấy ngôi nhà thứ hai tại Bách Khoa.",
    stats: [
      { label: "Thành viên hoạt động", value: "100+", desc: "Gắn kết qua 3 thế hệ Gen" },
      { label: "Hoạt động gắn kết nội bộ", value: "12+", desc: "Sinh nhật, Boardgame, Trà đá bonding" },
      { label: "Đơn ứng tuyển mỗi đợt", value: "500+", desc: "Chiến dịch tuyển quân Gen mới" },
    ],
    leader: {
      name: "Trần Văn A",
      role: "Trưởng ban Nhân sự",
      quote: "Câu lạc bộ có thể thay đổi dự án, nhưng con người và những kỷ niệm cùng nhau đi qua năm tháng sẽ còn mãi.",
    },
    keyActivities: [
      {
        title: "Điều phối Chiến dịch Tuyển quân Gen mới",
        desc: "Lọc hồ sơ Microsoft Forms, phỏng vấn ứng viên và tổ chức chuỗi thử thách hội nhập.",
      },
      {
        title: "Theo dõi & Đánh giá năng lực thành viên",
        desc: "Hỗ trợ các bạn phát triển kỹ năng mềm, ghi nhận đóng góp và xét khen thưởng cuối kỳ.",
      },
      {
        title: "Quản trị ngân sách & Đời sống tinh thần",
        desc: "Minh bạch thu chi tài chính, tổ chức sinh nhật tháng, bonding cà phê và quà tặng thành viên.",
      },
    ],
    skillsLearned: [
      "Phỏng vấn tuyển dụng & Đánh giá nhân sự",
      "Quản lý tài chính & Thu chi dự án minh bạch",
      "Lắng nghe, thấu cảm & Giải quyết mâu thuẫn nội bộ",
      "Tổ chức văn hóa doanh nghiệp / tổ chức sinh viên",
      "Tự động hóa quản lý dữ liệu nhân sự bằng Excel & Forms",
    ],
    bentoItems: [
      {
        id: "hr-hero",
        title: "Gia Đình o365 — Nơi Hội Tụ Tình Đồng Đội",
        subtitle: "Những buổi bonding ấm cúng sau chuỗi ngày cày deadline bài tập lớn và dự án",
        type: "photo",
        image: "/assets/departments/dept-05-hr.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Nhân Sự",
      },
      {
        id: "hr-stat",
        title: "Tỷ Lệ Gắn Kết",
        type: "stat",
        statValue: "95%",
        statLabel: "Thành viên tiếp tục gắn bó sau năm học đầu tiên",
        description: "Môi trường thân thiện, không khoảng cách giữa tiền bối và hậu bối.",
        colSpan: "col-span-1",
        accent: "#10B981",
      },
      {
        id: "hr-quote",
        title: "Triết Lý Nhân Sự",
        type: "quote",
        description: "Đi nhanh thì đi một mình, đi xa thì đi cùng nhau. Ở o365, không ai bị bỏ lại phía sau.",
        quoteAuthor: "Đội ngũ Nhân sự o365",
        colSpan: "col-span-1",
      },
      {
        id: "hr-skills",
        title: "Kỹ Năng Đào Tạo Nhân Lực",
        type: "skills",
        skills: ["Phỏng vấn tuyển dụng", "Quản lý nhân sự", "Quản trị tài chính", "Kỹ năng thấu cảm", "Team bonding"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
];

export function getDepartmentByIdOrSlug(idOrSlug: string): Department | undefined {
  const normalized = idOrSlug.toLowerCase().trim();
  return DEPARTMENTS.find(
    (d) => d.id === normalized || d.slugs?.includes(normalized)
  );
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "devlog-phan-ban",
    title: "Devlog: Hành trình xây dựng website mới cho CLB o365",
    excerpt:
      "Chia sẻ quá trình thiết kế, lựa chọn công nghệ và những bài học rút ra khi đội ngũ kỹ thuật bắt tay vào dự án web mới.",
    tag: "Devlog",
    date: "05/09/2026",
    author: "Đội ngũ Kỹ thuật o365",
    thumbnail: "/assets/blog/thumb-devlog.jpg",
    url: "/blog/devlog-phan-ban",
    published: true,
    content: `## Khởi đầu và Bài toán Đặt ra

Khi bước vào năm học mới 2026, Câu lạc bộ Đại sứ Chuyển đổi số o365 - ĐHBK Hà Nội nhận thấy nhu cầu cấp thiết về một cổng thông tin chính thức. Website cũ không còn đáp ứng được tốc độ cập nhật thông tin tuyển sinh, quản trị các sự kiện thường niên như MOSWC và lưu trữ tài liệu kỹ thuật dành cho sinh viên.

Đội ngũ kỹ thuật của CLB đã họp bàn và đặt ra 3 tiêu chí cốt lõi:
- **Tốc độ và Trải nghiệm**: Tải trang tức thì, giao diện hiện đại theo phong cách tối giản thanh lịch (Clean & Minimalist).
- **Hệ thống Quản trị (CMS) tức thời**: Ban Điều hành có thể đăng bài viết, tạo sự kiện và cập nhật form tuyển quân chỉ trong vài giây mà không cần can thiệp vào code.
- **Khả năng mở rộng**: Dễ dàng tích hợp các tiện ích số dành cho sinh viên Bách khoa trong tương lai.

## Lựa chọn Công nghệ

Sau khi cân nhắc nhiều giải pháp, nhóm quyết định lựa chọn:
- **Next.js 16 (App Router)**: Cung cấp Server Components, Routing linh hoạt và tối ưu SEO tuyệt đối.
- **Tailwind CSS v4 & Motion**: Hệ thống design tokens đồng nhất, các hiệu ứng vi mô mượt mà không gây giật lag.
- **Firebase Auth & Cloud Firestore**: Cơ sở dữ liệu NoSQL thời gian thực, bảo mật phân quyền với Firebase Security Rules.
- **Firebase Storage**: Lưu trữ an toàn toàn bộ tài nguyên hình ảnh bài viết và ấn phẩm truyền thông.

> "Một sản phẩm công nghệ của sinh viên không chỉ dừng lại ở việc 'chạy được', mà phải đem lại niềm tự hào về mặt thẩm mỹ và sự tiện dụng."

## Những Thách thức Kỹ thuật Đã Vượt qua

Trong quá trình triển khai, đội ngũ đã đối mặt với bài toán đồng bộ dữ liệu hai chiều giữa bộ nhớ đệm ngoại tuyến (Offline Demo fallback) và dữ liệu đám mây Firestore thời gian thực. Bằng cách thiết kế kiến trúc phân tách rõ ràng giữa Service Layer và UI Components, hệ thống có thể chuyển đổi mượt mà giữa chế độ demo và môi trường sản xuất mà không gây lỗi giao diện.

Chúng tôi sẽ tiếp tục cập nhật các tính năng mới trong chuỗi Devlog tiếp theo!`,
  },
  {
    id: "moswc-2026",
    title: "MOSWC 2026: Hành trình chinh phục kỹ năng số quốc tế",
    excerpt:
      "Tổng kết vòng loại MOSWC tại ĐHBK Hà Nội — từ khâu tổ chức, ôn luyện đến những gương mặt xuất sắc đại diện trường.",
    tag: "Cuộc thi",
    date: "28/08/2026",
    author: "Ban Chuyên môn o365",
    thumbnail: "/assets/blog/thumb-moswc.jpg",
    url: "/blog/moswc-2026",
    published: true,
    content: `## Sân chơi Đẳng cấp Quốc tế cho Sinh viên Bách khoa

Cuộc thi Vô địch Tin học Văn phòng Thế giới (MOSWC) hàng năm luôn là một trong những sự kiện trọng tâm mà CLB o365 đồng hành tổ chức tại Đại học Bách khoa Hà Nội. Năm 2026 ghi nhận số lượng thí sinh đăng ký kỷ lục với hơn 1.200 sinh viên tham gia tranh tài ở 3 nội dung: Microsoft Word, Microsoft Excel và Microsoft PowerPoint.

## Công tác Ôn luyện và Huấn luyện Chuyên sâu

Ban Chuyên môn của CLB đã xây dựng lộ trình ôn tập kéo dài 6 tuần:
- **Bộ đề mô phỏng chuẩn Certiport**: Giúp thí sinh làm quen với cấu trúc đề thi thực tế và áp lực thời gian.
- **Các buổi Mentor 1-1**: Các cựu thí sinh đạt giải quốc gia trực tiếp giải đáp thắc mắc và chia sẻ mẹo làm bài tối ưu tốc độ.
- **Hội thảo Chuyên đề**: Hướng dẫn kỹ thuật xử lý các hàm nâng cao trong Excel và thiết kế Master Slide chuyên nghiệp trong PowerPoint.

> "Sự tỉ mỉ và chuẩn xác trong từng thao tác nhỏ chính là chìa khóa để đạt điểm số tuyệt đối 1000/1000 tại đấu trường MOS."

## Kết quả Tự hào

Đoàn sinh viên ĐHBK Hà Nội đã xuất sắc giành được nhiều giải thưởng cao tại vòng loại quốc gia, khẳng định vị thế dẫn đầu trong phong trào nâng cao chuẩn kỹ năng số cho sinh viên kỹ thuật.`,
  },
  {
    id: "hanh-trinh-do",
    title: "Hành trình Đỏ Quảng Tây: Khi o365 vươn tầm quốc tế",
    excerpt:
      "Câu chuyện về chuyến nghiên cứu học tập tại Trung Quốc — nơi các thành viên CLB trải nghiệm và hỗ trợ đoàn đại biểu nhà trường.",
    tag: "Hành trình",
    date: "21/04/2026",
    author: "Ban Truyền thông & Đối ngoại",
    thumbnail: "/assets/blog/thumb-redjourney.jpg",
    url: "/blog/hanh-trinh-do",
    published: true,
    content: `## Dấu ấn Giao lưu Văn hóa và Công nghệ

Chuyến công tác và giao lưu học thuật tại Quảng Tây, Trung Quốc là một kỷ niệm khó quên đối với các thành viên đại diện CLB o365. Chuyến đi không chỉ là cơ hội để học hỏi mô hình chuyển đổi số trong giáo dục của nước bạn, mà còn là dịp để sinh viên Bách khoa thể hiện sự năng động và tự tin trên trường quốc tế.

## Những Hoạt động Nổi bật

- **Hội thảo Trao đổi Kỹ năng Số Sinh viên**: Đại diện o365 đã có bài chia sẻ bằng tiếng Anh về mô hình câu lạc bộ sinh viên đồng hành phổ cập công cụ Microsoft 365 tại ĐHBK Hà Nội.
- **Tham quan Trung tâm Đổi mới Sáng tạo**: Trải nghiệm các giải pháp ứng dụng Trí tuệ nhân tạo (AI) và Điện toán đám mây trong quản lý trường đại học thông minh.
- **Giao lưu Văn hóa**: Kết nối bạn bè quốc tế, lan tỏa hình ảnh sinh viên Bách khoa Hà Nội nhiệt huyết, tài năng và hội nhập.

Hành trình đã mang lại nguồn cảm hứng to lớn để CLB tiếp tục đổi mới và sáng tạo trong các hoạt động sắp tới!`,
  },
];

export const EVENTS: EventItem[] = [
  // ── ĐANG DIỄN RA (ONGOING) ──
  {
    id: "recruitment-3",
    month: "Tháng 9 - 10",
    title: "Tuyển thành viên Gen 3.0: Bứt phá giới hạn số",
    linkLabel: "Nộp đơn ứng tuyển ngay",
    linkUrl: RECRUITMENT_INFO.formUrl,
    description: "Cơ hội trở thành Đại sứ Chuyển đổi số ĐHBK Hà Nội! Đồng hành cùng các dự án công nghệ, MOSWC và workshop toàn trường.",
    location: "Online / Microsoft Forms",
    status: "ongoing",
    category: "Tuyển quân",
    drl: "+5 ĐRL",
    isHighlight: true,
    funnyQuote: "Deadline dí sát nút rồi bạn ơi! Nộp đơn ngay trước khi cổng đóng lúc 23:59!",
    targetDate: "2026-10-15",
    reactions: { fire: 42, drl: 89, deadline: 34, trophy: 28 },
  },
  {
    id: "support-desk-o365",
    month: "Thường niên",
    title: "Trạm Hỗ trợ Sinh viên: Kích hoạt O365 & Copilot HUST",
    linkLabel: "Nhận hỗ trợ kỹ thuật",
    linkUrl: "https://fb.com/clbo365hust",
    description: "Giải đáp lỗi tài khoản Microsoft 365, OneDrive 1TB, cài đặt bộ Office bản quyền cho tân sinh viên K70, K69.",
    location: "Sảnh B1 & Fanpage o365",
    status: "ongoing",
    category: "Công tác SV",
    drl: "+3 ĐRL",
    isHighlight: false,
    funnyQuote: "Cứu tân sinh viên thoát khỏi mê cung đăng nhập tài khoản Bách Khoa!",
    targetDate: "2026-10-30",
    reactions: { fire: 19, drl: 45, deadline: 8, trophy: 12 },
  },

  // ── SẮP DIỄN RA (UPCOMING) ──
  {
    id: "workshop-ai",
    month: "18/10/2026",
    title: "Workshop AI Skills for Students: Làm chủ Microsoft Copilot",
    linkLabel: "Cổng CTSV — Đăng ký lấy ĐRL",
    linkUrl: "https://ctsv.hust.edu.vn",
    description: "Thực hành ứng dụng Copilot trong nghiên cứu, làm slide thuyết trình và xử lý dữ liệu báo cáo chuyên đề.",
    location: "Hội trường C2 - ĐHBK Hà Nội",
    status: "upcoming",
    category: "Học thuật & AI",
    drl: "+8 ĐRL",
    isHighlight: true,
    funnyQuote: "AI không cướp việc của bạn, nhưng bạn biết dùng Copilot sẽ qua môn nhẹ tênh!",
    targetDate: "2026-10-18",
    reactions: { fire: 67, drl: 120, deadline: 15, trophy: 51 },
  },
  {
    id: "moswc-qualifier",
    month: "15/11/2026",
    title: "Vòng loại cấp Trường MOSWC HUST 2027",
    linkLabel: "Xem thể lệ & Đăng ký",
    linkUrl: "https://ctsv.hust.edu.vn",
    description: "Sân chơi Tin học Văn phòng danh giá nhất dành cho sinh viên. Cơ hội rinh chứng chỉ quốc tế và vé đi Mỹ!",
    location: "Phòng máy Thư viện Tạ Quang Bửu",
    status: "upcoming",
    category: "MOS & Thi đấu",
    drl: "+10 ĐRL",
    isHighlight: true,
    funnyQuote: "Bấm chuột giật giải quốc tế, thoát kiếp ám ảnh thi Tin học đại cương!",
    targetDate: "2026-11-15",
    reactions: { fire: 95, drl: 142, deadline: 29, trophy: 110 },
  },
  {
    id: "teambuilding",
    month: "28/11/2026",
    title: "Teambuilding Mùa Thu 2026: Trạm Sạc Năng Lượng o365",
    linkLabel: "Đăng ký nội bộ",
    linkUrl: "#",
    description: "Hoạt động dã ngoại gắn kết đại gia đình o365, chào đón các tân binh Gen 3.0 sau chuỗi ngày cày deadline.",
    location: "Khu sinh thái Ecopark",
    status: "upcoming",
    category: "Văn hóa & Nội bộ",
    drl: "+5 ĐRL",
    isHighlight: false,
    funnyQuote: "Cơ hội vàng tìm người gánh tạ bài tập lớn và người yêu cùng lúc tại o365!",
    targetDate: "2026-11-28",
    reactions: { fire: 53, drl: 31, deadline: 12, trophy: 44 },
  },

  // ── ĐÃ DIỄN RA (PAST) ──
  {
    id: "taiwan-exchange-2026",
    month: "Tháng 8/2026",
    title: "Chương trình Giao lưu Quốc tế: Học tập số tại Đài Loan",
    linkLabel: "Xem bài viết tổng kết",
    linkUrl: "/blog/taiwan-exchange-2026",
    description: "Đại diện o365 HUST tham gia trao đổi văn hóa và mô hình CLB công nghệ tại các trường đại học hàng đầu Đài Loan.",
    location: "Taipei, Taiwan",
    status: "past",
    category: "Hợp tác Quốc tế",
    drl: "Chứng nhận cấp Trường",
    isHighlight: false,
    funnyQuote: "Dân Bách Khoa mang tinh thần số vươn tầm châu Á!",
    reactions: { fire: 88, drl: 62, deadline: 5, trophy: 76 },
  },
  {
    id: "excel-mastery-bootcamp",
    month: "Tháng 7/2026",
    title: "Bootcamp Cấp tốc: Excel Mastery & Tự Động Hóa Báo Cáo",
    linkLabel: "Xem tài liệu & Slide",
    linkUrl: "#",
    description: "Khóa đào tạo 3 buổi trang bị thủ thuật hàm mảng động, Power Query và tự động hóa bảng tính văn phòng.",
    location: "Online qua Microsoft Teams",
    status: "past",
    category: "Học thuật & Kỹ năng",
    drl: "+5 ĐRL",
    isHighlight: false,
    funnyQuote: "VBA và Power Query không khó, chỉ sợ không ai ngồi cầm tay chỉ chuột!",
    reactions: { fire: 41, drl: 75, deadline: 7, trophy: 39 },
  },
  {
    id: "gen2-gala",
    month: "Tháng 6/2026",
    title: "Gala Vinh Danh Đại Sứ Số & Tổng Kết Gen 2.0",
    linkLabel: "Xem ảnh kỷ niệm",
    linkUrl: "#",
    description: "Nhìn lại 1 năm cống hiến đầy tự hào của các thành viên Gen 2.0 và trao bằng khen từ Đoàn Thanh niên ĐHBK.",
    location: "Hội trường C2 - ĐHBK Hà Nội",
    status: "past",
    category: "Văn hóa & Gala",
    drl: "Giấy khen ĐHBK",
    isHighlight: false,
    funnyQuote: "Một năm deadline ngập đầu nhưng ấm áp tình đồng chí Bách Khoa!",
    reactions: { fire: 79, drl: 44, deadline: 11, trophy: 83 },
  },
];

export const NAV_LINKS = [
  { label: "Trang chủ", href: "#top" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Cơ cấu ban", href: "#departments" },
  { label: "Blog", href: "#blog" },
  { label: "Sự kiện", href: "#events" },
] as const;
