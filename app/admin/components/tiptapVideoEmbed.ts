import { Node, mergeAttributes } from "@tiptap/core";

const ALLOWED_EMBED_HOSTS = [
  "web.microsoftstream.com",
  "microsoftstream.com",
  "sharepoint.com",
  "sharepoint.de",
  "embed.office.com",
  "office.com",
  "onedrive.live.com",
  "1drv.ms",
  "microsoft.com",
  "youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "vimeo.com",
];

function hostAllowed(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_EMBED_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

/** Extract iframe `src` from a URL or pasted embed HTML. */
export function parseEmbedSrc(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<")) {
    const match = trimmed.match(/\ssrc=["']([^"']+)["']/i);
    if (match?.[1]) return parseEmbedSrc(match[1]);
    return null;
  }

  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) return null;

  // YouTube watch → embed
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.searchParams.get("v")
    ) {
      url = `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    } else if (parsed.hostname === "youtu.be") {
      url = `https://www.youtube.com/embed${parsed.pathname}`;
    }
  } catch {
    return null;
  }

  return hostAllowed(url) ? url : null;
}

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: "Video nhúng",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed="true"]',
        getAttrs: (element: HTMLElement) => {
          const iframe = element.querySelector("iframe");
          const src = iframe?.getAttribute("src");
          if (!src || !hostAllowed(src)) return false;
          return { src, title: iframe?.getAttribute("title") || "Video nhúng" };
        },
      },
      {
        tag: "iframe[src]",
        getAttrs: (element: HTMLElement) => {
          const src = element.getAttribute("src");
          if (!src || !hostAllowed(src)) return false;
          return { src, title: element.getAttribute("title") || "Video nhúng" };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes.src as string | null;
    if (!src) return ["div", { "data-video-embed": "true" }];

    return [
      "div",
      mergeAttributes({
        "data-video-embed": "true",
        class: "tiptap-video-embed",
      }),
      [
        "iframe",
        mergeAttributes({
          src,
          title: (HTMLAttributes.title as string) || "Video nhúng",
          class: "tiptap-video-embed__frame",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
          allowfullscreen: "true",
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
        }),
      ],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed:
        (src: string, title?: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src, title: title || "Video nhúng" },
          }),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (src: string, title?: string) => ReturnType;
    };
  }
}
