# KUBRA Copy Audit (Figma plugin)

Checks the text in a Figma file against the [KUBRA Content Style Guide](https://haydenharrison-kubra.github.io/), plus general grammar, spelling, and punctuation. Every issue links to the guideline behind it, and many come with a one-click fix.

## What it checks

| Category | Examples |
|---|---|
| **Style guide** | “click” in buttons, generic labels (Submit, OK), Yes/No buttons, button length (3 words, or 5 for text-only buttons), sentence case on buttons, headings, labels, and menus, heading and button punctuation, vague link text, slashes, “&”, quotation marks, dashes, parenthetical plurals, all caps (including Figma’s Uppercase and Title Case text settings), underline that isn’t a link, “Oops” and emoji, exclamation points, “Are you sure?”, blaming language, vague timing and fees, “a.m.”/“p.m.” and ET, field label rules, glossary product names, legal document names (Terms of Use, Terms and Conditions, Privacy Policy) that must be capitalized and linked, and internal terms like PAN and RTN |
| **Compliance** | SMS opt-in disclosures and the standard error message must match [Standard Copy](https://haydenharrison-kubra.github.io/#standard-copy) word for word, plus full card numbers and SSNs |
| **Grammar** | Misspellings, repeated words, a/an, sentence capitalization, spacing around punctuation, doubled punctuation, commonly confused words (its/it’s, then/than, setup/set up), and curly quotes and apostrophes (Chicago style) |

**Severity:** *Error* means it breaks a hard rule (fix before handoff). *Warning* is very likely wrong. *Suggestion* is worth a look but may be fine in context.

Text that matches approved Standard Copy is exempt from the other checks, so the required “STOP” and “HELP” quotes in SMS disclosures aren’t flagged.

It doesn’t judge tone, clarity, or whether a message is the right type. Those still need a writer’s review.

## Test it locally

You need the **Figma desktop app**. Development plugins can’t be imported in the browser.

1. Open any design file in Figma desktop.
2. Main menu → **Plugins → Development → Import plugin from manifest…**
3. Choose `figma-plugin/manifest.json` from this repo.
4. Run it from **Plugins → Development → KUBRA Copy Audit**.

Changes you make to the plugin files show up the next time you run it. Rebuild first if you edited anything in `src/`, `rules/`, or `config/` (see below).

### Using it

- Select frames or layers and choose **Scan selection**, or choose **Scan page**.
- Click a layer’s header to select and zoom to it on the canvas. The tag on the right shows what kind of text the plugin thinks it is (hover for why).
- **Fix** applies one suggestion. **Fix N safe** applies every fix that’s safe in bulk, such as spacing, spelling, punctuation, product names, and time formats. Undo with Cmd/Ctrl+Z.
- **Ignore** hides an issue on that layer. It’s saved in the Figma file, so teammates won’t see it either. Turn on *Show ignored issues* in settings to restore one.
- **Copy approved text** copies the closest approved Standard Copy.
- **Guide** opens the exact guideline.
- Settings (the sliders icon) turns categories on or off and can include hidden layers.

### Testing checklist

- [ ] Scan a screen with buttons, headings, form fields, and an error or alert. Check that each layer’s tag (Button, Heading, Field label…) is right.
- [ ] Apply a fix on text with mixed styling (for example, a bold amount in a sentence). The styling should stay put.
- [ ] Try **Fix N safe**, then undo.
- [ ] Ignore an issue, close and reopen the plugin, and scan again. It should stay ignored.
- [ ] Paste in an approved SMS disclosure with a real client name. It should pass. Change a word, and it should be flagged.
- [ ] Open a Guide link.
- [ ] Try it in dark mode.

If a layer gets the wrong tag, adjust `config/contexts.json` (below).

## How it decides what kind of text a layer is

Rules like “no ‘click’ in buttons” only run on the right kind of text. The plugin reads:

1. the components the text sits in (names and variant values, like `Button` or `Type=Error`),
2. the text style name (like `Heading/H2`),
3. the layer name, if someone renamed it.

The patterns live in `config/contexts.json`. Edit them to match the design library, then rebuild. Text that matches nothing is treated as body text.

**Text-only buttons:** a button counts as text-only (up to 5 words instead of 3) if one of its variant values is something like `Text`, `Tertiary`, `Ghost`, or `Link`, or if the button has no visible background or border. The layer tag says “Text-only button” and why. Adjust the variant names under `textOnlyButtons` in `config/contexts.json`.

**Icons:** text set in an icon font or icon text style (like “chevron-up” or “wallet”) isn’t copy, so it’s skipped. Icons mixed into a sentence are blanked out before checking. The footer shows how many icon layers were skipped. Add your icon font or style names to `ignore` in `config/contexts.json` if any slip through.

**Links:** legal document names count as linked if they’re **blue**, have a Figma link, use a text style or color (style or variable) with “link” or “blue” in its name, or are underlined. Blue means any clearly blue text color, plus KUBRA blue (#037EB4). Adjust this under `links` in `config/contexts.json`: add exact link colors to `colors`, or set `blueText` to `false` to stop treating all blue text as links.

## Where the rules come from

The plugin downloads `rules.json` from the style guide site each time it runs, so guide updates reach designers without reinstalling. It falls back to the last copy it saved, or the copy built into the plugin, when offline. The status in the plugin’s header shows which one it’s using.

`rules.json` is generated by `build.mjs` from:

- the site’s **Glossary** and **Standard Copy** (in `index.html`) — product names, banned variants, internal terms, approved messages,
- `rules/style-guide.mjs` — hard rules from the guide, each linked to the heading it enforces,
- `rules/grammar.mjs` and `rules/data.mjs` — grammar checks and word lists.

After changing the glossary, standard copy, or any rule file, rebuild and push the site. Designers get the new rules the next time they run the plugin. Changes to `src/engine.js` (how checks work) need a plugin update.

## Developing

From the repo root:

```
node figma-plugin/build.mjs                 # builds rules.json, manifest.json, and dist/
node --test figma-plugin/test/*.test.mjs    # engine tests + main-thread tests against a fake Figma document
```

The build fails if a rule links to a heading that doesn’t exist in the guide, so links can’t silently break when headings change.

- `src/code.js` — runs inside Figma: finds text layers, detects context, applies fixes, saves ignores.
- `src/ui.html` — the plugin window.
- `src/engine.js` — the checks. Shared by the plugin window and the tests.
- `dist/` — generated. Don’t edit by hand.

## Before publishing

- **Plugin ID:** `config/plugin.json` has a placeholder ID (`kubra-copy-audit-dev`). When you publish, Figma assigns a real one. Put it in `config/plugin.json` and rebuild.
- **Private publishing:** on a Figma Organization or Enterprise plan, publish it privately to KUBRA so only your organization can install it.
- **If the site moves** (for example, into the Kubra-hq organization or to a custom domain), update `siteUrl` in `config/plugin.json` and rebuild. That updates the guide links and the network permission in the manifest.
- **If the site starts requiring a login,** the plugin can’t download live rules and will use its saved or built-in copy. Keep `rules.json` somewhere public, or rebuild the plugin whenever rules change.

## Known limits

- Scans the current page, up to 3,000 text layers at a time.
- Sentence case keeps glossary product names, common brands, months, days, and acronyms capitalized. It also skips people’s names when they’re addressed directly (“Welcome, Joe,” “Hi Dana,” “Thanks for paying, Joe Smith”) and placeholders like `{firstName}` or `[Amount]`. Other proper nouns, like a utility’s name or a name mid-sentence, may still be flagged. Ignore those or add them to `properNouns` in `rules/data.mjs`.
- Fixes inherit the styling of the text around them.
