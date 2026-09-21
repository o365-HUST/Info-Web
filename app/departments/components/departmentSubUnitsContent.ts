/** Hardcoded two-column sub-unit sections - not driven by clubData. */

export type SubUnitAccent = "warm" | "cool";

export interface HardcodedSubUnitCard {
  index: "01" | "02";
  name: string;
  tagline: string;
  about?: string;
  aboutLabel?: string;
  /** Second block title (e.g. Công cụ vs Phạm vi) */
  scopeLabel?: string;
  scopeBody?: string;
  /** Third block title (e.g. Đào tạo vs Hoạt động) */
  focusLabel?: string;
  focusItems?: string[];
  accent?: SubUnitAccent;
}

export interface HardcodedSubUnitSection {
  intro: string;
  cards: [HardcodedSubUnitCard, HardcodedSubUnitCard];
}

export const CHUYEN_MON_SUB_UNITS: HardcodedSubUnitSection = {
  intro:
    "KNM dạy sinh viên dùng công cụ - Kĩ thuật build những gì CLB và trường triển khai.",
  cards: [
    {
      index: "01",
      name: "Kĩ năng mềm",
      tagline: "Dạy và hỗ trợ sinh viên dùng Microsoft 365",
      about:
        "Nghiên cứu và triển khai Microsoft 365 trong công việc và cuộc sống; xây dựng lớp KNM tin học; hỗ trợ MOSWC và Trung tâm Chuyển đổi số.",
      scopeLabel: "Công cụ",
      scopeBody:
        "Word · Excel · PowerPoint · Teams · OneDrive · Forms · Outlook · MOSWC",
      focusLabel: "Đào tạo",
      focusItems: [
        "Xây dựng và quản lý các lớp KNM tin học văn phòng và kỹ năng số",
        "Soạn nội dung Word, Excel, PowerPoint, Teams và giải đáp Q&A Office 365",
        "Hỗ trợ tổ chức, ôn luyện và định hướng thí sinh MOSWC (kể cả cấp ĐHBK Hà Nội)",
      ],
      accent: "warm",
    },
    {
      index: "02",
      name: "Kĩ thuật",
      tagline: "Xây công cụ và hỗ trợ kỹ thuật chuyển đổi số",
      about:
        "Hỗ trợ kỹ thuật trong các hoạt động chuyển đổi số; tìm hiểu và phát triển ứng dụng phục vụ CLB và Đại học.",
      scopeLabel: "Công cụ",
      scopeBody: "Power Apps · Power Automate · SharePoint · Microsoft 365",
      focusLabel: "Đào tạo",
      focusItems: [
        "Prototype và triển khai ứng dụng hỗ trợ hoạt động nội bộ CLB",
        "Tự động hóa quy trình và tích hợp công cụ số cho ban và sự kiện",
        "Hỗ trợ kỹ thuật cho các chương trình chuyển đổi số của trường",
      ],
      accent: "cool",
    },
  ],
};

/** From content/BANSUKIEN.md - two mảng, distinct labels from Ban Chuyên môn */
export const SU_KIEN_SUB_UNITS: HardcodedSubUnitSection = {
  intro:
    "",
  cards: [
    {
      index: "01",
      name: "Kỹ thuật sự kiện",
      tagline: "Thiên về hậu trường kỹ thuật",
      aboutLabel: "Giới thiệu",
      about:
        "Là phân ban tiền thân sáng lập CLB.",
      focusLabel: "Nhiệm vụ",
      focusItems: [
        "Đảm nhận vai trò kĩ thuật viên trong các sự kiện lớn của Ban CTSV cũng như Đại học: Trực tiếp setup âm thanh, ánh sáng, hình ảnh, phần mềm chạy slide, livestream...",
        "Đóng vai trò nòng cốt phát triển ban Sự kiện.",
        "Phát triển năng lực hậu trường cho đội ngũ Ban Sự kiện",
      ],
      accent: "cool",
    },
    {
      index: "02",
      name: "Điều phối & Vận hành",
      tagline: "Thiên về hiện trường & trải nghiệm chương trình",
      about:
        "Phối hợp điều phối hiện trường, lễ tân và trải nghiệm chương trình; tổ chức hoạt động nội bộ CLB.",
      aboutLabel: "Giới thiệu",
      focusLabel: "Nhiệm vụ",
      focusItems: [
        "Hỗ trợ điều phối, lễ tân (trao học bổng), MC, văn nghệ ... trong các sự kiện của Ban CTSV Đại học. ",
        "Tổ chức các hoạt động mini game trong meeting CLB, các buổi team building khi dã ngoại, ...",
        "Đảm nhận trách nhiệm và vai trò trong các sự kiện lớn của CLB như: Sinh nhật CLB, Kiện toàn nhân sự. ",
      ],
      accent: "warm",
    },
  ],
};

const SECTIONS: Record<string, HardcodedSubUnitSection | undefined> = {
  "chuyen-mon": CHUYEN_MON_SUB_UNITS,
  "su-kien": SU_KIEN_SUB_UNITS,
};

export function getHardcodedSubUnits(
  departmentId: string,
): HardcodedSubUnitSection | null {
  return SECTIONS[departmentId] ?? null;
}

export const CHUYEN_MON_GALLERY_SUBUNIT_LABELS: Record<string, string> = {
  knm: "Kĩ năng mềm",
  "ky-thuat": "Kĩ thuật",
};
