import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, Be_Vietnam_Pro } from "next/font/google";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import SiteChrome from "@/app/components/SiteChrome";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clbo365.hust.edu.vn"),
  title: "CLB o365 - HUST | Đại sứ số học đường Đại học Bách khoa Hà Nội",
  description:
    "Website chính thức của Câu lạc bộ o365 - Đại học Bách khoa Hà Nội. Kết nối đam mê, lan tỏa giá trị — đồng hành kỹ năng số, Microsoft 365 và MOSWC.",
  openGraph: {
    type: "website",
    title: "CLB o365 - HUST | Đại sứ số học đường ĐHBK Hà Nội",
    description:
      "Câu lạc bộ Đại sứ số học đường ĐHBK Hà Nội. Kết nối đam mê công nghệ, bồi dưỡng kỹ năng tin học văn phòng chuẩn quốc tế.",
    images: ["/logo-transparent.png"],
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("o365-theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${archivo.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <Script id="o365-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
