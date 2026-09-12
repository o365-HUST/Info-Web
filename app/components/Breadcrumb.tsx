"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { DEPARTMENTS, getDepartmentByIdOrSlug } from "@/app/data/clubData";

type Crumb = { label: string; href?: string };

function buildCrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Trang chủ", href: "/" }];

  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    crumbs.push({
      label: "Blog",
      href: pathname === "/blog" ? undefined : "/blog",
    });
    if (pathname.startsWith("/blog/") && pathname !== "/blog") {
      crumbs.push({ label: "Bài viết" });
    }
    return crumbs;
  }

  if (pathname.startsWith("/departments/")) {
    const id = pathname.split("/")[2] ?? "";
    const dept = getDepartmentByIdOrSlug(id);
    crumbs.push({ label: "Cơ cấu ban", href: "/departments" });
    crumbs.push({
      label: dept?.name ?? DEPARTMENTS.find((d) => d.id === id)?.name ?? "Ban",
    });
    return crumbs;
  }

  if (pathname.startsWith("/departments")) {
    crumbs.push({ label: "Cơ cấu ban" });
    return crumbs;
  }

  if (pathname.startsWith("/events")) {
    crumbs.push({ label: "Sự kiện" });
    return crumbs;
  }

  if (pathname.startsWith("/resources")) {
    crumbs.push({ label: "Tài liệu" });
    return crumbs;
  }

  // Fallback for other public routes
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment) {
    crumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
    });
  }

  return crumbs;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  const crumbs = buildCrumbs(pathname);
  if (crumbs.length < 2) return null;

  return (
    <div
      className="h-[var(--breadcrumb-height)] border-b border-border bg-surface/90 backdrop-blur-md"
      aria-label="Đường dẫn trang"
    >
      <nav
        className="max-w-[var(--max-width)] mx-auto px-5 sm:px-8 h-full flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto scrollbar-none"
        aria-label="Breadcrumb"
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={`${crumb.label}-${i}`} className="inline-flex items-center gap-1.5 shrink-0">
              {i > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-ink-muted/70"
                  aria-hidden
                />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-ink-muted hover:text-ink transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={`font-semibold truncate max-w-[12rem] sm:max-w-xs ${
                    isLast ? "text-ink" : "text-ink-muted"
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
