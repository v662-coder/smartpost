# Changelog

This document describes what changed in this repair/upgrade pass, why, and how each change was
verified. See `VERIFICATION_REPORT.md` for the honest verification status of everything below —
some items were confirmed by static analysis (this environment had no network access, so nothing
could actually be run against a live database or browser).

## Critical bugs fixed

### Post creation & the permanent-preview UX (as reported)
- **Root cause of "preview shows permanently":** `AddPost.jsx` rendered the markdown preview via
  `dangerouslySetInnerHTML` directly in the editor layout, with no way to hide it. Replaced with
  a dedicated `PostPreviewModal` (full-screen, desktop/mobile toggle, Close/Back-to-Editor)
  opened only by a new **Preview** button, and it always reflects the current unsaved editor
  state (title, tags, description), not a stale save.
- **Root cause of "post list has no way to create a post":** `MyPost.jsx` only ever rendered the
  `AddPost` form when editing an existing post — there was no "Add Post" button on the list page
  at all. Added one, plus a proper empty state ("No posts yet — create your first post").
- The backend `addPost` controller never returned the newly created post in its response, so any
  UI trying to insert it into a list (or show it) after creation had nothing to work with. It now
  returns `post: savedPost`, and the frontend inserts the real record (with its real `_id`) into
  the list on success — never before the server confirms success.
- `addPost`/`editPost` would throw a raw 500 if `tags` was missing from the request body
  (`.length` on `undefined`). Now defensively defaults to `[]` and returns a clean 400.

### Product creation ("Add Product not working")
- **Root cause:** `addProduct` read `req.file.filename` *before* checking whether a file was
  actually uploaded. If `req.file` was undefined (missing field name mismatch, no file selected,
  multer misconfiguration), this crashed with an unhandled `TypeError` → generic 500, with no
  useful message to the user. Now checks `req.file` first and returns a clear validation error.
- The product image upload directory (`server/uploads/productimage`) was created ad hoc and would
  not exist on a fresh checkout unless the exact folder happened to be present, which would crash
  multer with `ENOENT` on the very first upload. The upload middleware now creates the destination
  directory automatically.
- Editing a product required re-uploading an image every time — the file input was marked
  `required` unconditionally, even when `editData` (an existing product with an existing image)
  was present. Now only required when creating a new product; the existing image is shown and
  preserved on edit unless a new one is chosen.
- `addProduct`/`editProduct` now return the saved/updated product in their response, and
  `MyProduct.jsx` got the same missing "Add Product" button + empty state treatment as posts.
- The product form's submit handler previously swallowed all errors (`catch { console.error(err) }`)
  with no user-facing feedback at all — a silent failure. Now shows a proper error toast.

### Task update & delete ("Task update fails" / "Task delete fails")
This was the most involved fix — three separate, compounding bugs:
1. **Fake success on create:** `TaskManager.jsx`'s create handler inserted a task into local
   state *unconditionally*, before (and regardless of) whether the API call actually succeeded —
   a "fake success" pattern that violates the no-fake-success principle. This is now fixed: the
   task is only added to the UI after the server confirms success, using the real record returned
   by the API.
2. **Missing ID on create:** the backend `addTask` controller never returned the created task, so
   even when creation *did* succeed, the optimistically-inserted local task object had no `_id`.
   Any subsequent Edit or Delete on that task then sent `taskId=undefined` to the API, which is
   exactly what produced the "update fails" / "delete fails" symptoms. `addTask` now returns
   `task: savedTask`.
3. **No real edit capability existed:** the backend only ever had one update route,
   `PATCH /tasks/:taskId/:taskStatus`, which can only cycle the status — there was no way to edit
   a task's title, description, priority, or due date at all, despite the UI implying you could.
   Added a proper `PATCH /tasks/:taskId` endpoint (`editTaskDetails`) that accepts a JSON body and
   updates whichever fields are present, plus a new **Edit Task** modal (`EditTaskForm.jsx`) with
   real fields for title, description, priority, due date, and status.
4. The original status-update controller also crashed with a `TypeError` if the task didn't exist
   or belonged to a different user (`findOneAndUpdate` can return `null`, and the code
   unconditionally read `.taskStatus` off the result). Now returns a clean 404 instead.
5. Drag-and-drop status changes are now optimistic-with-rollback: the UI updates immediately for
   responsiveness, but rolls back if the server call fails, rather than silently drifting from the
   real database state.
6. Delete (for posts, products, and tasks) now goes through a shared confirmation dialog
   (`ConfirmDialog.jsx`) instead of deleting immediately on click.

## Security fixes

- **Removed real secrets that were committed in `server/.env` and `client/.env`**, including a
  live MongoDB Atlas username/password and — more seriously — an **Auth0 Client Secret exposed in
  a `VITE_`-prefixed variable**, which means it was being bundled into the public JavaScript
  shipped to every visitor's browser. (It also turned out to be unused in the codebase entirely.)
  Both `.env` files have been removed from this package; `.env.example` templates with placeholder
  values are provided instead. **If you were using the credentials that previously shipped with
  this project, rotate your database password and regenerate the Auth0 client secret.**
