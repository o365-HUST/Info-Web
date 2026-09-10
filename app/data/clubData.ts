import type {
  ClubInfo,
  RecruitmentInfo,
  Department,
  BlogPost,
  EventItem,
  StatItem,
  Advisor,
  MissionItem,
} from "../types";

export const CLUB_INFO: ClubInfo = {
  name: "CLB o365 - HUST",
  officialTitle: "Câu lạc bộ o365 - Đại học Bách khoa Hà Nội",
  role: "Đại sứ số học đường Đại học Bách khoa Hà Nội",
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
      title: "Điểm tư vấn D4",
      detail: "Phòng 105 - Nhà D4, ĐHBK Hà Nội",
    },
    {
      title: "Trạm hỗ trợ Thư viện",
      detail: "Phòng 907, Tầng 9 — Thư viện Tạ Quang Bửu",
    },
    {
      title: "Văn phòng sinh hoạt",
      detail: "Tầng 2 — Tòa nhà Alumni (Cựu sinh viên)",
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
  { value: 80, suffix: "+", label: "Thành viên", icon: "Users" },
  { value: 20, suffix: "+", label: "Hoạt động/năm", icon: "Calendar" },
  { value: 2, suffix: "+", label: "Năm phát triển", icon: "Award" },
];

/** Hero support line — CONTENTv1 STAT CARD */
export const HERO_TAGLINE =
  "Một cộng đồng dành cho sinh viên Bách Khoa cùng học hỏi, thực hành và phát triển kỹ năng tin học văn phòng. Tại o365 HUST, chúng mình cùng nhau khám phá công nghệ, chia sẻ kiến thức và tạo nên những giá trị thiết thực.";

export const HERO_ROLE_LINE = "Đại sứ số học đường Đại học Bách khoa Hà Nội";

export const ABOUT_COPY = {
  founding:
    "Câu lạc bộ o365 - HUST được thành lập ngày 05/05/2024, trực thuộc Ban Công tác Sinh viên Đại học Bách khoa Hà Nội. CLB được sinh ra với sứ mệnh thúc đẩy việc ứng dụng hiệu quả bộ công cụ Microsoft Office 365 vào giải quyết các bài toán thực tế, đồng thời là nơi kết nối các sinh viên có chung đam mê công nghệ.",
  position:
    'Từ những ngày đầu thành lập, CLB o365 - HUST đã không ngừng phát triển và khẳng định vị thế. Hiện tại CLB là "Đại sứ số học đường" của Đại học Bách khoa Hà Nội và là đơn vị Cộng tác viên tin cậy của Ban Công tác Sinh viên và Trung tâm Chuyển đổi số của Đại học, đảm nhận nhiều vai trò và nhiệm vụ quan trọng.',
  future:
    'CLB o365 - HUST phấn đấu trở thành một "ngôi nhà chung" — nơi mỗi thành viên không chỉ cùng nhau học tập, chia sẻ kiến thức công nghệ mà còn là nơi giao lưu, kết nối và hỗ trợ lẫn nhau trong cả học tập lẫn đời sống.',
} as const;

export const CORE_MISSIONS: MissionItem[] = [
  {
    title: "Hỗ trợ sinh viên",
    detail:
      "Tư vấn và giải quyết các vấn đề liên quan đến tài khoản, mật khẩu sinh viên, cũng như các công cụ trong bộ Microsoft 365.",
  },
  {
    title: "Đội kỹ thuật sự kiện",
    detail:
      "Đảm bảo kỹ thuật suôn sẻ cho các hội thảo, sự kiện lớn do Ban Công tác Sinh viên tổ chức.",
  },
  {
    title: "Hỗ trợ đào tạo",
    detail:
      "Là lực lượng nòng cốt hỗ trợ hầu hết các khóa học Kỹ năng mềm (KNM) cho sinh viên toàn trường.",
  },
  {
    title: "Kết nối doanh nghiệp",
    detail:
      "Hỗ trợ các buổi giao lưu, tham quan và kết nối với các doanh nghiệp đối tác của Đại học.",
  },
];

