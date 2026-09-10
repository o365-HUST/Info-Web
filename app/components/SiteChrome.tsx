"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const showBreadcrumb = !isHome && !isAdmin;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50">
        <Navbar />
        {showBreadcrumb ? <Breadcrumb /> : null}
      </div>
      {!isHome && (
        <div
          aria-hidden
          className="shrink-0"
          style={{
            height: showBreadcrumb
              ? "calc(var(--nav-height) + var(--breadcrumb-height))"
              : "var(--nav-height)",
          }}
        />
      )}
      {children}
    </>
  );
}
