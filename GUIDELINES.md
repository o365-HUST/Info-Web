# Hướng dẫn làm việc - CLB o365 Web Info

Tài liệu này dành cho người và agent làm tiếp website. Đọc trước khi sửa copy tiếng Việt, font, CSS theme, hoặc rewrite file data lớn.

Stack hiện tại: **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **pnpm**, **Firebase** (Firestore + Storage). Package manager bắt buộc là `pnpm`.

---

## 1. Next.js 16 - đừng dựa vào trí nhớ cũ

Phiên bản Next trong repo **không** giống Next 13/14 trong training data. Trước khi thêm API, font, routing, hay metadata:

1. Đọc guide tương ứng trong `node_modules/next/dist/docs/` (App Router).
2. Tôn trọng deprecation trong docs đó.
3. `AGENTS.md` / `CLAUDE.md` được `next dev` ghi lại - **không xóa**. Commit cùng thay đổi khác để working tree sạch.

Lệnh dev trên nhánh timeline: `pnpm dev` (Turbopack). Sau khi đổi nhánh, nếu font hoặc CSS lạ, xóa `.next` rồi chạy lại - cache lẫn giữa nhánh rất dễ gây “font hỏng giả”.

---

## 2. Encoding tiếng Việt (bắt buộc)

Website hiển thị tiếng Việt. Mọi file nguồn phải là **UTF-8** (không BOM).

### 2.1 Triệu chứng “font hỏng” thường là encoding, không phải typeface

Nếu navbar/hero hiện `Giá»›i thiá»‡u`, `CÃ¢u láº¡c bá»™`, `Lá»‹ch sá»­` - đó là **mojibake**: UTF-8 bị đọc như Windows-1252/CP1252 rồi lưu lại. Typeface (Be Vietnam Pro, Archivo) vẫn có thể load bình thường.

Dấu hiệu trong source:

| Đúng | Sai (mojibake) |
| --- | --- |
| Giới thiệu | Giá»›i thiá»‡u |
| Câu lạc bộ | CÃ¢u láº¡c bá»™ |
| Lịch sử | Lá»‹ch sá»­ |
| Tài liệu | TÃ i liá»‡u |
| Cơ cấu | CÆ¡ cáº¥u |
| Đại học | Äáº¡i há»c |
| - (em dash) | â€” |

Gặp chuỗi `á»`, `Ã¢`, `Ä‘`, `Æ¡`, `â€` trong `.ts`/`.tsx` thì **dừng merge** và sửa encoding trước khi làm feature khác.

### 2.2 Cách tránh

- Editor/IDE: UTF-8, **không** “Western European” / Windows-1252 khi Save As.
- Git trên Windows: đừng round-trip file tiếng Việt qua PowerShell `Out-File` / `Set-Content` mặc định (thường CP1252). Dùng `git show` + Node `Buffer`/`fs.writeFileSync(..., "utf8")` nếu phải copy nội dung từ nhánh khác.
- Khi rewrite file copy lớn (`app/data/clubData.ts`, v.v.):
  - Lấy bản UTF-8 đã biết đúng từ `main` (hoặc commit trước đó), rồi mới xóa/thêm export.
  - **Không** copy-paste cả file qua terminal Windows rồi ghi đè.
  - **Không** gộp “xóa CSS / đổi layout” với “ghi lại toàn bộ clubData” trong một bước không kiểm tra chữ.
- Sau khi sửa data: mở file, tìm `Giới thiệu`, `Câu lạc bộ`. Nếu không thấy mà chỉ thấy `á»` - chưa xong.

### 2.3 Sửa khi đã bị hỏng

Ưu tiên: `git show main:app/data/clubData.ts` (hoặc blob UTF-8 đúng) rồi áp cấu trúc mới (export đã xóa/thêm) lên bản đó.

Không “sửa tay” từng chữ mojibake trừ khi không còn blob đúng. Decode `latin1`/`cp1252` → UTF-8 chỉ dùng khi **toàn file** cùng một lớp mojibake; file lẫn chữ đúng và chữ sai sẽ bị phá nếu decode cả file.

### 2.4 Bài học từ `feat/story/timeline`

Commit rewrite timeline (xóa corkboard CSS, chuyển mốc sang `storyTimeline.ts`) đã ghi lại `app/data/clubData.ts` sai encoding. `main` vẫn đúng. `app/data/storyTimeline.ts` (file mới) thì UTF-8 ổn.

Kết luận vận hành: **xóa CSS corkboard không làm hỏng next/font**. Chữ méo trên toàn site vì `clubData.ts` - nguồn copy của nav, hero, about, ban, blog, tài liệu.

---

## 3. Font (Be Vietnam Pro + Archivo)

Hai họ:

