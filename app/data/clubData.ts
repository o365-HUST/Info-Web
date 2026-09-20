import type {
  ClubInfo,
  RecruitmentInfo,
  Department,
  BlogPost,
  StatItem,
  Advisor,
  MissionItem,
} from "../types";
import { PHOTO_ASSETS } from "./photoAssets";

export const CLUB_INFO: ClubInfo = {
  name: "CLB o365 - HUST",
  officialTitle: "CÃ¢u láº¡c bá»™ o365 - Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i",
  role: "Äáº¡i sá»© sá»‘ há»c Ä‘Æ°á»ng Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i",
  affiliation:
    "Ban CÃ´ng tÃ¡c Sinh viÃªn (Ban CTSV) - Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i",
  leader: {
    name: "DÆ°Æ¡ng Äá»©c TÃ¹ng",
    role: "Chá»§ nhiá»‡m CLB",
    phone: "098 128 92 50",
  },
  email: "clbo365@husteduvn.onmicrosoft.com",
  phone: "098 128 92 50",
  locations: [
    {
      title: "Äiá»ƒm tÆ° váº¥n D4",
      detail: "PhÃ²ng 105 - NhÃ  D4, ÄHBK HÃ  Ná»™i",
    },
    {
      title: "Tráº¡m há»— trá»£ ThÆ° viá»‡n",
      detail: "PhÃ²ng 907, Táº§ng 9 â€” ThÆ° viá»‡n Táº¡ Quang Bá»­u",
    },
    {
      title: "VÄƒn phÃ²ng sinh hoáº¡t",
      detail: "Táº§ng 2 â€” TÃ²a nhÃ  Alumni (Cá»±u sinh viÃªn)",
    },
    {
      title: "Äiá»ƒm tÆ° váº¥n C1",
      detail: "PhÃ²ng 101 - NhÃ  C1, ÄHBK HÃ  Ná»™i",
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
  deadlineDisplay: "23h59 ngÃ y 12/09/2026",
  formUrl:
    "https://forms.cloud.microsoft/pages/responsepage.aspx?id=n7jxBugHT0a0COwbRXA_MSSvKm1-gMtKoJa8JBvvNn1UMVpTOVQ4OVJEMkpQODZTTUhHWlRXUDRTRy4u&origin=lprLink&route=shorturl",
  callToAction: "ÄÄƒng kÃ½ ngay",
  visible: false,
};

export const STATS: StatItem[] = [
  { value: 80, suffix: "+", label: "ThÃ nh viÃªn", icon: "Users" },
  { value: 20, suffix: "+", label: "Hoáº¡t Ä‘á»™ng/nÄƒm", icon: "Calendar" },
  { value: 2, suffix: "+", label: "NÄƒm phÃ¡t triá»ƒn", icon: "Award" },
];

/** Hero support line â€” CONTENTv1 STAT CARD */
export const HERO_TAGLINE =
  "Má»™t cá»™ng Ä‘á»“ng dÃ nh cho sinh viÃªn BÃ¡ch khoa cÃ¹ng há»c há»i, thá»±c hÃ nh vÃ  phÃ¡t triá»ƒn ká»¹ nÄƒng tin há»c vÄƒn phÃ²ng. Táº¡i o365-HUST, chÃºng mÃ¬nh cÃ¹ng nhau khÃ¡m phÃ¡ cÃ´ng nghá»‡, chia sáº» kiáº¿n thá»©c vÃ  táº¡o nÃªn nhá»¯ng giÃ¡ trá»‹ thiáº¿t thá»±c.";

export const HERO_ROLE_LINE = "Äáº¡i sá»© sá»‘ há»c Ä‘Æ°á»ng Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i";

export const ABOUT_COPY = {
  founding:
    "CÃ¢u láº¡c bá»™ o365 - HUST Ä‘Æ°á»£c thÃ nh láº­p ngÃ y 05/05/2024, trá»±c thuá»™c Ban CÃ´ng tÃ¡c Sinh viÃªn Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i. CLB Ä‘Æ°á»£c sinh ra vá»›i sá»© má»‡nh thÃºc Ä‘áº©y viá»‡c á»©ng dá»¥ng hiá»‡u quáº£ bá»™ cÃ´ng cá»¥ Microsoft Office 365 vÃ o giáº£i quyáº¿t cÃ¡c bÃ i toÃ¡n thá»±c táº¿, Ä‘á»“ng thá»i lÃ  nÆ¡i káº¿t ná»‘i cÃ¡c sinh viÃªn cÃ³ chung Ä‘am mÃª cÃ´ng nghá»‡.",
  position:
    'Tá»« nhá»¯ng ngÃ y Ä‘áº§u thÃ nh láº­p, CLB o365 - HUST Ä‘Ã£ khÃ´ng ngá»«ng phÃ¡t triá»ƒn vÃ  kháº³ng Ä‘á»‹nh vá»‹ tháº¿. Hiá»‡n táº¡i CLB lÃ  "Äáº¡i sá»© sá»‘ há»c Ä‘Æ°á»ng" cá»§a Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i vÃ  lÃ  Ä‘Æ¡n vá»‹ Cá»™ng tÃ¡c viÃªn tin cáº­y cá»§a Ban CÃ´ng tÃ¡c Sinh viÃªn vÃ  Trung tÃ¢m Chuyá»ƒn Ä‘á»•i sá»‘ cá»§a Äáº¡i há»c, Ä‘áº£m nháº­n nhiá»u vai trÃ² vÃ  nhiá»‡m vá»¥ quan trá»ng.',
  future:
    'CLB o365 - HUST pháº¥n Ä‘áº¥u trá»Ÿ thÃ nh má»™t "ngÃ´i nhÃ  chung" â€” nÆ¡i má»—i thÃ nh viÃªn khÃ´ng chá»‰ cÃ¹ng nhau há»c táº­p, chia sáº» kiáº¿n thá»©c cÃ´ng nghá»‡ mÃ  cÃ²n lÃ  nÆ¡i giao lÆ°u, káº¿t ná»‘i vÃ  há»— trá»£ láº«n nhau trong cáº£ há»c táº­p láº«n Ä‘á»i sá»‘ng.',
} as const;

export const CORE_MISSIONS: MissionItem[] = [
  {
    title: "Há»— trá»£ sinh viÃªn",
    detail:
      "TÆ° váº¥n vÃ  giáº£i quyáº¿t cÃ¡c váº¥n Ä‘á» liÃªn quan Ä‘áº¿n tÃ i khoáº£n, máº­t kháº©u sinh viÃªn, cÅ©ng nhÆ° cÃ¡c cÃ´ng cá»¥ trong bá»™ Microsoft 365.",
    image: PHOTO_ASSETS.missionSupport,
    imageAlt:
      "Tráº¡m há»— trá»£ sinh viÃªn: tÆ° váº¥n tÃ i khoáº£n vÃ  Microsoft 365",
  },
  {
    title: "Äá»™i ká»¹ thuáº­t sá»± kiá»‡n",
    detail:
      "Äáº£m báº£o ká»¹ thuáº­t suÃ´n sáº» cho cÃ¡c há»™i tháº£o, sá»± kiá»‡n lá»›n do Ban CÃ´ng tÃ¡c Sinh viÃªn tá»• chá»©c.",
    image: PHOTO_ASSETS.missionEvent,
    imageAlt:
      "Äá»™i ká»¹ thuáº­t sá»± kiá»‡n CLB táº¡i há»™i trÆ°á»ng",
  },
  {
    title: "Há»— trá»£ Ä‘Ã o táº¡o",
    detail:
      "LÃ  lá»±c lÆ°á»£ng nÃ²ng cá»‘t há»— trá»£ háº§u háº¿t cÃ¡c khÃ³a há»c Ká»¹ nÄƒng má»m (KNM) cho sinh viÃªn toÃ n trÆ°á»ng.",
    image: PHOTO_ASSETS.missionTraining,
    imageAlt:
      "Há»— trá»£ Ä‘Ã o táº¡o ká»¹ nÄƒng má»m vÃ  Microsoft 365",
  },
  {
    title: "Káº¿t ná»‘i doanh nghiá»‡p",
    detail:
      "Há»— trá»£ cÃ¡c buá»•i giao lÆ°u, tham quan vÃ  káº¿t ná»‘i vá»›i cÃ¡c doanh nghiá»‡p Ä‘á»‘i tÃ¡c cá»§a Äáº¡i há»c.",
    image: PHOTO_ASSETS.missionEnterprise,
    imageAlt:
      "Sinh viÃªn CLB giao lÆ°u, káº¿t ná»‘i doanh nghiá»‡p Ä‘á»‘i tÃ¡c",
  },
];

export const DEVELOPMENT_GOALS: string[] = [
  "Tá»• chá»©c cÃ¡c lá»›p Ä‘Ã o táº¡o, workshop chuyÃªn sÃ¢u vá» cÃ¡c cÃ´ng cá»¥ Microsoft 365.",
  "XÃ¢y dá»±ng Ä‘á»™i tuyá»ƒn xuáº¥t sáº¯c, tiÃªn phong tham dá»± vÃ  Ä‘áº¡t thÃ nh tÃ­ch cao táº¡i cuá»™c thi VÃ´ Ä‘á»‹ch Tin há»c VÄƒn phÃ²ng Tháº¿ giá»›i (MOSWC).",
];

export const ADVISORS: Advisor[] = [
  {
    id: "nguyen-minh-duong",
    name: "Nguyá»…n Minh DÆ°Æ¡ng",
    medal: "Huy chÆ°Æ¡ng Äá»“ng (HCÄ) bá»™ mÃ´n Microsoft Word 365 Apps",
    event: "Cuá»™c thi Tin há»c vÄƒn phÃ²ng tháº¿ giá»›i 2024",
    app: "word",
    medalTier: "bronze",
    subjectLabel: "Word 365",
    year: 2024,
  },

  {
    id: "nguyen-duy-phong",
    name: "Nguyá»…n Duy Phong",
    medal:
      "Huy chÆ°Æ¡ng VÃ ng (HCV) bá»™ mÃ´n Microsoft Excel 365 Apps & Office 2019",
    event: "Cuá»™c thi Tin há»c vÄƒn phÃ²ng tháº¿ giá»›i 2022",
    app: "excel",
    medalTier: "gold",
    subjectLabel: "Excel 365",
    year: 2022,
  },

  {
    id: "bui-cong-minh",
    name: "BÃ¹i CÃ´ng Minh",
    medal: "Huy chÆ°Æ¡ng VÃ ng (HCV) bá»™ mÃ´n Microsoft PowerPoint 2016",
    event: "Cuá»™c thi Tin há»c vÄƒn phÃ²ng tháº¿ giá»›i 2022",
    app: "powerpoint",
    medalTier: "gold",
    subjectLabel: "PowerPoint",
    year: 2022,
  },

];

export const FOOTER_TAGLINE =
  "CLB o365-HUST - Äáº¡i sá»© sá»‘ há»c Ä‘Æ°á»ng Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i";

export const PRIMARY_ADDRESS = "PhÃ²ng 105 - D4";

export const DEPARTMENTS: Department[] = [
  {
    id: "ban-chu-nhiem",
    index: "01",
    name: "Ban Chá»§ nhiá»‡m",
    slugs: ["ban-chu-nhiem", "chu-nhiem", "leadership"],
    icon: "Crown",
    image: "/assets/departments/LEADERSHIP/main.jpg",
    color: "#EEF2FF",
    accentColor: "#4F46E5",
    tagline: "Hoáº¡ch Ä‘á»‹nh phÆ°Æ¡ng hÆ°á»›ng, Ä‘iá»u hÃ nh nhiá»‡m ká»³",
    description:
      "Theo buá»•i kiá»‡n toÃ n nhÃ¢n sá»± ngÃ y 07/01/2026, Ban Ä‘iá»u hÃ nh CLB o365 - HUST nhiá»‡m ká»³ 2025â€“2026 chá»‹u trÃ¡ch nhiá»‡m chung vá» má»i hoáº¡t Ä‘á»™ng cá»§a CLB, hoáº¡ch Ä‘á»‹nh phÆ°Æ¡ng hÆ°á»›ng vÃ  bÃ¡o cÃ¡o Ä‘á»‹nh ká»³ cho Ban CÃ´ng tÃ¡c Sinh viÃªn.",
    fullDescription:
      "Chá»§ nhiá»‡m chá»‹u trÃ¡ch nhiá»‡m chung vá» má»i hoáº¡t Ä‘á»™ng cá»§a CLB, hoáº¡ch Ä‘á»‹nh phÆ°Æ¡ng hÆ°á»›ng hoáº¡t Ä‘á»™ng, mÃ´ hÃ¬nh quáº£n lÃ½ CLB, thá»±c hiá»‡n cÃ´ng tÃ¡c bÃ¡o cÃ¡o Ä‘á»‹nh ká»³ cho Ban CÃ´ng tÃ¡c Sinh viÃªn. PhÃ³ chá»§ nhiá»‡m chá»‹u trÃ¡ch nhiá»‡m vá» tá»• chá»©c cÃ¡c hoáº¡t Ä‘á»™ng phong trÃ o, quáº£n lÃ½ nhÃ¢n sá»± - tÃ i chÃ­nh vÃ  cÃ¡c váº¥n Ä‘á» khÃ¡c cho sá»± kiá»‡n cá»§a CLB vÃ  cÃ¡c ban quáº£n lÃ½.",
    mission:
      "Dáº«n dáº¯t CLB o365 - HUST hoÃ n thÃ nh sá»© má»‡nh Äáº¡i sá»© sá»‘ há»c Ä‘Æ°á»ng vÃ  gáº¯n káº¿t cÃ¡c ban chuyÃªn mÃ´n.",
    stats: [
      { label: "Nhiá»‡m ká»³", value: "2025â€“2026", desc: "Kiá»‡n toÃ n 07/01/2026" },
      { label: "Ban trá»±c thuá»™c", value: "04 Ban", desc: "ChuyÃªn mÃ´n, Sá»± kiá»‡n, Truyá»n thÃ´ng, TÃ i chÃ­nh" },
      { label: "Äá»‘i tÃ¡c trÆ°á»ng & doanh nghiá»‡p", value: "3+", desc: "Há»£p tÃ¡c chiáº¿n lÆ°á»£c" },
    ],
    leader: {
      name: "DÆ°Æ¡ng Äá»©c TÃ¹ng",
      role: "Chá»§ nhiá»‡m CLB",
      quote:
        "ChÃºng mÃ¬nh khÃ´ng chá»‰ xÃ¢y dá»±ng má»™t cÃ¢u láº¡c bá»™, mÃ  Ä‘ang cÃ¹ng nhau kiáº¿n táº¡o má»™t cá»™ng Ä‘á»“ng sá»‘ truyá»n cáº£m há»©ng cho sinh viÃªn BÃ¡ch Khoa.",
    },
    viceLeaders: [
      { name: "LÃª Háº£i BÃ¬nh", role: "ThÆ° kÃ½" },
      { name: "LÃª Nguyá»…n Äá»©c Long", role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban TÃ i chÃ­nh" },
      { name: "Nguyá»…n PhÃºc Anh", role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban ChuyÃªn mÃ´n" },
      { name: "Pháº¡m Tráº§n ThÃ nh CÃ´ng", role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban Sá»± kiá»‡n" },
      { name: "VÅ© VÃ¢n Chi", role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban Truyá»n thÃ´ng" },
    ],
    keyActivities: [
      {
        title: "Hoáº¡ch Ä‘á»‹nh phÆ°Æ¡ng hÆ°á»›ng hoáº¡t Ä‘á»™ng",
        desc: "XÃ¢y dá»±ng mÃ´ hÃ¬nh quáº£n lÃ½ CLB vÃ  lá»™ trÃ¬nh nhiá»‡m ká»³ 2025â€“2026.",
      },
      {
        title: "BÃ¡o cÃ¡o Ä‘á»‹nh ká»³ Ban CTSV",
        desc: "Thá»±c hiá»‡n cÃ´ng tÃ¡c bÃ¡o cÃ¡o vÃ  phá»‘i há»£p vá»›i Ban CÃ´ng tÃ¡c Sinh viÃªn.",
      },
      {
        title: "Äiá»u phá»‘i liÃªn ban",
        desc: "Gáº¯n káº¿t cÃ¡c ban chuyÃªn mÃ´n, sá»± kiá»‡n, truyá»n thÃ´ng vÃ  tÃ i chÃ­nh.",
      },
    ],
    skillsLearned: [
      "Quáº£n trá»‹ tá»• chá»©c & nhÃ¢n sá»±",
      "Ká»¹ nÄƒng Ä‘Ã m phÃ¡n & Ä‘á»‘i ngoáº¡i",
      "TÆ° duy chiáº¿n lÆ°á»£c dÃ i háº¡n",
      "Ká»¹ nÄƒng giáº£i quyáº¿t khá»§ng hoáº£ng",
      "LÃ£nh Ä‘áº¡o truyá»n cáº£m há»©ng",
    ],
    gallery: [
      {
        src: "/assets/departments/LEADERSHIP/dept-structure.jpg",
        alt: "Ban Ä‘iá»u hÃ nh CLB o365-HUST nhiá»‡m ká»³ Gen 2.0",
        title: "Ban Ä‘iá»u hÃ nh nhiá»‡m ká»³",
        caption: "CÆ¡ cáº¥u Chá»§ nhiá»‡m, PhÃ³ chá»§ nhiá»‡m vÃ  Ban Ä‘iá»u hÃ nh theo tá»«ng ban.",
        fit: "contain",
      },
    ],
    bentoItems: [
      {
        id: "lead-stat",
        title: "Quy MÃ´ Káº¿t Ná»‘i",
        type: "stat",
        statValue: "35.000+",
        statLabel: "Sinh viÃªn ÄHBK HÃ  Ná»™i tiáº¿p cáº­n má»—i nÄƒm",
        description: "ThÃ´ng qua cÃ¡c cÃ´ng cá»¥ Microsoft 365, workshop ká»¹ nÄƒng sá»‘ vÃ  chiáº¿n dá»‹ch MOSWC.",
        colSpan: "col-span-1",
        accent: "#4F46E5",
      },
      {
        id: "lead-quote",
        title: "TuyÃªn NgÃ´n HÃ nh Äá»™ng",
        type: "quote",
        description: "",
        quoteAuthor: "Ban Chá»§ nhiá»‡m o365 - HUST",
        colSpan: "col-span-1",
      },
      {
        id: "lead-skills",
        title: "Ká»¹ NÄƒng RÃ¨n Luyá»‡n Táº¡i Ban",
        type: "skills",
        skills: ["LÃ£nh Ä‘áº¡o", "Chiáº¿n lÆ°á»£c", "Äá»‘i ngoáº¡i", "Xá»­ lÃ½ váº¥n Ä‘á»", "Quáº£n lÃ½ ngÃ¢n sÃ¡ch"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "chuyen-mon",
    index: "02",
    name: "Ban ChuyÃªn mÃ´n",
    slugs: ["chuyen-mon", "ban-chuyen-mon", "academic"],
    icon: "BookOpen",
    image: "/assets/departments/ACADEMIC/main.JPG",
    color: "#EFF6FF",
    accentColor: "#0078D4",
    tagline: "Biáº¿n kiáº¿n thá»©c cÃ´ng nghá»‡ thÃ nh giÃ¡ trá»‹ thá»±c tiá»…n",
    description:
      "Phá»¥ trÃ¡ch chuyÃªn mÃ´n Microsoft 365, tin há»c vÄƒn phÃ²ng vÃ  ká»¹ nÄƒng sá»‘ â€” xÃ¢y dá»±ng tÃ i liá»‡u, cÃ´ng cá»¥ vÃ  chÆ°Æ¡ng trÃ¬nh Ä‘Ã o táº¡o phá»¥c vá»¥ sinh viÃªn.",
    fullDescription:
      "Ban ChuyÃªn mÃ´n lÃ  má»™t trong nhá»¯ng phÃ¢n ban nÃ²ng cá»‘t cá»§a CLB o365 â€“ HUST. Ban phá»¥ trÃ¡ch cÃ¡c ná»™i dung chuyÃªn mÃ´n vá» Microsoft 365, tin há»c vÄƒn phÃ²ng vÃ  ká»¹ nÄƒng sá»‘; nghiÃªn cá»©u, xÃ¢y dá»±ng tÃ i liá»‡u, cÃ´ng cá»¥ vÃ  ná»™i dung hÆ°á»›ng dáº«n phá»¥c vá»¥ sinh viÃªn; tá»• chá»©c cÃ¡c chÆ°Æ¡ng trÃ¬nh Ä‘Ã o táº¡o ká»¹ nÄƒng, há»— trá»£ há»c táº­p vÃ  á»©ng dá»¥ng cÃ´ng nghá»‡; tham gia kiá»ƒm duyá»‡t, há»— trá»£ vÃ  xá»­ lÃ½ cÃ¡c hoáº¡t Ä‘á»™ng chuyÃªn mÃ´n do CLB quáº£n lÃ½. Má»¥c tiÃªu: biáº¿n kiáº¿n thá»©c cÃ´ng nghá»‡ thÃ nh nhá»¯ng giÃ¡ trá»‹ thá»±c tiá»…n cho há»c táº­p vÃ  cÃ´ng viá»‡c.",
    mission:
      "Biáº¿n kiáº¿n thá»©c cÃ´ng nghá»‡ thÃ nh nhá»¯ng giÃ¡ trá»‹ thá»±c tiá»…n cho há»c táº­p vÃ  cÃ´ng viá»‡c cá»§a sinh viÃªn.",
    leader: {
      name: "Nguyá»…n PhÃºc Anh",
      role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban ChuyÃªn mÃ´n",
      quote:
        "Há»c cÃ´ng nghá»‡ khÃ´ng pháº£i Ä‘á»ƒ trá»Ÿ thÃ nh láº­p trÃ¬nh viÃªn, mÃ  Ä‘á»ƒ biáº¿n Ã½ tÆ°á»Ÿng cá»§a báº¡n thÃ nh hiá»‡n thá»±c vá»›i tá»‘c Ä‘á»™ nhanh nháº¥t.",
    },
    keyActivities: [
      {
        title: "Kiá»ƒm duyá»‡t & há»— trá»£ chuyÃªn mÃ´n CLB",
        desc: "Kiá»ƒm tra, xá»­ lÃ½ káº¿t quáº£ cÃ¡c hoáº¡t Ä‘á»™ng chuyÃªn mÃ´n do CLB quáº£n lÃ½ â€” minh chá»©ng, ná»™i dung vÃ  káº¿t quáº£ há»c táº­p.",
      },
      {
        title: "Há»— trá»£ Trung tÃ¢m Chuyá»ƒn Ä‘á»•i sá»‘ Äáº¡i há»c",
        desc: "LÃ  Ä‘Æ¡n vá»‹ nÃ²ng cá»‘t há»— trá»£ cÃ¡c hoáº¡t Ä‘á»™ng chuyÃªn mÃ´n cá»§a Trung tÃ¢m Chuyá»ƒn Ä‘á»•i sá»‘ trong pháº¡m vi CLB phá»¥ trÃ¡ch.",
      },
      {
        title: "Biáº¿n kiáº¿n thá»©c thÃ nh giÃ¡ trá»‹ thá»±c tiá»…n",
        desc: "Phá»‘i há»£p hai máº£ng KÄ© nÄƒng má»m vÃ  KÄ© thuáº­t â€” dáº¡y cÃ´ng cá»¥ sinh viÃªn cáº§n, build cÃ´ng cá»¥ CLB vÃ  trÆ°á»ng dÃ¹ng Ä‘Æ°á»£c.",
      },
    ],
    skillsLearned: [
      "Phá»‘i há»£p Ä‘Ã o táº¡o vÃ  triá»ƒn khai cÃ´ng cá»¥ sá»‘ trong mÃ´i trÆ°á»ng CLB",
      "Viáº¿t tÃ i liá»‡u, hÆ°á»›ng dáº«n vÃ  há»— trá»£ sinh viÃªn trÃªn chÆ°Æ¡ng trÃ¬nh tháº­t",
    ],
    subUnits: [
      {
        id: "knm",
        index: "01",
        name: "KÄ© nÄƒng má»m",
        tagline: "Dáº¡y vÃ  há»— trá»£ sinh viÃªn dÃ¹ng Microsoft 365",
        mission:
          "NghiÃªn cá»©u vÃ  triá»ƒn khai Microsoft 365 trong cÃ´ng viá»‡c vÃ  cuá»™c sá»‘ng; xÃ¢y dá»±ng lá»›p KNM tin há»c; há»— trá»£ MOSWC vÃ  Trung tÃ¢m Chuyá»ƒn Ä‘á»•i sá»‘.",
        tools: [
          "Word",
          "Excel",
          "PowerPoint",
          "Teams",
          "OneDrive",
          "Forms",
          "Outlook",
          "MOSWC",
        ],
        trainingFocus: [
          "XÃ¢y dá»±ng vÃ  quáº£n lÃ½ cÃ¡c lá»›p KNM tin há»c vÄƒn phÃ²ng vÃ  ká»¹ nÄƒng sá»‘",
          "Soáº¡n ná»™i dung Word, Excel, PowerPoint, Teams vÃ  giáº£i Ä‘Ã¡p Q&A Office 365",
          "Há»— trá»£ tá»• chá»©c, Ã´n luyá»‡n vÃ  Ä‘á»‹nh hÆ°á»›ng thÃ­ sinh MOSWC (ká»ƒ cáº£ cáº¥p ÄHBK HÃ  Ná»™i)",
        ],

        accent: "warm",
      },
      {
        id: "ky-thuat",
        index: "02",
        name: "KÄ© thuáº­t",
        tagline: "XÃ¢y cÃ´ng cá»¥ vÃ  há»— trá»£ ká»¹ thuáº­t chuyá»ƒn Ä‘á»•i sá»‘",
        mission:
          "Há»— trá»£ ká»¹ thuáº­t trong cÃ¡c hoáº¡t Ä‘á»™ng chuyá»ƒn Ä‘á»•i sá»‘; tÃ¬m hiá»ƒu vÃ  phÃ¡t triá»ƒn á»©ng dá»¥ng phá»¥c vá»¥ CLB vÃ  Äáº¡i há»c.",
        tools: [
          "Power Apps",
          "Power Automate",
          "SharePoint",
          "Microsoft 365",
        ],
        trainingFocus: [
          "Prototype vÃ  triá»ƒn khai á»©ng dá»¥ng há»— trá»£ hoáº¡t Ä‘á»™ng ná»™i bá»™ CLB",
          "Tá»± Ä‘á»™ng hÃ³a quy trÃ¬nh vÃ  tÃ­ch há»£p cÃ´ng cá»¥ sá»‘ cho ban vÃ  sá»± kiá»‡n",
          "Há»— trá»£ ká»¹ thuáº­t cho cÃ¡c chÆ°Æ¡ng trÃ¬nh chuyá»ƒn Ä‘á»•i sá»‘ cá»§a trÆ°á»ng",
        ],
        accent: "cool",
      },
    ],
    memberHighlights: [
      {
        name: "BÃ¹i Huy HoÃ ng",
        detail:
          "IELTS 7.5; sinh viÃªn Global ICT; MC song ngá»¯; phÃ¡t biá»ƒu Ä‘áº¡i diá»‡n thanh niÃªn Viá»‡t Nam táº¡i Youth Salon â€“ Giao lÆ°u LÃ£nh Ä‘áº¡o tráº» ASEAN â€“ Trung Quá»‘c láº§n thá»© XII.",
      },
      {
        name: "BÃ¹i CÃ´ng Minh",
        detail:
          "Huy chÆ°Æ¡ng VÃ ng tháº¿ giá»›i MOSWC 2022 â€“ Microsoft PowerPoint 2016 (IIG Viá»‡t Nam xÃ¡c nháº­n).",
      },
      {
        name: "Nguyá»…n Minh DÆ°Æ¡ng",
        detail:
          "Huy chÆ°Æ¡ng Äá»“ng tháº¿ giá»›i MOSWC 2024 â€“ Microsoft Word 365 Apps; giáº£i NhÃ¬ quá»‘c gia Word 2016 (2021).",
      },
      {
        name: "Nguyá»…n Duy Phong",
        detail:
          "QuÃ¡n quÃ¢n MOSWC Excel 365 nÄƒm 2022; Huy chÆ°Æ¡ng VÃ ng tháº¿ giá»›i Microsoft Excel 365/Office 2019 (IIG xÃ¡c nháº­n).",
      },
      {
        name: "Nguyá»…n Minh Äá»©c",
        detail:
          "QuÃ¡n quÃ¢n quá»‘c gia MOSWC â€“ Viettel 2025, PowerPoint 2019; 1000 Ä‘iá»ƒm vÃ²ng loáº¡i; o365 há»— trá»£ Ä‘á»‹nh hÆ°á»›ng Ã´n luyá»‡n.",
      },
      {
        name: "VÅ© LÃª DÅ©ng",
        detail:
          "Giáº£i NhÃ¬ MOS World cáº¥p Äáº¡i há»c 2024â€“2025; Sinh viÃªn Xuáº¥t sáº¯c & Giáº¥y khen GiÃ¡m Ä‘á»‘c ÄHBK HÃ  Ná»™i; PhÃ³ Ban ChuyÃªn mÃ´n CLB o365 â€“ HUST.",
      },
    ],
    gallery: [
      {
        src: "/assets/departments/ACADEMIC/carousel-01.jpg",
        alt: "áº¤n pháº©m hÆ°á»›ng dáº«n theo dÃµi tiáº¿n Ä‘á»™ sinh hoáº¡t cÃ´ng dÃ¢n báº±ng PowerApps",
        title: "CÃ´ng cá»¥ PowerApps",
        caption: "Theo dÃµi tiáº¿n Ä‘á»™ sinh hoáº¡t cÃ´ng dÃ¢n â€” sáº£n pháº©m hÆ°á»›ng dáº«n cá»§a ban.",
        fit: "contain",
        subUnitId: "ky-thuat",
      },
      {
        src: "/assets/departments/ACADEMIC/carousel-02.jpg",
        alt: "áº¤n pháº©m khÃ³a há»c ká»¹ nÄƒng má»m Excel, PowerPoint, Word",
        title: "KhÃ³a há»c ká»¹ nÄƒng má»m",
        caption: "Excel, PowerPoint, Word â€” Ä‘iá»ƒm rÃ¨n luyá»‡n ká»¹ nÄƒng tin há»c.",
        fit: "contain",
        subUnitId: "knm",
      },
      {
        src: "/assets/departments/ACADEMIC/carousel-03.jpg",
        alt: "áº¤n pháº©m xÃ¢y dá»±ng káº¿ hoáº¡ch há»c táº­p",
        title: "Káº¿ hoáº¡ch há»c táº­p",
        caption: "TÃ i liá»‡u hÆ°á»›ng dáº«n sinh viÃªn láº­p káº¿ hoáº¡ch há»c táº­p tá»«ng ká»³.",
        fit: "contain",
        subUnitId: "knm",
      },
    ],
    bentoItems: [
      {
        id: "academic-quote",
        title: "PhÆ°Æ¡ng ChÃ¢m Tri Thá»©c",
        type: "quote",
        description:
          "Biáº¿n kiáº¿n thá»©c cÃ´ng nghá»‡ thÃ nh nhá»¯ng giÃ¡ trá»‹ thá»±c tiá»…n cho há»c táº­p vÃ  cÃ´ng viá»‡c.",
        quoteAuthor: "Ban ChuyÃªn mÃ´n o365",
        colSpan: "col-span-1",
      },
    ],
  },
  {
    id: "truyen-thong",
    index: "03",
    name: "Ban Truyá»n thÃ´ng",
    slugs: ["truyen-thong", "ban-truyen-thong", "media"],
    icon: "Megaphone",
    image: "/assets/departments/MEDIA/main.JPG",
    color: "#FFFBEB",
    accentColor: "#F59E0B",
    tagline: "Gam mÃ u vÃ ng â€“ lan tá»a báº±ng sÃ¡ng táº¡o chÃ¢n phÆ°Æ¡ng",
    description:
      "NgÃ²i bÃºt, á»‘ng kÃ­nh vÃ  nÃ©t váº½ â€” vá»›i khÃ¡t khao há»c há»i vÃ  tinh tháº§n Ä‘á»•i má»›i sÃ¡ng táº¡o, lan tá»a á»©ng dá»¥ng vÃ  giÃ¡ trá»‹ o365 Ä‘áº¿n sinh viÃªn.",
    fullDescription:
      "Ban Truyá»n thÃ´ng dÃ¹ng ngÃ²i bÃºt, á»‘ng kÃ­nh vÃ  nÃ©t váº½, báº±ng giÃ¡ trá»‹ chÃ¢n phÆ°Æ¡ng, khÃ¡t khao há»c há»i vÃ  tinh tháº§n sáºµn sÃ ng Ä‘á»•i má»›i sÃ¡ng táº¡o cá»§a gam mÃ u vÃ ng, Ä‘á»ƒ táº¡o nÃªn nhá»¯ng Ã½ tÆ°á»Ÿng Ä‘á»™c Ä‘Ã¡o, Ä‘áº£m báº£o pháº§n nhÃ¬n vÃ  lan tá»a á»©ng dá»¥ng cÅ©ng nhÆ° giÃ¡ trá»‹ cá»§a CLB Ä‘áº¿n cÃ¡c báº¡n sinh viÃªn trong toÃ n Äáº¡i há»c.",
    mission:
      "XÃ¢y dá»±ng hÃ¬nh áº£nh vÃ  lan tá»a giÃ¡ trá»‹ CLB tá»›i sinh viÃªn toÃ n Äáº¡i há»c qua áº¥n pháº©m sÃ¡ng táº¡o.",
    stats: [
      {
        label: "LÆ°á»£t theo dÃµi Fanpage",
        value: "42.000+",
        desc: "KÃªnh truyá»n thÃ´ng chÃ­nh thá»©c",
      },
      {
        label: "áº¤n pháº©m thiáº¿t káº¿",
        value: "150+",
        desc: "Poster, avatar, chuá»—i bÃ i tuyá»ƒn quÃ¢n (cáº­p nháº­t)",
      },
      {
        label: "TÆ°Æ¡ng tÃ¡c trung bÃ¬nh",
        value: "3.500+",
        desc: "Má»—i chiáº¿n dá»‹ch truyá»n thÃ´ng (cáº­p nháº­t)",
      },
    ],
    leader: {
      name: "VÅ© VÃ¢n Chi",
      role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban Truyá»n thÃ´ng",
      quote:
        "HÃ¬nh áº£nh Ä‘áº¹p khiáº¿n ngÆ°á»i ta dá»«ng láº¡i 3 giÃ¢y, nhÆ°ng thÃ´ng Ä‘iá»‡p chÃ¢n thÃ nh má»›i lÃ  Ä‘iá»u giá»¯ ngÆ°á»i xem á»Ÿ láº¡i lÃ¢u dÃ i.",
    },
    keyActivities: [
      {
        title: "XÃ¢y dá»±ng bá»™ nháº­n diá»‡n CLB",
        desc: "Chá»‹u trÃ¡ch nhiá»‡m xÃ¢y dá»±ng hÃ¬nh áº£nh vÃ  lan tá»a giÃ¡ trá»‹ cá»§a CLB tá»›i sinh viÃªn trong toÃ n Äáº¡i há»c.",
      },
      {
        title: "TuyÃªn truyá»n hoáº¡t Ä‘á»™ng & khÃ³a há»c",
        desc: "Phá»• biáº¿n hoáº¡t Ä‘á»™ng, khÃ³a há»c báº±ng áº¥n pháº©m sÃ¡ng táº¡o, cuá»‘n hÃºt Ä‘á»ƒ thu hÃºt sinh viÃªn tham gia.",
      },
      {
        title: "Networking & Ä‘á»‘i tÃ¡c",
        desc: "LiÃªn há»‡ vá»›i cÃ¡c Ä‘á»‘i tÃ¡c, nhÃ  tÃ i trá»£ trong cÃ¡c hoáº¡t Ä‘á»™ng cá»§a CLB.",
      },
    ],
    skillsLearned: [
      "Thiáº¿t káº¿ Photoshop, Illustrator, Figma",
      "Copywriting & Ká»¹ nÄƒng xÃ¢y dá»±ng gÃ³c nhÃ¬n truyá»n thÃ´ng",
      "Chá»¥p áº£nh sá»± kiá»‡n & quay dá»±ng video ngáº¯n Premiere / CapCut",
      "Quáº£n trá»‹ Fanpage & phÃ¢n tÃ­ch dá»¯ liá»‡u máº¡ng xÃ£ há»™i",
      "TÆ° duy tháº©m má»¹ vÃ  xÃ¢y dá»±ng cÃ¢u chuyá»‡n thá»‹ giÃ¡c",
    ],
    gallery: [
      {
        src: "/assets/departments/MEDIA/carousel-01.jpg",
        alt: "Key visual tuyá»ƒn quÃ¢n Recruitment 3.0",
        title: "Tuyá»ƒn quÃ¢n 3.0",
        caption: "Key visual chiáº¿n dá»‹ch tuyá»ƒn thÃ nh viÃªn tháº¿ há»‡ má»›i.",
        fit: "contain",
      },
      {
        src: "/assets/departments/MEDIA/carousel-02.jpg",
        alt: "Photobooth tá»‘t nghiá»‡p 2026 cá»§a Ban Truyá»n thÃ´ng",
        title: "Graduate 2026",
        caption: "Photobooth lá»… tá»‘t nghiá»‡p â€” #ÄHBKHN Má»™t tÃ¬nh yÃªu. Má»™t tÆ°Æ¡ng lai.",
        fit: "contain",
      },
      {
        src: "/assets/departments/MEDIA/carousel-03.jpg",
        alt: "áº¤n pháº©m One Love One Future cÃ¹ng sinh viÃªn Ã¡o tráº»",
        title: "One Love One Future",
        caption: "áº¤n pháº©m 70 nÄƒm HUST â€” náº¯ng BÃ¡ch khoa hong vÃ ng mÃ u Ã¡o tráº».",
        fit: "contain",
      },
    ],
    bentoItems: [
      {
        id: "media-quote",
        title: "DNA Truyá»n ThÃ´ng",
        type: "quote",
        description:
          "NgÃ²i bÃºt, á»‘ng kÃ­nh vÃ  nÃ©t váº½ â€” sÃ¡ng táº¡o chÃ¢n phÆ°Æ¡ng, sáºµn sÃ ng Ä‘á»•i má»›i Ä‘á»ƒ lan tá»a giÃ¡ trá»‹ o365.",
        quoteAuthor: "Ban Truyá»n thÃ´ng o365",
        colSpan: "col-span-1",
      },
      {
        id: "media-design",
        title: "Sáº£n pháº©m Design",
        type: "skills",
        skills: [
          "Avatar CLB qua cÃ¡c nÄƒm",
          "Chuá»—i bÃ i tuyá»ƒn Gen 2",
          "KhÃ³a há»c ká»¹ nÄƒng & KHHH",
        ],
        colSpan: "col-span-1",
      },
      {
        id: "media-products",
        title: "Media & áº¥n pháº©m váº­t lÃ½",
        type: "skills",
        skills: [
          "Human of BÃ¡ch khoa",
          "Photobooth",
          "Video hÆ°á»›ng dáº«n KHHT",
          "Banner / Standee",
        ],
        colSpan: "col-span-1",
      },
    ],
  },
  {
    id: "su-kien",
    index: "04",
    name: "Ban Sá»± kiá»‡n",
    slugs: ["su-kien", "ban-su-kien", "events"],
    icon: "PartyPopper",
    image: "/assets/departments/dept-04-events.jpg",
    color: "#FEF2F2",
    accentColor: "#EF4444",
    tagline: "Sáº¯c Ä‘á» Sá»± kiá»‡n â€“ Tháº¯p sÃ¡ng ngá»n lá»­a trÃ¡ch nhiá»‡m",
    description:
      "â€œTrÃ¡i timâ€ váº­n hÃ nh hoáº¡t Ä‘á»™ng CLB â€” tá»• chá»©c sá»± kiá»‡n, Ä‘iá»u phá»‘i hiá»‡n trÆ°á»ng, háº­u cáº§n vÃ  phá»‘i há»£p cÃ¡c ban trong má»i chÆ°Æ¡ng trÃ¬nh.",
    fullDescription:
      "Ban Sá»± kiá»‡n lÃ  má»™t trong nhá»¯ng phÃ¢n ban nÃ²ng cá»‘t cá»§a CLB o365 â€“ HUST, Ä‘Æ°á»£c vÃ­ nhÆ° â€œtrÃ¡i timâ€ váº­n hÃ nh cÃ¡c hoáº¡t Ä‘á»™ng vÃ  chÆ°Æ¡ng trÃ¬nh cá»§a CLB. Ban phá»¥ trÃ¡ch tá»• chá»©c vÃ  há»— trá»£ triá»ƒn khai sá»± kiá»‡n; Ä‘iá»u phá»‘i nhÃ¢n sá»± táº¡i hiá»‡n trÆ°á»ng; chuáº©n bá»‹ háº­u cáº§n, váº­t dá»¥ng vÃ  cÃ´ng viá»‡c phÃ­a sau chÆ°Æ¡ng trÃ¬nh; phá»‘i há»£p cÃ¡c ban khÃ¡c vÃ  há»— trá»£ cÃ´ng viá»‡c chung, duy trÃ¬ hoáº¡t Ä‘á»™ng thÆ°á»ng xuyÃªn cá»§a CLB. ThÃ nh viÃªn Ä‘Æ°á»£c tham gia trá»±c tiáº¿p cÃ¡c chÆ°Æ¡ng trÃ¬nh quy mÃ´ lá»›n cá»§a trÆ°á»ng.",
    mission:
      "Tháº¯p sÃ¡ng ngá»n lá»­a trÃ¡ch nhiá»‡m â€” Ä‘áº£m báº£o má»—i chÆ°Æ¡ng trÃ¬nh váº­n hÃ nh Ä‘Ãºng káº¿ hoáº¡ch tá»« Ã½ tÆ°á»Ÿng Ä‘áº¿n hiá»‡n trÆ°á»ng.",
    leader: {
      name: "Pháº¡m Tráº§n ThÃ nh CÃ´ng",
      role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban Sá»± kiá»‡n",
      quote:
        "Sá»± kiá»‡n thÃ nh cÃ´ng khÃ´ng náº±m á»Ÿ sÃ¢n kháº¥u hoÃ nh trÃ¡ng, mÃ  á»Ÿ ná»¥ cÆ°á»i vÃ  giÃ¡ trá»‹ mÃ  má»—i báº¡n sinh viÃªn mang vá» sau buá»•i tá»‘i hÃ´m Ä‘Ã³.",
    },
    keyActivities: [
      {
        title: "Ã tÆ°á»Ÿng & káº¿ hoáº¡ch sá»± kiá»‡n",
        desc: "LÃªn Ã½ tÆ°á»Ÿng vÃ  xÃ¢y dá»±ng káº¿ hoáº¡ch tá»• chá»©c sá»± kiá»‡n cho CLB vÃ  nhÃ  trÆ°á»ng.",
      },
      {
        title: "Háº­u cáº§n & chuáº©n bá»‹",
        desc: "Chuáº©n bá»‹ váº­t dá»¥ng, tÃ i liá»‡u, khÃ´ng gian vÃ  cÃ¡c nhu cáº§u phá»¥c vá»¥ chÆ°Æ¡ng trÃ¬nh.",
      },
      {
        title: "Äiá»u phá»‘i nhÃ¢n sá»± & hiá»‡n trÆ°á»ng",
        desc: "Äiá»u phá»‘i trÆ°á»›c â€“ trong â€“ sau sá»± kiá»‡n; há»— trá»£ váº­n hÃ nh táº¡i hiá»‡n trÆ°á»ng Ä‘Ãºng káº¿ hoáº¡ch.",
      },
      {
        title: "Há»— trá»£ chÆ°Æ¡ng trÃ¬nh nhÃ  trÆ°á»ng & CLB",
        desc: "Lá»… tá»‘t nghiá»‡p, há»™i tháº£o, hÆ°á»›ng nghiá»‡p, káº¿t ná»‘i doanh nghiá»‡p vÃ  xá»­ lÃ½ tÃ¬nh huá»‘ng phÃ¡t sinh.",
      },
    ],
    skillsLearned: [
      "Ká»¹ nÄƒng tá»• chá»©c sá»± kiá»‡n",
      "Giao tiáº¿p vÃ  lÃ m viá»‡c nhÃ³m",
      "Xá»­ lÃ½ tÃ¬nh huá»‘ng táº¡i hiá»‡n trÆ°á»ng",
      "Tinh tháº§n trÃ¡ch nhiá»‡m vÃ  chá»§ Ä‘á»™ng",
      "Äiá»u phá»‘i nhÃ¢n sá»± & háº­u cáº§n",
    ],
    gallery: [
      {
        src: "/assets/departments/EVENTS/carousel-01.jpg",
        alt: "ThÃ nh viÃªn Ban Sá»± kiá»‡n chuáº©n bá»‹ Ã¡o HUST cho chÆ°Æ¡ng trÃ¬nh",
        title: "Háº­u cáº§n sá»± kiá»‡n",
        caption: "Chuáº©n bá»‹ Ã¡o, váº­t dá»¥ng vÃ  nhÃ¢n sá»± trÆ°á»›c giá» diá»…n ra chÆ°Æ¡ng trÃ¬nh.",
        fit: "cover",
      },
      {
        src: "/assets/departments/EVENTS/carousel-02.jpg",
        alt: "KhÃ¡n phÃ²ng workshop cá»§a CLB o365-HUST",
        title: "Workshop táº¡i giáº£ng Ä‘Æ°á»ng",
        caption: "Má»™t buá»•i táº­p huáº¥n â€” hÃ ng gháº¿ Ä‘áº§y sinh viÃªn BÃ¡ch khoa.",
        fit: "cover",
      },
      {
        src: "/assets/departments/EVENTS/carousel-03.jpg",
        alt: "Tráº¡m há»— trá»£ tÃ¢n sinh viÃªn K70 dÆ°á»›i lá»u sá»c Ä‘á» tráº¯ng",
        title: "ChÃ o tÃ¢n sinh viÃªn K70",
        caption: "Hiá»‡n trÆ°á»ng há»— trá»£ giáº¥y tá» vÃ  tÆ° váº¥n dÆ°á»›i lá»u sá»± kiá»‡n.",
        fit: "cover",
      },
    ],
    bentoItems: [
      {
        id: "event-quote",
        title: "Tinh Tháº§n Sá»± Kiá»‡n",
        type: "quote",
        description:
          "Sáº¯c Ä‘á» Sá»± kiá»‡n â€“ Tháº¯p sÃ¡ng ngá»n lá»­a trÃ¡ch nhiá»‡m. ChÃ¡y háº¿t mÃ¬nh trÃªn sÃ¢n kháº¥u, tháº§m láº·ng cá»‘ng hiáº¿n phÃ­a sau cÃ¡nh gÃ .",
        quoteAuthor: "Ban Sá»± kiá»‡n o365",
        colSpan: "col-span-1",
      },
      {
        id: "event-highlights",
        title: "Sá»± kiá»‡n ná»•i báº­t",
        type: "skills",
        skills: ["Lá»… Khai giáº£ng", "SHCD Ä‘áº§u khÃ³a", "KhÃ³a KNM Microsoft 365"],
        colSpan: "col-span-1 md:col-span-2",
      },
    ],
  },
  {
    id: "tai-chinh-nhan-su",
    index: "05",
    name: "Ban TÃ i chÃ­nh",
    slugs: ["tai-chinh-nhan-su", "ban-tai-chinh-nhan-su", "ban-nhan-su", "ban-tai-chinh", "hr"],
    icon: "Heart",
    image: "/assets/departments/HR/main.JPG",
    color: "#ECFDF5",
    accentColor: "#10B981",
    tagline: "Tháº§m láº·ng, chá»‰n chu â€” háº­u cáº§n & tÃ i chÃ­nh",
    description:
      "Äá»™i ngÅ© tháº§m láº·ng lÃªn káº¿ hoáº¡ch chá»‰n chu tá»« quáº£n lÃ½ háº­u cáº§n, cÃ¢n Ä‘á»‘i ngÃ¢n sÃ¡ch, thu â€“ chi há»™i phÃ­ Ä‘áº¿n tham mÆ°u tÃ i chÃ­nh cho Ban Chá»§ nhiá»‡m.",
    fullDescription:
      "Ban TÃ i chÃ­nh luÃ´n lÃ  Ä‘á»™i ngÅ© tháº§m láº·ng lÃªn káº¿ hoáº¡ch cÃ´ng viá»‡c chá»‰n chu tá»« quáº£n lÃ½ háº­u cáº§n, cÃ¢n Ä‘á»‘i ngÃ¢n sÃ¡ch, thá»±c hiá»‡n thu - chi há»™i phÃ­ Ä‘áº¿n viá»‡c tham mÆ°u cÃ¡c váº¥n Ä‘á» tÃ i chÃ­nh cho Ban Chá»§ nhiá»‡m. Ban phá»¥ trÃ¡ch tá»• chá»©c, quáº£n lÃ½ nhÃ¢n sá»± vÃ  tÃ i chÃ­nh cá»§a CLB; Ä‘Ã¡nh giÃ¡ thÃ nh viÃªn lÃ m cÄƒn cá»© biá»ƒu dÆ°Æ¡ng, khen thÆ°á»Ÿng; vÃ  phá»¥ trÃ¡ch giáº¥y tá», Ä‘á» Ã¡n cho hoáº¡t Ä‘á»™ng cá»§a CLB.",
    mission:
      "Äáº£m báº£o nguá»“n lá»±c tÃ i chÃ­nh minh báº¡ch vÃ  ghi nháº­n Ä‘Ã³ng gÃ³p cá»§a tá»«ng thÃ nh viÃªn.",
    leader: {
      name: "LÃª Nguyá»…n Äá»©c Long",
      role: "PhÃ³ chá»§ nhiá»‡m CLB â€” TrÆ°á»Ÿng ban TÃ i chÃ­nh",
      quote:
        "CÃ¢u láº¡c bá»™ cÃ³ thá»ƒ thay Ä‘á»•i dá»± Ã¡n, nhÆ°ng con ngÆ°á»i vÃ  nhá»¯ng ká»· niá»‡m cÃ¹ng nhau Ä‘i qua nÄƒm thÃ¡ng sáº½ cÃ²n mÃ£i.",
    },
    keyActivities: [
      {
        title: "Tá»• chá»©c, nhÃ¢n sá»± & tÃ i chÃ­nh",
        desc: "Phá»¥ trÃ¡ch cÃ¡c váº¥n Ä‘á» liÃªn quan Ä‘áº¿n tá»• chá»©c, quáº£n lÃ½ nhÃ¢n sá»± vÃ  tÃ i chÃ­nh cá»§a CLB.",
      },
      {
        title: "CÃ¢n Ä‘á»‘i ngÃ¢n sÃ¡ch & thu chi há»™i phÃ­",
        desc: "Thá»±c hiá»‡n cÃ¢n Ä‘á»‘i tÃ i chÃ­nh, thu chi há»™i phÃ­ Ä‘Ãºng quy Ä‘á»‹nh vÃ  tham mÆ°u tÃ i chÃ­nh cho Ban Chá»§ nhiá»‡m.",
      },
      {
        title: "ÄÃ¡nh giÃ¡ & biá»ƒu dÆ°Æ¡ng thÃ nh viÃªn",
        desc: "ÄÃ¡nh giÃ¡ Ã½ thá»©c vÃ  hiá»‡u quáº£ hoáº¡t Ä‘á»™ng lÃ m cÄƒn cá»© biá»ƒu dÆ°Æ¡ng, khen thÆ°á»Ÿng.",
      },
      {
        title: "Giáº¥y tá» & Ä‘á» Ã¡n hoáº¡t Ä‘á»™ng",
        desc: "Phá»¥ trÃ¡ch giáº¥y tá», Ä‘á» Ã¡n vÃ  há»“ sÆ¡ phá»¥c vá»¥ cÃ¡c hoáº¡t Ä‘á»™ng cá»§a CLB.",
      },
    ],
    skillsLearned: [
      "Phá»ng váº¥n tuyá»ƒn dá»¥ng & ÄÃ¡nh giÃ¡ nhÃ¢n sá»±",
      "Quáº£n lÃ½ tÃ i chÃ­nh & Thu chi dá»± Ã¡n minh báº¡ch",
      "Láº¯ng nghe, tháº¥u cáº£m & Giáº£i quyáº¿t mÃ¢u thuáº«n ná»™i bá»™",
      "Tá»• chá»©c vÄƒn hÃ³a doanh nghiá»‡p / tá»• chá»©c sinh viÃªn",
      "Tá»± Ä‘á»™ng hÃ³a quáº£n lÃ½ dá»¯ liá»‡u nhÃ¢n sá»± báº±ng Excel & Forms",
    ],
    gallery: [
      {
        src: "/assets/departments/dept-05-hr.jpg",
        alt: "Ban TÃ i chÃ­nh táº¡o dÃ¡ng cÃ¹ng báº£ng hiá»‡u Ban TÃ i chÃ­nh â€” NhÃ¢n sá»±",
        title: "Ban TÃ i chÃ­nh â€” NhÃ¢n sá»±",
        caption: "Äá»™i ngÅ© tháº§m láº·ng cÃ¢n Ä‘á»‘i ngÃ¢n sÃ¡ch vÃ  ghi nháº­n tá»«ng thÃ nh viÃªn.",
        fit: "cover",
      },
    ],
    bentoItems: [
      {
        id: "hr-quote",
        title: "Triáº¿t LÃ½ Ban",
        type: "quote",
        description:
          "Tháº§m láº·ng nhÆ°ng chá»‰n chu â€” má»—i Ä‘á»“ng há»™i phÃ­ vÃ  má»—i Ä‘Ã¡nh giÃ¡ thÃ nh viÃªn Ä‘á»u gÃ³p pháº§n váº­n hÃ nh CLB bá»n vá»¯ng.",
        quoteAuthor: "Ban TÃ i chÃ­nh o365",
        colSpan: "col-span-1",
      },
      {
        id: "hr-skills",
        title: "Ká»¹ NÄƒng ÄÃ o Táº¡o",
        type: "skills",
        skills: [
          "Phá»ng váº¥n tuyá»ƒn dá»¥ng",
          "Quáº£n lÃ½ nhÃ¢n sá»±",
          "Quáº£n trá»‹ tÃ i chÃ­nh",
          "Ká»¹ nÄƒng tháº¥u cáº£m",
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
    title: "Devlog: HÃ nh trÃ¬nh xÃ¢y dá»±ng website má»›i cho CLB o365",
    excerpt:
      "Chia sáº» quÃ¡ trÃ¬nh thiáº¿t káº¿, lá»±a chá»n cÃ´ng nghá»‡ vÃ  nhá»¯ng bÃ i há»c rÃºt ra khi Ä‘á»™i ngÅ© ká»¹ thuáº­t báº¯t tay vÃ o dá»± Ã¡n web má»›i.",
    tag: "Devlog",
    date: "05/09/2026",
    author: "Äá»™i ngÅ© Ká»¹ thuáº­t o365",
    thumbnail: "/assets/blog/thumb-devlog.jpg",
    url: "/blog/devlog-phan-ban",
    published: true,
    content: `## Khá»Ÿi Ä‘áº§u vÃ  BÃ i toÃ¡n Äáº·t ra

Khi bÆ°á»›c vÃ o nÄƒm há»c má»›i 2026, CÃ¢u láº¡c bá»™ Äáº¡i sá»© Chuyá»ƒn Ä‘á»•i sá»‘ o365 - ÄHBK HÃ  Ná»™i nháº­n tháº¥y nhu cáº§u cáº¥p thiáº¿t vá» má»™t cá»•ng thÃ´ng tin chÃ­nh thá»©c. Website cÅ© khÃ´ng cÃ²n Ä‘Ã¡p á»©ng Ä‘Æ°á»£c tá»‘c Ä‘á»™ cáº­p nháº­t thÃ´ng tin tuyá»ƒn sinh, quáº£n trá»‹ cÃ¡c sá»± kiá»‡n thÆ°á»ng niÃªn nhÆ° MOSWC vÃ  lÆ°u trá»¯ tÃ i liá»‡u ká»¹ thuáº­t dÃ nh cho sinh viÃªn.

Äá»™i ngÅ© ká»¹ thuáº­t cá»§a CLB Ä‘Ã£ há»p bÃ n vÃ  Ä‘áº·t ra 3 tiÃªu chÃ­ cá»‘t lÃµi:
- **Tá»‘c Ä‘á»™ vÃ  Tráº£i nghiá»‡m**: Táº£i trang tá»©c thÃ¬, giao diá»‡n hiá»‡n Ä‘áº¡i theo phong cÃ¡ch tá»‘i giáº£n thanh lá»‹ch (Clean & Minimalist).
- **Há»‡ thá»‘ng Quáº£n trá»‹ (CMS) tá»©c thá»i**: Ban Äiá»u hÃ nh cÃ³ thá»ƒ Ä‘Äƒng bÃ i viáº¿t, táº¡o sá»± kiá»‡n vÃ  cáº­p nháº­t form tuyá»ƒn quÃ¢n chá»‰ trong vÃ i giÃ¢y mÃ  khÃ´ng cáº§n can thiá»‡p vÃ o code.
- **Kháº£ nÄƒng má»Ÿ rá»™ng**: Dá»… dÃ ng tÃ­ch há»£p cÃ¡c tiá»‡n Ã­ch sá»‘ dÃ nh cho sinh viÃªn BÃ¡ch khoa trong tÆ°Æ¡ng lai.

## Lá»±a chá»n CÃ´ng nghá»‡

Sau khi cÃ¢n nháº¯c nhiá»u giáº£i phÃ¡p, nhÃ³m quyáº¿t Ä‘á»‹nh lá»±a chá»n:
- **Next.js 16 (App Router)**: Cung cáº¥p Server Components, Routing linh hoáº¡t vÃ  tá»‘i Æ°u SEO tuyá»‡t Ä‘á»‘i.
- **Tailwind CSS v4 & Motion**: Há»‡ thá»‘ng design tokens Ä‘á»“ng nháº¥t, cÃ¡c hiá»‡u á»©ng vi mÃ´ mÆ°á»£t mÃ  khÃ´ng gÃ¢y giáº­t lag.
- **Firebase Auth & Cloud Firestore**: CÆ¡ sá»Ÿ dá»¯ liá»‡u NoSQL thá»i gian thá»±c, báº£o máº­t phÃ¢n quyá»n vá»›i Firebase Security Rules.
- **Firebase Storage**: LÆ°u trá»¯ an toÃ n toÃ n bá»™ tÃ i nguyÃªn hÃ¬nh áº£nh bÃ i viáº¿t vÃ  áº¥n pháº©m truyá»n thÃ´ng.

> "Má»™t sáº£n pháº©m cÃ´ng nghá»‡ cá»§a sinh viÃªn khÃ´ng chá»‰ dá»«ng láº¡i á»Ÿ viá»‡c 'cháº¡y Ä‘Æ°á»£c', mÃ  pháº£i Ä‘em láº¡i niá»m tá»± hÃ o vá» máº·t tháº©m má»¹ vÃ  sá»± tiá»‡n dá»¥ng."

## Nhá»¯ng ThÃ¡ch thá»©c Ká»¹ thuáº­t ÄÃ£ VÆ°á»£t qua

Trong quÃ¡ trÃ¬nh triá»ƒn khai, Ä‘á»™i ngÅ© Ä‘Ã£ Ä‘á»‘i máº·t vá»›i bÃ i toÃ¡n Ä‘á»“ng bá»™ dá»¯ liá»‡u hai chiá»u giá»¯a bá»™ nhá»› Ä‘á»‡m ngoáº¡i tuyáº¿n (Offline Demo fallback) vÃ  dá»¯ liá»‡u Ä‘Ã¡m mÃ¢y Firestore thá»i gian thá»±c. Báº±ng cÃ¡ch thiáº¿t káº¿ kiáº¿n trÃºc phÃ¢n tÃ¡ch rÃµ rÃ ng giá»¯a Service Layer vÃ  UI Components, há»‡ thá»‘ng cÃ³ thá»ƒ chuyá»ƒn Ä‘á»•i mÆ°á»£t mÃ  giá»¯a cháº¿ Ä‘á»™ demo vÃ  mÃ´i trÆ°á»ng sáº£n xuáº¥t mÃ  khÃ´ng gÃ¢y lá»—i giao diá»‡n.

ChÃºng tÃ´i sáº½ tiáº¿p tá»¥c cáº­p nháº­t cÃ¡c tÃ­nh nÄƒng má»›i trong chuá»—i Devlog tiáº¿p theo!`,
  },
  {
    id: "moswc-2026",
    title: "MOSWC 2026: HÃ nh trÃ¬nh chinh phá»¥c ká»¹ nÄƒng sá»‘ quá»‘c táº¿",
    excerpt:
      "Tá»•ng káº¿t vÃ²ng loáº¡i MOSWC táº¡i ÄHBK HÃ  Ná»™i â€” tá»« khÃ¢u tá»• chá»©c, Ã´n luyá»‡n Ä‘áº¿n nhá»¯ng gÆ°Æ¡ng máº·t xuáº¥t sáº¯c Ä‘áº¡i diá»‡n trÆ°á»ng.",
    tag: "Cuá»™c thi",
    date: "28/08/2026",
    author: "Ban ChuyÃªn mÃ´n o365",
    thumbnail: "/assets/blog/thumb-moswc.jpg",
    url: "/blog/moswc-2026",
    published: true,
    content: `## SÃ¢n chÆ¡i Äáº³ng cáº¥p Quá»‘c táº¿ cho Sinh viÃªn BÃ¡ch khoa

Cuá»™c thi VÃ´ Ä‘á»‹ch Tin há»c VÄƒn phÃ²ng Tháº¿ giá»›i (MOSWC) hÃ ng nÄƒm luÃ´n lÃ  má»™t trong nhá»¯ng sá»± kiá»‡n trá»ng tÃ¢m mÃ  CLB o365 Ä‘á»“ng hÃ nh tá»• chá»©c táº¡i Äáº¡i há»c BÃ¡ch khoa HÃ  Ná»™i. NÄƒm 2026 ghi nháº­n sá»‘ lÆ°á»£ng thÃ­ sinh Ä‘Äƒng kÃ½ ká»· lá»¥c vá»›i hÆ¡n 1.200 sinh viÃªn tham gia tranh tÃ i á»Ÿ 3 ná»™i dung: Microsoft Word, Microsoft Excel vÃ  Microsoft PowerPoint.

## CÃ´ng tÃ¡c Ã”n luyá»‡n vÃ  Huáº¥n luyá»‡n ChuyÃªn sÃ¢u

Ban ChuyÃªn mÃ´n cá»§a CLB Ä‘Ã£ xÃ¢y dá»±ng lá»™ trÃ¬nh Ã´n táº­p kÃ©o dÃ i 6 tuáº§n:
- **Bá»™ Ä‘á» mÃ´ phá»ng chuáº©n Certiport**: GiÃºp thÃ­ sinh lÃ m quen vá»›i cáº¥u trÃºc Ä‘á» thi thá»±c táº¿ vÃ  Ã¡p lá»±c thá»i gian.
- **CÃ¡c buá»•i Mentor 1-1**: CÃ¡c cá»±u thÃ­ sinh Ä‘áº¡t giáº£i quá»‘c gia trá»±c tiáº¿p giáº£i Ä‘Ã¡p tháº¯c máº¯c vÃ  chia sáº» máº¹o lÃ m bÃ i tá»‘i Æ°u tá»‘c Ä‘á»™.
- **Há»™i tháº£o ChuyÃªn Ä‘á»**: HÆ°á»›ng dáº«n ká»¹ thuáº­t xá»­ lÃ½ cÃ¡c hÃ m nÃ¢ng cao trong Excel vÃ  thiáº¿t káº¿ Master Slide chuyÃªn nghiá»‡p trong PowerPoint.

> "Sá»± tá»‰ má»‰ vÃ  chuáº©n xÃ¡c trong tá»«ng thao tÃ¡c nhá» chÃ­nh lÃ  chÃ¬a khÃ³a Ä‘á»ƒ Ä‘áº¡t Ä‘iá»ƒm sá»‘ tuyá»‡t Ä‘á»‘i 1000/1000 táº¡i Ä‘áº¥u trÆ°á»ng MOS."

## Káº¿t quáº£ Tá»± hÃ o

ÄoÃ n sinh viÃªn ÄHBK HÃ  Ná»™i Ä‘Ã£ xuáº¥t sáº¯c giÃ nh Ä‘Æ°á»£c nhiá»u giáº£i thÆ°á»Ÿng cao táº¡i vÃ²ng loáº¡i quá»‘c gia, kháº³ng Ä‘á»‹nh vá»‹ tháº¿ dáº«n Ä‘áº§u trong phong trÃ o nÃ¢ng cao chuáº©n ká»¹ nÄƒng sá»‘ cho sinh viÃªn ká»¹ thuáº­t.`,
  },
  {
    id: "hanh-trinh-do",
    title: "HÃ nh trÃ¬nh Äá» Quáº£ng TÃ¢y: Khi o365 vÆ°Æ¡n táº§m quá»‘c táº¿",
    excerpt:
      "CÃ¢u chuyá»‡n vá» chuyáº¿n nghiÃªn cá»©u há»c táº­p táº¡i Trung Quá»‘c â€” nÆ¡i cÃ¡c thÃ nh viÃªn CLB tráº£i nghiá»‡m vÃ  há»— trá»£ Ä‘oÃ n Ä‘áº¡i biá»ƒu nhÃ  trÆ°á»ng.",
    tag: "HÃ nh trÃ¬nh",
    date: "21/04/2026",
    author: "Ban Truyá»n thÃ´ng & Äá»‘i ngoáº¡i",
    thumbnail: "/assets/blog/thumb-redjourney.jpg",
    url: "/blog/hanh-trinh-do",
    published: true,
    content: `## Dáº¥u áº¥n Giao lÆ°u VÄƒn hÃ³a vÃ  CÃ´ng nghá»‡

Chuyáº¿n cÃ´ng tÃ¡c vÃ  giao lÆ°u há»c thuáº­t táº¡i Quáº£ng TÃ¢y, Trung Quá»‘c lÃ  má»™t ká»· niá»‡m khÃ³ quÃªn Ä‘á»‘i vá»›i cÃ¡c thÃ nh viÃªn Ä‘áº¡i diá»‡n CLB o365. Chuyáº¿n Ä‘i khÃ´ng chá»‰ lÃ  cÆ¡ há»™i Ä‘á»ƒ há»c há»i mÃ´ hÃ¬nh chuyá»ƒn Ä‘á»•i sá»‘ trong giÃ¡o dá»¥c cá»§a nÆ°á»›c báº¡n, mÃ  cÃ²n lÃ  dá»‹p Ä‘á»ƒ sinh viÃªn BÃ¡ch khoa thá»ƒ hiá»‡n sá»± nÄƒng Ä‘á»™ng vÃ  tá»± tin trÃªn trÆ°á»ng quá»‘c táº¿.

## Nhá»¯ng Hoáº¡t Ä‘á»™ng Ná»•i báº­t

- **Há»™i tháº£o Trao Ä‘á»•i Ká»¹ nÄƒng Sá»‘ Sinh viÃªn**: Äáº¡i diá»‡n o365 Ä‘Ã£ cÃ³ bÃ i chia sáº» báº±ng tiáº¿ng Anh vá» mÃ´ hÃ¬nh cÃ¢u láº¡c bá»™ sinh viÃªn Ä‘á»“ng hÃ nh phá»• cáº­p cÃ´ng cá»¥ Microsoft 365 táº¡i ÄHBK HÃ  Ná»™i.
- **Tham quan Trung tÃ¢m Äá»•i má»›i SÃ¡ng táº¡o**: Tráº£i nghiá»‡m cÃ¡c giáº£i phÃ¡p á»©ng dá»¥ng TrÃ­ tuá»‡ nhÃ¢n táº¡o (AI) vÃ  Äiá»‡n toÃ¡n Ä‘Ã¡m mÃ¢y trong quáº£n lÃ½ trÆ°á»ng Ä‘áº¡i há»c thÃ´ng minh.
- **Giao lÆ°u VÄƒn hÃ³a**: Káº¿t ná»‘i báº¡n bÃ¨ quá»‘c táº¿, lan tá»a hÃ¬nh áº£nh sinh viÃªn BÃ¡ch khoa HÃ  Ná»™i nhiá»‡t huyáº¿t, tÃ i nÄƒng vÃ  há»™i nháº­p.

HÃ nh trÃ¬nh Ä‘Ã£ mang láº¡i nguá»“n cáº£m há»©ng to lá»›n Ä‘á»ƒ CLB tiáº¿p tá»¥c Ä‘á»•i má»›i vÃ  sÃ¡ng táº¡o trong cÃ¡c hoáº¡t Ä‘á»™ng sáº¯p tá»›i!`,
  },
];

export const NAV_LINKS = [
  { label: "Giá»›i thiá»‡u", href: "#about" },
  { label: "Lá»‹ch sá»­", href: "/story" },
  { label: "TÃ i liá»‡u", href: "/resources" },
  { label: "CÆ¡ cáº¥u ban", href: "/departments" },
  { label: "Blog", href: "/blog" },
] as const;

export const DOCUMENT_CATEGORIES = [
  {
    id: "huong-dan-tai-office-365",
    title: "HÆ°á»›ng dáº«n táº£i Office 365",
    description: "CÃ i Ä‘áº·t vÃ  kÃ­ch hoáº¡t bá»™ cÃ´ng cá»¥ Office 365 báº£n quyá»n sinh viÃªn ÄHBK",
    icon: "DownloadCloud",
    tag: "Microsoft 365",
    format: "HÆ°á»›ng dáº«n",
    topics: ["CÃ i Ä‘áº·t", "KÃ­ch hoáº¡t", "TÃ i khoáº£n sinh viÃªn"],
    updated: "2025",
  },
  {
    id: "huong-dan-su-dung-microsoft-teams",
    title: "HÆ°á»›ng dáº«n sá»­ dá»¥ng Microsoft Teams",
    description: "Sá»­ dá»¥ng Teams trong há»c táº­p vÃ  lÃ m viá»‡c nhÃ³m hiá»‡u quáº£",
    icon: "MessageSquare",
    tag: "Microsoft 365",
    format: "HÆ°á»›ng dáº«n",
    topics: ["Teams", "Lá»›p há»c trá»±c tuyáº¿n", "LÃ m viá»‡c nhÃ³m"],
    updated: "2025",
  },
  {
    id: "xay-dung-ke-hoach-hoc-tap",
    title: "XÃ¢y dá»±ng káº¿ hoáº¡ch há»c táº­p",
    description: "PhÆ°Æ¡ng phÃ¡p vÃ  biá»ƒu máº«u quáº£n lÃ½ thá»i gian, há»c táº­p khoa há»c",
    icon: "CalendarDays",
    tag: "Ká»¹ nÄƒng há»c táº­p",
    format: "Biá»ƒu máº«u",
    topics: ["Quáº£n lÃ½ thá»i gian", "Káº¿ hoáº¡ch ká»³", "Excel & Forms"],
    updated: "2024",
  },
  {
    id: "khoa-hoc-ky-nang-tin-hoc-van-phong",
    title: "KhÃ³a há»c ká»¹ nÄƒng tin há»c vÄƒn phÃ²ng",
    description: "TÃ i liá»‡u Ä‘Ã o táº¡o MOS Word, Excel, PowerPoint",
    icon: "BookOpen",
    tag: "MOS / Tin há»c VP",
    format: "KhÃ³a há»c",
    topics: ["Word", "Excel", "PowerPoint", "MOSWC"],
    updated: "2025",
  },
] as const;

export const RESOURCE_PAGE_IDS = DOCUMENT_CATEGORIES.map((category) => category.id);