- `main.jsx` had the Auth0 domain and client ID hardcoded inline (duplicated from, and
  inconsistent with, the `.env` values) instead of reading them from `import.meta.env`. Fixed to
  read from environment variables, matching the rest of the app.
- The auth middleware crashed with an unhandled exception if a JWT decoded to a `userId` that no
  longer matched any user (`user.role` on `null`). Now returns a clean 401.
- JWT verification errors were previously returned as a generic 500 with the raw `error` object
  serialized into the JSON response body (a stack-trace/internals leak). Now returns a proper 401
  with a user-safe message; full details still go to the server console for debugging.
- Product image uploads are now restricted to JPEG/PNG/WEBP and capped at 5MB via multer's
  `fileFilter` and `limits`, instead of accepting arbitrary file types unbounded in size.
- Uploaded filenames are now sanitized before being used as the on-disk filename.

## Other fixes

- Static file serving (`express.static('uploads')`) resolved the uploads path relative to
  `process.cwd()`, meaning it would silently serve nothing (or the wrong files) if the server was
  ever started from a different working directory than `server/`. Now resolved relative to the
  server file's own location, which is robust regardless of how/where `node` is launched.
- Added a catch-all 404 JSON handler for unmatched API routes, instead of falling through to
  Express's default HTML error page.
- Post visibility ("public"/"private") is now settable at creation time as well as via the
  existing toggle, and is respected on edit.

## Folder structure — reorganized for a more standard, professional layout

- Moved `client/components/` → `client/src/components/` and `client/provider/` →
  `client/src/provider/`. Previously these lived as siblings of `client/src/`, which is
  non-standard for a Vite project and forced awkward `../../../src/...`-style relative imports
  throughout the codebase. All ~35 affected import statements were updated accordingly, and every
  relative import in the client was mechanically re-verified to resolve to a real file (see
  `VERIFICATION_REPORT.md`).
- Renamed `server/controller/` → `server/controllers/` (plural), matching the pluralized
  `routes/`, `models/`, `middleware/` convention already used elsewhere in the backend, and
  updated all six route files that imported from it.

## UI/UX improvements

- New reusable `ConfirmDialog` component for all destructive actions (delete post/product/task),
  replacing immediate, unconfirmed deletion.
- New full-screen `PostPreviewModal` with a Desktop/Mobile toggle, replacing the permanent inline
  preview.
