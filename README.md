# Estate Agent APP (5COSC026W Reassessment)

A React single-page application for searching, viewing, and favouriting properties, built for the 5COSC026W coursework brief.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm test          # Jest test suite (8 tests)
```

## What's implemented so far

| Rubric area | Status | Where |
|---|---|---|
| JSON data (7 properties) | done | `src/data/properties.json` |
| React Widgets on every form field | done | `src/components/SearchForm.jsx` (DropdownList, NumberPicker, DatePicker, Combobox) |
| Search functionality (1-5 criteria) | done | `src/utils/search.js` (`filterProperties`, unit-tested) |
| Results display | done | `src/components/ResultsList.jsx`, `PropertyCard.jsx` |
| Property page gallery | done | `react-image-gallery` in `PropertyPage.jsx` - swap the placeholder images referenced in `properties.json` for 6-8 real photos per property |
| Property page tabs (description / floor plan / map) | done | `react-tabs` in `PropertyPage.jsx`, Google Maps embed |
| Add to favourites (drag + button) | done | Drag from `PropertyCard` onto the floating ♥ button, or drop directly into the open drawer; heart button on card and detail page |
| Remove/clear favourites (drag + button + clear) | done | Drag a favourite row back onto the ♥ button or the results grid, use the × on each row, or "Clear all" in the drawer |
| Display favourites on search page | done | `FavouritesPanel` - a floating action button (bottom-right, live count badge) that opens a slide-in drawer, rendered globally in `App.jsx` so it's available on every page |
| Responsive design (3 layouts) | done | Hand-written breakpoints at 1023px (iPad landscape), a 768-1023px tablet tweak (2-column results grid), and 640px (mobile) in `index.css` |
| Aesthetics | done | Design tokens in `index.css` - violet/pink/orange gradient palette + Fraunces/Inter pairing, glassmorphic panels, gradient pill tags, toast notifications for feedback |
| User feedback / interaction | done | `ToastContext.jsx` - gradient toast notifications confirm every favourite add/remove; hover/press micro-interactions on buttons and cards |
| Security (CSP + encoding) | done | CSP meta tag in `index.html`; React escapes all JSX output by default (no `dangerouslySetInnerHTML` used) |
| Accessibility | done | Visible `:focus-visible` outlines on all icon-only buttons (FAB, drawer close, favourite hearts, remove ×), WCAG-safe contrast on gradient tags |
| JEST testing (5+ tests) | done | 8 tests across `__tests__/search.test.js` and `__tests__/favouritesReducer.test.js` |
| GitHub commits | your job | commit incrementally as you customise, don't do one giant commit |
| Deployment | your job | `npm run build` then deploy `dist/` via GitHub Pages (see below) |
| Code quality | ongoing | comments throughout, consistent formatting |

## Project structure notes

- **No branded header** — the top bar (logo/name) was intentionally removed for a cleaner, less "template-y" feel. The hero banner and the ♥ favourites button are the only persistent UI chrome.
- **Favourites live in `FavouritesPanel.jsx`**, not a sidebar list. It's rendered once, globally, in `App.jsx` (not per-page), so it works identically on the search page and property detail pages.
- **Toasts live in `ToastContext.jsx`**, deliberately separate from `FavouritesContext.jsx` — the favourites reducer stays a pure, side-effect-free function (important for the unit tests), while showing a notification is a UI-layer concern triggered from the components themselves.
- **`properties.json`** uses `images` (not `gallery`) for the photo array, and `postcode` as an explicit field alongside the full `location` string.

## Still to personalise before submission

1. **Real photos** — replace the placeholder images referenced in `properties.json` with 6-8 real photos per property (or stock photos you have rights to use), matching the House/Flat descriptions.
2. **Google Maps tab** — currently uses a plain embeddable Maps URL keyed off the address text (no API key needed); if you want pins/markers, that requires a Maps JavaScript API key, which is optional here.
3. **Write your responsive design justification** for the report/viva (see below) — you now have three breakpoints, not two, so make sure your report reflects that.

## Deploying to GitHub Pages

```bash
npm install --save-dev gh-pages
```
Add to `package.json`:
```json
"homepage": "https://Dewmini24.github.io/estate-agent-app",
"scripts": { "predeploy": "npm run build", "deploy": "gh-pages -d dist" }
```
Then set `base: '/estate-agent-app/'` in `vite.config.js`, and run `npm run deploy`.

## Viva talking points

- **Search logic**: `filterProperties` in `src/utils/search.js` treats every criterion as optional, so any combination of 1-5 filters works. This is directly unit-tested in `__tests__/search.test.js`.
- **Favourites**: modelled as a reducer (`favouritesReducer`) so the "no duplicates" rule is a pure, testable function, independent of whatever UI (drag-and-drop, heart button, or the FAB drop target) calls it.
- **Toast notifications**: kept in a separate `ToastContext` rather than baked into the favourites reducer, on purpose - it's a side effect, and side effects don't belong in a function you want to unit test in isolation.
- **Security**: the CSP meta tag restricts script/style/frame sources; React's JSX auto-escapes all interpolated text (e.g. property descriptions), preventing stored-XSS even though the JSON "looks" like it could contain HTML.
- **Responsive strategy**: sidebar+grid on large screens collapses to a 2-column grid on tablets (768-1023px) and a single column on mobile (≤640px), using CSS Grid/Flexbox + hand-written media queries, not a UI framework's breakpoints. The tablet tier exists specifically so an iPad in portrait isn't wasting horizontal space on one column when two comfortably fit.
- **react-widgets styling**: the library's `.rw-widget-input { width: inherit }` rule didn't resolve correctly inside the app's flex/grid layout, so `index.css` overrides it with an explicit `width: 100%` scoped to `.search-form` - a good example of debugging a third-party library's CSS rather than just working around it.