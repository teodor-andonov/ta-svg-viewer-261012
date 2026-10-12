# SVG Viewer

A minimal, installable SVG viewer with an Android-first touch interface.

**App URL (once GitHub Pages is enabled):** https://teodor-andonov.github.io/ta-svg-viewer-261012/

## What it does

- Open SVG files from Android Files or the desktop file picker.
- Pinch to zoom, drag to pan, double-tap to fit.
- Use zoom controls, fit-to-screen and paper / dark / checkerboard backgrounds.
- Process selected SVGs locally. Nothing is uploaded.
- Install on the Android home screen and use offline after the app shell caches.
- Explore the bundled architectural drawing.

SVGs display as images, not as executable inline SVG markup. External resources in SVG files (linked images or fonts) may not render.

## Enable GitHub Pages (one-time)

This repository contains an automatic deployment workflow at `.github/workflows/pages.yml`.

1. Open **Settings → Pages** in the repository: https://github.com/teodor-andonov/ta-svg-viewer-261012/settings/pages
2. In **Build and deployment**, choose **Source → GitHub Actions**.
3. Open **Actions → Deploy SVG Viewer to GitHub Pages** and rerun the latest failed workflow, or push a new commit to `main`.
4. After the deployment succeeds, open the app URL above.

To install on Android, open the deployed URL in **Chrome** and select **Install app** / **Add to Home screen** from the browser menu.

## Source

| Path | Description |
|---|---|
| `index.html` | App interface |
| `styles.css` | Layout and visual styling |
| `app.js` | SVG rendering and touch controls |
| `sample.svg` | Example artwork |
| `manifest.webmanifest` | Android PWA manifest |
| `sw.js` | Offline app-shell service worker |
| `icons/` | Launcher icons |
| `.github/workflows/pages.yml` | GitHub Pages deployment |

No build process, package manager or framework. All paths are relative, so the app works under the GitHub Pages repository subpath.

## Desktop shortcuts

- Ctrl/Cmd + O: open SVG
- + and -: zoom
- F or 0: fit
- Mouse wheel: zoom under cursor
- Drag and drop: open SVG