- Added missing "Add Post" and "Add Product" entry points on their respective list pages.
- Added a proper "Cancel" button to the product edit form (previously only the post form had one).
- Added attractive, actionable empty states ("No posts yet — create your first post", "No
  products yet — add your first product", "You're all caught up!" for an empty To-Do column)
  instead of a single generic "No X Available" message with no way to act on it.
- Added loading skeletons for posts, products, and tasks while their initial data is being
  fetched, instead of a blank area.
- All submit buttons now show a busy label ("Saving...", "Publishing...", "Adding...") and
  disable themselves while a request is in flight, preventing duplicate submissions.
- Consistent success/error toasts wired up everywhere an action previously failed silently.

## What was intentionally *not* changed

Per the "don't rewrite unnecessarily" principle: the overall visual design language (colors,
MUI component choices), the comment/reaction system on posts, the Auth0 vs. custom-JWT dual auth
setup, and the admin dashboard were left as-is. They weren't part of the reported bugs, appeared
structurally sound on inspection, and a wholesale redesign was explicitly out of scope for this
pass (see the note at the top of `VERIFICATION_REPORT.md` about environment constraints and
scope).

---

## Round 2 — follow-up fixes

### Critical bugs fixed
- **Join button did nothing:** `/registration` was a real page but had **no route at all** in
  `router.jsx` — clicking Join (or "Join Now" on the Login page) silently went nowhere useful.
  Added the route. Also fixed the Join/Login button markup in `NavBar.jsx`, which wrapped each
  `Button` in its own `Link`, breaking `ButtonGroup`'s connected styling — now uses
  `component={Link}` directly on each `Button` so they render as a proper connected group.
- **NavBar always showed "Join / Login" even when signed in:** it checked
  `Cookies.get(import.meta.env.VITE_COOKIE_KEY)` — an env var that is never defined anywhere in
  this project. Fixed to check `VITE_TOKEN_KEY`, the actual cookie the rest of the app uses.
- **Forgot Password was a dead link:** `Login.jsx` already linked to `/forgot-password`, but
  neither the route, the page, nor any backend support existed. Built the full flow:
  - `POST /users/forgot-password` — generates a random token, stores only its SHA-256 hash with
    a 1-hour expiry (`userSchema.js` gained `resetPasswordToken`/`resetPasswordExpires`, both
    `select: false` so they're never accidentally returned in a normal user fetch), and emails
    the reset link. Always returns the same generic message regardless of whether the email
    exists, so the endpoint can't be used to enumerate registered accounts.
  - `POST /users/reset-password/:token` — verifies the token against its stored hash and expiry,
    and sets the new password (same strength rules as Change Password).
  - New `server/utils/sendEmail.js`: sends real email via `nodemailer` if SMTP credentials are
    configured in `server/.env` (`EMAIL_HOST`/`EMAIL_USER`/`EMAIL_PASS`); if they're **not**
    configured, it honestly logs the reset link to the server console instead of pretending to
    send an email that never went anywhere.
  - New `ForgotPassword.jsx` and `ResetPassword.jsx` pages, matching the existing Login page's
    visual style, including a working password-visibility toggle on the reset form.
- **Distorted product image in the live preview:** root cause was
  `<img width="100%" height="200px">` in `PreviewProduct.jsx` with no `objectFit` — the browser
  stretches the image to exactly fill that box regardless of its real aspect ratio, which is
  exactly the warped photo shown in the bug report screenshot. Fixed by adding
  `objectFit: "cover"`. Applied the same fix defensively to the small upload thumbnail in
  `AddProductFrom.jsx` and the `CardMedia` image on the public product page and the My Products
  grid, none of which had it set explicitly either.
- **Post/Product "update doesn't apply immediately":** this should already have been fixed by
  the Round 1 change that made `editPost`/`editProduct` return the full updated record — both
  now confirmed (re-read) to include `post: updatedPost` / `product` in their response, and
  `MyPost.jsx`/`MyProduct.jsx` merge that real record into the list on success. If this is still
  happening after installing this update, it's most likely the browser holding onto an old
  cached JS bundle rather than a remaining code bug — try a hard refresh.

### Missing pages & routes added
- `/registration`, `/forgot-password`, `/reset-password/:token` (see above).
- `/community`, `/forums`, `/case-studies`, `/blogs` — the footer already linked to all four of
  these, but none of the pages or routes existed, so every one of those links previously landed
  on the 404 page. Added honest, non-fake content for each (no invented testimonials, articles,
  or forum threads — they say plainly what does and doesn't exist yet, and route people toward
  the features that *do* work today, like public post comments).
- Removed a duplicate `/terms-of-service` route definition.

### "How will others see what I create?" — clarified, not a bug
This already worked end-to-end and didn't need a fix: `/posts/:postId` and `/products/:productId`
are genuine public routes (`PublicRoute.jsx` requires no login), and the post detail page already
has working reaction and comment UI wired to the backend. What was missing was *discoverability* —
there was no obvious way to grab the link. Added a "copy public link" button (chain-link icon) to
each row in My Posts and each card in My Products, with a toast confirming the link was copied
(and a heads-up if the post is currently set to Private, since a private post's link won't
actually be viewable by others until its visibility is switched to Public).

### Task Manager flow improvements
- Each column header (`TaskStatus.jsx`) was previously just a bare icon with no label — now
  shows the status name ("To Do" / "Ongoing" / "Completed") and a live count of tasks in that
  column, and dims slightly while a task is being dragged over it as drop feedback.
- Each task card (`Task.jsx`) previously showed only the title and a plain "Status: X" line —
  now shows a color-coded priority chip and a due-date chip (which turns red and reads
  "Overdue" once the due date has passed for a task that isn't completed), plus a drag handle
  icon so it's clearer the cards are draggable between columns.

### Dashboard/profile activity — replaced the 365-cell heatmap
`ActivityGrid.jsx` previously rendered a GitHub-style contribution grid of all 365(+) days at
once, which (especially for a new account with little history) mostly showed a wall of empty
gray boxes and didn't scale well on smaller screens. Replaced it with a `recharts` bar chart of
the last 30 days plus three summary stats computed from the same real activity data — actions
this month, active days in the last 30, and current day streak. No invented numbers; if there's
no activity in the last 30 days it says so plainly instead of showing an empty chart.

### Security
- The Auth0 domain/client ID were already read from env vars (fixed in Round 1) — no change
  needed here, but worth re-confirming since it's adjacent to this round's auth-flow work.

### Env var naming
`VITE_TOKEN_KEY` was already changed from `thinkify` to `smartpost_token` in `.env.example` in
Round 1 — confirmed still correct. The internal `useThinkify` hook/file name was **not** renamed:
it's an implementation-detail identifier that never appears in the UI, in stored data, or in any
cookie/env value, so renaming it across the ~20 files that import it would be a pure-cosmetic,
non-zero-risk change for no user-facing benefit. Happy to do it in a follow-up if you'd still
like the codebase itself to say "smartpost" everywhere rather than just the user-facing/config
surface.