| Vai trò | Font | CSS variable `next/font` | Token Tailwind |
| --- | --- | --- | --- |
| Body / UI | Be Vietnam Pro | `--font-be-vietnam-pro` | `--font-sans`, `--font-body` |
| Tiêu đề / display | Archivo | `--font-archivo` | `--font-display` |

Subset bắt buộc: `latin` **và** `vietnamese`.

### 3.1 Wiring đúng (Next 16 + Tailwind v4)

Trong `app/layout.tsx`:

- Gắn **cả** `.variable` (để có CSS variable) **và** `.className` của Be Vietnam Pro trên `<html>` (hoặc `className` trên `<body>`).
- Chỉ `.variable` **không** set `font-family`. Tailwind preflight dùng `--font-sans`, không dùng `--font-body`.
- `<html lang="vi">`. `suppressHydrationWarning` trên `<html>` vì script theme thêm class `light`/`dark` - script theme **chỉ** `classList.add/remove("light"|"dark")`, không được gán `className = ...` (sẽ xóa class font).

Trong `app/globals.css`, `@theme inline`:

```css
--font-sans: var(--font-be-vietnam-pro);
--font-body: var(--font-be-vietnam-pro);
--font-display: var(--font-archivo);
```

`--font-sans` là token mặc định của Tailwind v4. Thiếu nó thì cả site rơi system UI.

CSS tự viết (`body`, `.font-display`) phải trỏ **biến next/font**, không trỏ alias theme:

```css
body { font-family: var(--font-be-vietnam-pro), system-ui, sans-serif; }
.font-display { font-family: var(--font-archivo), var(--font-be-vietnam-pro), system-ui, sans-serif; }
```

`@theme inline` **không** tạo custom property `--font-body` / `--font-display` đáng tin cho `var(--font-body)` trong CSS thường. Dùng `var(--font-body)` ở đó là bug đã gặp.

Headline dùng class `font-display`. Body không cần class riêng nếu `font-sans` + `--font-sans` đã map đúng.

### 3.2 Việc không được làm

- Đổi `--font-sans` thành system stack.
- Bỏ `beVietnamPro.className` / `beVietnamPro.variable` / `archivo.variable` khỏi root layout.
- Load Google Fonts bằng `<link>` ra fonts.googleapis.com - `next/font` self-host lúc build.
- Thêm font thứ ba trừ khi có lý do brand rõ (đã có body + display).

---

## 4. Copy và dữ liệu tĩnh

### 4.1 Nguồn sự thật

| Nội dung | File |
| --- | --- |
| Thông tin CLB, nav, about, ban, blog tĩnh, tài liệu, stats | `app/data/clubData.ts` |
| Cột mốc trang Hành trình (`/story`) | `app/data/storyTimeline.ts` |
| Ảnh hero / photo slots | `app/data/photoAssets.ts` |
| Types | `app/types.ts` |

Copy UI tiếng Việt: giọng thân mật CLB (“chúng mình”), thuật ngữ giữ ổn định: **Đại sứ số học đường**, **Ban Công tác Sinh viên**, **Microsoft 365**, **MOSWC**. Không bịa tên ban hay slogan mới trên một trang lẻ.

Chuỗi hiển thị với user không nhét sâu trong CSS. Component chỉ ghép layout; chữ lấy từ data hoặc props.

### 4.2 Timeline vs clubData

Trên `feat/story/timeline`, `EVENTS` và `MILESTONES` **không** còn export từ `clubData.ts`. Mốc story sống trong `storyTimeline.ts`. Khi port từ `main`, giữ tách đó - đừng copy nguyên `clubData.ts` của `main` nếu nhánh đã bỏ hai export đó, trừ khi cố ý khôi phục CMS sự kiện/mốc cũ.

`/events` redirect về `/` (xem `next.config.ts`). Đừng thêm lại trang sự kiện công khai trừ khi product yêu cầu.

---

## 5. Giao diện và theme

### 5.1 Token

Màu, shadow, radius, scrim nằm ở `:root` / `html.dark` / `html.light` trong `app/globals.css`. `@theme inline` chỉ **map** sang `--color-*`, `--font-*`, `--shadow-*` cho utility Tailwind (`bg-bg`, `text-ink`, `border-border`, …).

- Dark là mặc định. Script `ThemeInitScript` đọc `localStorage` key `o365-theme` trước paint.
- Đổi theme: `applyTheme` trong `app/lib/theme.ts` - chỉ thêm/bớt class `light`/`dark` trên `<html>`.
- Utility: `text-ink`, `text-ink-light`, `text-accent`, `bg-card`, `bg-surface`, `border-border`. Tránh hex rải rác trong JSX trừ khi token chưa có.

### 5.2 Chrome

`SiteChrome` bọc Navbar + Breadcrumb (ẩn admin và home). Trang nội dung không tự vẽ thêm một navbar thứ hai.

