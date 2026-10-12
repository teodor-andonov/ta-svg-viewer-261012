# SVG Viewer

A small, dependency-free SVG viewer. Built mobile-first, especially for Android.

## Features

- Open `.svg` files from Android Files (or a desktop file picker)
- Pinch to zoom, drag to pan, double-tap to fit
- Zoom controls and fit-to-screen
- Paper / dark / transparency-checkerboard canvas
- Offline use once installed/cached
- Local processing: no uploads, accounts, analytics, frameworks or network requests for your artwork
- Demo drawing for testing

SVG is displayed using an `<img>` and a local `blob:` URL, rather than injected into the document. Inline SVG script is not executed as application code. SVGs that rely on *separate external files* (linked fonts/images/styles) may not be fully self-contained, so those resources might not display. This is a viewer, not an SVG editor.

## Publish on GitHub Pages

1. Create a **public** repository on GitHub, for example `ta-svg-viewer-261012`.
2. Upload every file and folder from this package to the root of `main` (including `icons/` and `.nojekyll`). You can also push with Git.
3. In the repository, go to **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, `main`, `/(root)`, and save.
4. Your URL will be `https://YOUR_USERNAME.github.io/ta-svg-viewer-261012/` (replace username/repo accordingly).
5. Open that URL in **Chrome on Android**. Use the browser menu → **Add to Home screen** / **Install app** (wording varies by version).
6. Open an SVG, or try the bundled sample. After the app shell has cached successfully, it works offline.

`https://` or localhost is necessary for installation and offline service-worker support. Opening `index.html` directly via `file://` is fine for limited browser testing, but not as a full PWA.

## Desktop shortcuts

- `Ctrl/Cmd + O` — open SVG
- `+` / `-` — zoom
- `F` / `0` — fit
- Mouse wheel / trackpad — zoom at cursor
- Drag and drop — open SVG

## Architecture

| File | Purpose |
|---|---|
| `index.html` | Semantic UI shell |
| `styles.css` | Minimal responsive styles |
| `app.js` | File reading and pointer-gesture viewer |
| `manifest.webmanifest` | Android home-screen installation |
| `sw.js` | Offline app-shell cache |
| `icons/` | SVG and PNG launcher icons |
| `sample.svg` | Built-in example |

No build process required. Any static web server works. To test locally, run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000/` on your computer.