export const DEVELOPMENT_GOALS: string[] = [
  "Tổ chức các lớp đào tạo, workshop chuyên sâu về các công cụ Microsoft 365.",
  "Xây dựng đội tuyển xuất sắc, tiên phong tham dự và đạt thành tích cao tại cuộc thi Vô địch Tin học Văn phòng Thế giới (MOSWC).",
];

export const ADVISORS: Advisor[] = [
  {
    id: "nguyen-minh-duong",
    name: "Nguyễn Minh Dương",
    medal: "Huy chương Đồng (HCĐ) bộ môn Microsoft Word 365 Apps",
    event: "Cuộc thi Tin học văn phòng thế giới 2024",
    app: "word",
    medalTier: "bronze",
    subjectLabel: "Word 365",
    year: 2024,
  },

  {
    id: "nguyen-duy-phong",
    name: "Nguyễn Duy Phong",
    medal:
      "Huy chương Vàng (HCV) bộ môn Microsoft Excel 365 Apps & Office 2019",
    event: "Cuộc thi Tin học văn phòng thế giới 2022",
    app: "excel",
    medalTier: "gold",
    subjectLabel: "Excel 365",
    year: 2022,
  },

  {
    id: "bui-cong-minh",
    name: "Bùi Công Minh",
    medal: "Huy chương Vàng (HCV) bộ môn Microsoft PowerPoint 2016",
    event: "Cuộc thi Tin học văn phòng thế giới 2022",
    app: "powerpoint",
    medalTier: "gold",
    subjectLabel: "PowerPoint",
    year: 2022,
  },

];

export const FOOTER_TAGLINE =
  "CLB o365 HUST - Đại sứ số học đường Đại học Bách khoa Hà Nội";

