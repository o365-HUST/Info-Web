# Club photo assets

Hero, About, and Achievements are photo-first. Until real shots are ready, SVG placeholders ship in some slots. When you have photos, drop files and update paths in `app/data/photoAssets.ts`.

## Swap-in filenames

| Slot | Placeholder now | Drop-in file | Suggested crop |
|------|-----------------|--------------|----------------|
| Hero full-bleed | `hero/hero-campus.svg` | `hero/hero-campus.jpg` | 16:9 or 3:2, edge-to-edge campus/event |
| About — support | `about/about-support.svg` | `about/about-support.jpg` | 4:3, trạm hỗ trợ / Office 365 desk |
| About — event | `about/about-event.svg` | `about/about-event.jpg` | 4:3, C2 / workshop / kỹ thuật sự kiện |
| Achievements — advisors banner | `achievements/advisors-moswc.png` | same path or `.jpg` | Wide collage (~21:9), three advisors |

## Guidelines

- Use **real** club photos (members, desks, events). No stock collages, no AI people art.
- Prefer natural light or event lighting; avoid heavy filters.
- Hero should read as place/atmosphere even if faces are secondary.
- After dropping `.jpg` files, change the three strings in `photoAssets.ts` from `.svg` to `.jpg`.