Admin (`/admin/*`) không dùng chrome public. `lang="vi"` vẫn giữ.

### 5.3 Ảnh

`next/image` + `remotePatterns` trong `next.config.ts` (Firebase Storage, Unsplash, placeholder). Ảnh club trong `public/assets/`. Logo trong suốt: class `logo-transparent` (không invert).

Hero full-bleed: `.hero-media` + `.photo-scrim` / `.photo-scrim-bottom`. Tôn trọng `prefers-reduced-motion`.

### 5.4 Accessibility / UI skills

Repo có skill trong `.agents/skills/better-*` (a11y, type, color, layout, UI). Khi sửa UI: focus-visible toàn cục đã có; đừng bỏ `outline` trên interactive. Headline `text-wrap: balance`, đoạn `text-pretty` đã set global.

---

## 6. Cấu trúc app

```
app/page.tsx                 Trang chủ
app/story/page.tsx           Hành trình
app/departments/             Cơ cấu ban
app/resources/               Thư viện tài liệu
app/blog/                    Bài viết
app/admin/                   CMS (posts, resources, recruitment)
app/components/              UI dùng chung + story/*
app/lib/                     firebase, firestore, theme, timeline helpers
app/data/                    copy và timeline tĩnh
```

Alias: `@/` → root project (`@/app/...`).

Server Components mặc định. `"use client"` chỉ khi cần state, hook, motion, Firestore subscription. Layout gốc là Server Component; font load ở đó.

---

## 7. Firebase / CMS

- Cấu hình client: `app/lib/firebase.ts`. Thiếu env → demo local (admin mở, data fallback `clubData`).
- Firestore helpers: `app/lib/firestoreService.ts`. Không ghi `undefined` lên Firestore (`sanitizeForFirestore`).
- Rules: `firestore.rules`, `storage.rules`. Đừng nới quyền public write.
- Blog/recruitment/resource pages: Firestore là runtime; `clubData` là fallback khi chưa cấu hình hoặc lỗi quyền.
- Secret (`.env.local`, service account) không commit.

Listener thiếu quyền sẽ log `Missing or insufficient permissions` - kiểm tra rules và auth, đừng “sửa font” vì console đó.

---

## 8. Git và rewrite lớn

- Một commit = một ý. Tách: (a) xóa CSS/layout, (b) chuyển data sang file mới, (c) Firebase/config.
- Sau khi đụng `clubData.ts` hoặc file nhiều tiếng Việt: `git diff` **đọc chữ**, không chỉ `--stat`. Diff encoding sẽ thấy `Câu` → `CÃ¢u`.
- Đổi nhánh có CSS/font: cân nhắc xóa `.next` nếu UI sai lệch không giải thích được.
- Không force-push `main`. Không commit `.env`.

---

## 9. Kiểm tra trước khi coi là xong

UI (kể cả “chỉ sửa data chữ”):

1. Trang chủ: nav **Giới thiệu / Lịch sử / Tài liệu / Cơ cấu ban / Blog** - dấu tiếng Việt đúng, không `á»`.
2. Hero: “Câu Lạc Bộ”, “Đại sứ số học đường” đúng chính tả; headline `font-display` (Archivo), body Be Vietnam Pro.
3. `/story`, `/departments`, `/resources`, `/blog` - copy không mojibake.
4. Đổi theme light/dark: class font trên `<html>` vẫn còn (Inspect: `__variable` + `__className` của Be Vietnam Pro / Archivo).
5. Computed `font-family` của `body` chứa `Be Vietnam Pro`, không chỉ `Segoe UI` / `Arial`.

Nếu chữ đúng trong source nhưng computed font là system UI → lỗi wiring mục 3. Nếu source đã `á»` → lỗi encoding mục 2.

---

## 10. Checklist pull request

- [ ] File tiếng Việt vẫn UTF-8; không có `á»` / `CÃ¢u` mới.
- [ ] Không tháo `next/font` variable + className; `--font-sans` vẫn trỏ Be Vietnam Pro.
- [ ] Copy mới khớp giọng CLB; không hardcode hex/font lạ nếu đã có token.
- [ ] Client boundary không phình (`"use client"` tối thiểu).
- [ ] Ảnh remote nằm trong `images.remotePatterns`.
- [ ] Đã xem trang đổi trên dark và light.

---

## Tham chiếu nhanh

- Font API: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`
- Tailwind v4 + next/font: cùng file, mục “With Tailwind CSS” (`@theme inline` + `--font-sans`)
- Theme: `app/lib/theme.ts`, `app/components/ThemeInitScript.tsx`
- Copy tĩnh: `app/data/clubData.ts`
- Timeline: `app/data/storyTimeline.ts`, `app/components/MilestoneTimeline.tsx`