export const PRIMARY_ADDRESS = "Phòng 105 - D4";

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
    tagline: "Hoạch định phương hướng, điều hành nhiệm kỳ",
    description:
      "Theo buổi kiện toàn nhân sự ngày 07/01/2026, Ban điều hành CLB o365 - HUST nhiệm kỳ 2025–2026 chịu trách nhiệm chung về mọi hoạt động của CLB, hoạch định phương hướng và báo cáo định kỳ cho Ban Công tác Sinh viên.",
    fullDescription:
      "Chủ nhiệm chịu trách nhiệm chung về mọi hoạt động của CLB, hoạch định phương hướng hoạt động, mô hình quản lý CLB, thực hiện công tác báo cáo định kỳ cho Ban Công tác Sinh viên. Phó chủ nhiệm chịu trách nhiệm về tổ chức các hoạt động phong trào, quản lý nhân sự - tài chính và các vấn đề khác cho sự kiện của CLB và các ban quản lý.",
    mission:
      "Dẫn dắt CLB o365 - HUST hoàn thành sứ mệnh Đại sứ số học đường và gắn kết các ban chuyên môn.",
    stats: [
      { label: "Nhiệm kỳ", value: "2025–2026", desc: "Kiện toàn 07/01/2026" },
      { label: "Ban trực thuộc", value: "04 Ban", desc: "Chuyên môn, Sự kiện, Truyền thông, Tài chính" },
      { label: "Đối tác trường & doanh nghiệp", value: "10+", desc: "Hợp tác chiến lược" },
    ],
    leader: {
      name: "Dương Đức Tùng",
      role: "Chủ nhiệm CLB",
      quote:
        "Chúng mình không chỉ xây dựng một câu lạc bộ, mà đang cùng nhau kiến tạo một cộng đồng số truyền cảm hứng cho sinh viên Bách Khoa.",
    },
    viceLeaders: [
      { name: "Lê Hải Bình", role: "Thư ký" },
      { name: "Lê Nguyễn Đức Long", role: "Phó chủ nhiệm CLB — Trưởng ban Tài chính" },
      { name: "Nguyễn Phúc Anh", role: "Phó chủ nhiệm CLB — Trưởng ban Chuyên môn" },
      { name: "Phạm Trần Thành Công", role: "Phó chủ nhiệm CLB — Trưởng ban Sự kiện" },
      { name: "Vũ Vân Chi", role: "Phó chủ nhiệm CLB — Trưởng ban Truyền thông" },
    ],
    keyActivities: [
      {
        title: "Hoạch định phương hướng hoạt động",
        desc: "Xây dựng mô hình quản lý CLB và lộ trình nhiệm kỳ 2025–2026.",
      },
      {
        title: "Báo cáo định kỳ Ban CTSV",
        desc: "Thực hiện công tác báo cáo và phối hợp với Ban Công tác Sinh viên.",
      },
      {
        title: "Điều phối liên ban",
        desc: "Gắn kết các ban chuyên môn, sự kiện, truyền thông và tài chính.",
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
    tagline: "Biến kiến thức công nghệ thành giá trị thực tiễn",
    description:
      "Phụ trách chuyên môn Microsoft 365, tin học văn phòng và kỹ năng số — xây dựng tài liệu, công cụ và chương trình đào tạo phục vụ sinh viên.",
    fullDescription:
      "Ban Chuyên môn là một trong những phân ban nòng cốt của CLB o365 – HUST. Ban phụ trách các nội dung chuyên môn về Microsoft 365, tin học văn phòng và kỹ năng số; nghiên cứu, xây dựng tài liệu, công cụ và nội dung hướng dẫn phục vụ sinh viên; tổ chức các chương trình đào tạo kỹ năng, hỗ trợ học tập và ứng dụng công nghệ; tham gia kiểm duyệt, hỗ trợ và xử lý các hoạt động chuyên môn do CLB quản lý. Mục tiêu: biến kiến thức công nghệ thành những giá trị thực tiễn cho học tập và công việc.",
    mission:
      "Biến kiến thức công nghệ thành những giá trị thực tiễn cho học tập và công việc của sinh viên.",
    leader: {
      name: "Nguyễn Phúc Anh",
      role: "Phó chủ nhiệm CLB — Trưởng ban Chuyên môn",
      quote:
        "Học công nghệ không phải để trở thành lập trình viên, mà để biến ý tưởng của bạn thành hiện thực với tốc độ nhanh nhất.",
    },
    keyActivities: [
      {
        title: "Nội dung Microsoft 365 & tin học văn phòng",
        desc: "Xây dựng nội dung Word, Excel, PowerPoint, Teams, OneDrive, Forms, Outlook và các công cụ liên quan.",
      },
      {
        title: "Công cụ số & tài liệu hướng dẫn",
        desc: "Nghiên cứu, triển khai công cụ hỗ trợ học tập; cập nhật tài liệu và video hướng dẫn Microsoft 365.",
      },
      {
        title: "Đào tạo kỹ năng & hỗ trợ sinh viên",
        desc: "Tổ chức khóa KNM tin học văn phòng và kỹ năng số; giải đáp vấn đề chuyên môn Office 365.",
      },
      {
        title: "MOSWC & kiểm duyệt chuyên môn",
        desc: "Hỗ trợ tổ chức, ôn luyện MOSWC (kể cả cấp ĐHBK Hà Nội); kiểm duyệt nội dung, minh chứng và kết quả hoạt động chuyên môn.",
      },
    ],
    skillsLearned: [
      "Microsoft Word, Excel, PowerPoint chuẩn MOS",
      "Teams, OneDrive, Forms, Outlook trong học tập & công việc",
      "Xây dựng tài liệu và video hướng dẫn",
      "Công cụ lập kế hoạch học tập & quản lý chi tiêu",
      "Hỗ trợ ôn luyện và định hướng thí sinh MOSWC",
    ],
    memberHighlights: [
      {
        name: "Bùi Huy Hoàng",
        detail:
          "IELTS 7.5; sinh viên Global ICT; MC song ngữ; phát biểu đại diện thanh niên Việt Nam tại Youth Salon – Giao lưu Lãnh đạo trẻ ASEAN – Trung Quốc lần thứ XII.",
      },
      {
        name: "Bùi Công Minh",
        detail:
          "Huy chương Vàng thế giới MOSWC 2022 – Microsoft PowerPoint 2016 (IIG Việt Nam xác nhận).",
      },
      {
        name: "Nguyễn Minh Dương",
        detail:
          "Huy chương Đồng thế giới MOSWC 2024 – Microsoft Word 365 Apps; giải Nhì quốc gia Word 2016 (2021).",
      },
      {
        name: "Nguyễn Duy Phong",
        detail:
          "Quán quân MOSWC Excel 365 năm 2022; Huy chương Vàng thế giới Microsoft Excel 365/Office 2019 (IIG xác nhận).",
      },
      {
        name: "Nguyễn Minh Đức",
        detail:
          "Quán quân quốc gia MOSWC – Viettel 2025, PowerPoint 2019; 1000 điểm vòng loại; o365 hỗ trợ định hướng ôn luyện.",
      },
      {
        name: "Vũ Lê Dũng",
        detail:
          "Giải Nhì MOS World cấp Đại học 2024–2025; Sinh viên Xuất sắc & Giấy khen Giám đốc ĐHBK Hà Nội; Phó Ban Chuyên môn CLB o365 – HUST.",
      },
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
        id: "academic-quote",
        title: "Phương Châm Tri Thức",
        type: "quote",
        description:
          "Biến kiến thức công nghệ thành những giá trị thực tiễn cho học tập và công việc.",
        quoteAuthor: "Ban Chuyên môn o365",
        colSpan: "col-span-1",
      },
      {
        id: "academic-skills",
        title: "Hệ Sinh Thái Công Cụ",
        type: "skills",
        skills: [
          "Word",
          "Excel",
          "PowerPoint",
          "Teams",
          "OneDrive",
          "Forms",
          "Outlook",
          "MOSWC",
        ],
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
    tagline: "Gam màu vàng – lan tỏa bằng sáng tạo chân phương",
    description:
      "Ngòi bút, ống kính và nét vẽ — với khát khao học hỏi và tinh thần đổi mới sáng tạo, lan tỏa ứng dụng và giá trị o365 đến sinh viên.",
    fullDescription:
      "Ban Truyền thông dùng ngòi bút, ống kính và nét vẽ, bằng giá trị chân phương, khát khao học hỏi và tinh thần sẵn sàng đổi mới sáng tạo của gam màu vàng, để tạo nên những ý tưởng độc đáo, đảm bảo phần nhìn và lan tỏa ứng dụng cũng như giá trị của CLB đến các bạn sinh viên trong toàn Đại học.",
    mission:
      "Xây dựng hình ảnh và lan tỏa giá trị CLB tới sinh viên toàn Đại học qua ấn phẩm sáng tạo.",
    stats: [
      {
        label: "Lượt theo dõi Fanpage",
        value: "41.000+",
        desc: "Kênh truyền thông chính thức",
      },
      {
        label: "Ấn phẩm thiết kế",
        value: "150+",
        desc: "Poster, avatar, chuỗi bài tuyển quân (cập nhật)",
      },
      {
        label: "Tương tác trung bình",
        value: "3.500+",
        desc: "Mỗi chiến dịch truyền thông (cập nhật)",
      },
    ],
    leader: {
      name: "Vũ Vân Chi",
      role: "Phó chủ nhiệm CLB — Trưởng ban Truyền thông",
      quote:
        "Hình ảnh đẹp khiến người ta dừng lại 3 giây, nhưng thông điệp chân thành mới là điều giữ người xem ở lại lâu dài.",
    },
    keyActivities: [
      {
        title: "Xây dựng bộ nhận diện CLB",
        desc: "Chịu trách nhiệm xây dựng hình ảnh và lan tỏa giá trị của CLB tới sinh viên trong toàn Đại học.",
      },
      {
        title: "Tuyên truyền hoạt động & khóa học",
        desc: "Phổ biến hoạt động, khóa học bằng ấn phẩm sáng tạo, cuốn hút để thu hút sinh viên tham gia.",
      },
      {
        title: "Networking & đối tác",
        desc: "Liên hệ với các đối tác, nhà tài trợ trong các hoạt động của CLB.",
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
        subtitle:
          "Nơi ra đời những bộ nhận diện sự kiện mang đậm dấu ấn sinh viên số Bách Khoa",
        type: "photo",
        image: "/assets/departments/dept-03-media.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Truyền Thông",
      },
      {
        id: "media-quote",
        title: "DNA Truyền Thông",
        type: "quote",
        description:
          "Ngòi bút, ống kính và nét vẽ — sáng tạo chân phương, sẵn sàng đổi mới để lan tỏa giá trị o365.",
        quoteAuthor: "Ban Truyền thông o365",
        colSpan: "col-span-1",
      },
      {
        id: "media-design",
        title: "Sản phẩm Design",
        type: "skills",
        skills: [
          "Avatar CLB qua các năm",
          "Chuỗi bài tuyển Gen 2",
          "Khóa học kỹ năng & KHHH",
        ],
        colSpan: "col-span-1",
      },
      {
        id: "media-products",
        title: "Media & ấn phẩm vật lý",
        type: "skills",
        skills: [
          "Human of Bách khoa",
          "Photobooth",
          "Video hướng dẫn KHHT",
          "Banner / Standee",
        ],
        colSpan: "col-span-1",
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
    tagline: "Sắc đỏ Sự kiện – Thắp sáng ngọn lửa trách nhiệm",
    description:
      "“Trái tim” vận hành hoạt động CLB — tổ chức sự kiện, điều phối hiện trường, hậu cần và phối hợp các ban trong mọi chương trình.",
    fullDescription:
      "Ban Sự kiện là một trong những phân ban nòng cốt của CLB o365 – HUST, được ví như “trái tim” vận hành các hoạt động và chương trình của CLB. Ban phụ trách tổ chức và hỗ trợ triển khai sự kiện; điều phối nhân sự tại hiện trường; chuẩn bị hậu cần, vật dụng và công việc phía sau chương trình; phối hợp các ban khác và hỗ trợ công việc chung, duy trì hoạt động thường xuyên của CLB. Thành viên được tham gia trực tiếp các chương trình quy mô lớn của trường.",
    mission:
      "Thắp sáng ngọn lửa trách nhiệm — đảm bảo mỗi chương trình vận hành đúng kế hoạch từ ý tưởng đến hiện trường.",
    leader: {
      name: "Phạm Trần Thành Công",
      role: "Phó chủ nhiệm CLB — Trưởng ban Sự kiện",
      quote:
        "Sự kiện thành công không nằm ở sân khấu hoành tráng, mà ở nụ cười và giá trị mà mỗi bạn sinh viên mang về sau buổi tối hôm đó.",
    },
    keyActivities: [
      {
        title: "Ý tưởng & kế hoạch sự kiện",
        desc: "Lên ý tưởng và xây dựng kế hoạch tổ chức sự kiện cho CLB và nhà trường.",
      },
      {
        title: "Hậu cần & chuẩn bị",
        desc: "Chuẩn bị vật dụng, tài liệu, không gian và các nhu cầu phục vụ chương trình.",
      },
      {
        title: "Điều phối nhân sự & hiện trường",
        desc: "Điều phối trước – trong – sau sự kiện; hỗ trợ vận hành tại hiện trường đúng kế hoạch.",
      },
      {
        title: "Hỗ trợ chương trình nhà trường & CLB",
        desc: "Lễ tốt nghiệp, hội thảo, hướng nghiệp, kết nối doanh nghiệp và xử lý tình huống phát sinh.",
      },
    ],
    skillsLearned: [
      "Kỹ năng tổ chức sự kiện",
      "Giao tiếp và làm việc nhóm",
      "Xử lý tình huống tại hiện trường",
      "Tinh thần trách nhiệm và chủ động",
      "Điều phối nhân sự & hậu cần",
    ],
    bentoItems: [
      {
        id: "event-hero",
        title: "Hội Trường — Nơi Bùng Nổ Cảm Xúc Sự Kiện",
        subtitle: "Không khí sôi động khi hàng trăm sinh viên Bách Khoa tham gia chương trình",
        type: "photo",
        image: "/assets/departments/dept-04-events.jpg",
        colSpan: "col-span-1 md:col-span-2",
        badge: "Sự Kiện",
      },
      {
        id: "event-quote",
        title: "Tinh Thần Sự Kiện",
        type: "quote",
        description:
          "Sắc đỏ Sự kiện – Thắp sáng ngọn lửa trách nhiệm. Cháy hết mình trên sân khấu, thầm lặng cống hiến phía sau cánh gà.",
        quoteAuthor: "Ban Sự kiện o365",
        colSpan: "col-span-1",
      },
      {
        id: "event-highlights",
        title: "Sự kiện nổi bật",
        type: "skills",
        skills: ["Lễ Khai giảng", "SHCD đầu khóa", "Khóa KNM Microsoft 365"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "tai-chinh-nhan-su",
    index: "05",
    name: "Ban Tài chính",
    slugs: ["tai-chinh-nhan-su", "ban-tai-chinh-nhan-su", "ban-nhan-su", "ban-tai-chinh", "hr"],
    icon: "Heart",
    image: "/assets/departments/dept-05-hr.jpg",
    color: "#ECFDF5",
    accentColor: "#10B981",
    tagline: "Thầm lặng, chỉn chu — hậu cần & tài chính",
    description:
      "Đội ngũ thầm lặng lên kế hoạch chỉn chu từ quản lý hậu cần, cân đối ngân sách, thu – chi hội phí đến tham mưu tài chính cho Ban Chủ nhiệm.",
    fullDescription:
      "Ban Tài chính luôn là đội ngũ thầm lặng lên kế hoạch công việc chỉn chu từ quản lý hậu cần, cân đối ngân sách, thực hiện thu - chi hội phí đến việc tham mưu các vấn đề tài chính cho Ban Chủ nhiệm. Ban phụ trách tổ chức, quản lý nhân sự và tài chính của CLB; đánh giá thành viên làm căn cứ biểu dương, khen thưởng; và phụ trách giấy tờ, đề án cho hoạt động của CLB.",
    mission:
      "Đảm bảo nguồn lực tài chính minh bạch và ghi nhận đóng góp của từng thành viên.",
    leader: {
      name: "Lê Nguyễn Đức Long",
      role: "Phó chủ nhiệm CLB — Trưởng ban Tài chính",
      quote:
        "Câu lạc bộ có thể thay đổi dự án, nhưng con người và những kỷ niệm cùng nhau đi qua năm tháng sẽ còn mãi.",
    },
    keyActivities: [
      {
        title: "Tổ chức, nhân sự & tài chính",
        desc: "Phụ trách các vấn đề liên quan đến tổ chức, quản lý nhân sự và tài chính của CLB.",
      },
      {
        title: "Cân đối ngân sách & thu chi hội phí",
        desc: "Thực hiện cân đối tài chính, thu chi hội phí đúng quy định và tham mưu tài chính cho Ban Chủ nhiệm.",
      },
      {
        title: "Đánh giá & biểu dương thành viên",
        desc: "Đánh giá ý thức và hiệu quả hoạt động làm căn cứ biểu dương, khen thưởng.",
      },
      {
        title: "Giấy tờ & đề án hoạt động",
        desc: "Phụ trách giấy tờ, đề án và hồ sơ phục vụ các hoạt động của CLB.",
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
        badge: "Tài chính",
      },
      {
        id: "hr-quote",
        title: "Triết Lý Ban",
        type: "quote",
        description:
          "Thầm lặng nhưng chỉn chu — mỗi đồng hội phí và mỗi đánh giá thành viên đều góp phần vận hành CLB bền vững.",
        quoteAuthor: "Ban Tài chính o365",
        colSpan: "col-span-1",
      },
      {
        id: "hr-skills",
        title: "Kỹ Năng Đào Tạo",
        type: "skills",
        skills: [
          "Phỏng vấn tuyển dụng",
          "Quản lý nhân sự",
          "Quản trị tài chính",
          "Kỹ năng thấu cảm",
          "Excel & Forms",
        ],
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
  { label: "Tài liệu", href: "/resources" },
  { label: "Cơ cấu ban", href: "#departments" },
  { label: "Sự kiện", href: "#events" },
] as const;
