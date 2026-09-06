import type { Metadata } from "next";
import { Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CLB o365 - HUST | Đại sứ Chuyển đổi số Đại học Bách khoa Hà Nội",
  description:
    "Website chính thức của Câu lạc bộ o365 - Đại học Bách khoa Hà Nội. Kết nối đam mê, lan tỏa giá trị — đồng hành kỹ năng số, Microsoft 365 và MOSWC.",
  openGraph: {
    type: "website",
    title: "CLB o365 - HUST | Đại sứ Chuyển đổi số ĐHBK Hà Nội",
    description:
      "Câu lạc bộ Đại sứ Chuyển đổi số ĐHBK Hà Nội. Kết nối đam mê công nghệ, bồi dưỡng kỹ năng tin học văn phòng chuẩn quốc tế.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${dancingScript.variable} scroll-smooth`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
