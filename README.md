# KUBRA Style Guide 2.0 — interactive site

A searchable, static website built from the Confluence page **[Style Guide 2.0](https://kubra.jira.com/wiki/spaces/CD/pages/2016313568/Style+Guide+2.0)** (space: Design, cloud: kubra.jira.com) and its 31 sub-pages, covering content structure, foundations (voice/tone/accessibility), system messages, controls and inputs, forms and flows, compliance and legal, and reference and governance.

## Features

- **Search** — live, full-text search across every page, with highlighted matches and snippet previews.
- **Section navigation** — collapsible sidebar grouped the same way as the Confluence space, with a previous/next footer on every page.
- **Filterable categories** — chips for each of the 7 sections plus Accessibility / Payments / Errors & Messaging, which dim non-matching pages in the sidebar.
- **Copy-able examples** — every "do" and "don't" example line gets a small copy button.
- **Light / dark mode** — toggle in the header, remembered via `localStorage`, and respects the OS preference by default.
- No build step, no dependencies — plain HTML/CSS/JS, so it runs the same locally and on GitHub Pages.

## Files

- `index.html` — page shell, navigation metadata (`SECTIONS` / `META`), and every page's content as `<template>` elements.
- `styles.css` — all styling, including light/dark theme tokens.
- `app.js` — rendering, routing (hash-based), search, filters, copy buttons, and theme toggle.

## Publishing to GitHub Pages

You already have the repo at **github.com/HaydenHarrison-kubra/haydenharrison-kubra.github.io** — since it's named `<username>.github.io`, GitHub serves it automatically from the `main` branch root with no extra configuration needed once these files are pushed.

1. Copy `index.html`, `styles.css`, and `app.js` into your local clone of the repo (root level — not a subfolder).
2. Commit and push:
   ```
   git add index.html styles.css app.js README.md
   git commit -m "Add interactive style guide site"
   git push origin main
   ```
3. Give it a minute, then visit `https://haydenharrison-kubra.github.io/`.
4. If it doesn't appear, check **Settings → Pages** in the repo and confirm the source is set to "Deploy from a branch" → `main` → `/ (root)`.

## Keeping it in sync with Confluence

This is a snapshot of the Confluence content as of today. Confluence remains the editable source of truth — when the style guide changes there, the fastest way to update this site is to ask Claude to re-pull the updated page(s) and regenerate the matching `<template>` block(s) in `index.html`. There's no live/automatic sync between Confluence and this site.
