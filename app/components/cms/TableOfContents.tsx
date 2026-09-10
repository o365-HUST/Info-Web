"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  selector: string; // The CSS selector for the content container
}

export default function TableOfContents({ selector }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Adding a slight delay to ensure content is fully rendered (especially if fetched from Firestore)
    const timeoutId = setTimeout(() => {
      const container = document.querySelector(selector);
      if (!container) return;

      const elements = Array.from(container.querySelectorAll("h2, h3"));
      
      const newHeadings: TocItem[] = elements.map((el, index) => {
        // Ensure element has an ID
        if (!el.id) {
          el.id = `heading-${index}`;
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: el.tagName === "H2" ? 2 : 3,
        };
      });

      setHeadings(newHeadings);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selector]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Trigger when heading is near the top
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null; // Don't render anything if no headings
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // Offset for fixed header
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-28 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        Mục lục
      </h3>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: heading.level === 3 ? "1rem" : "0" }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block text-sm transition-colors ${
                activeId === heading.id
                  ? "text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

