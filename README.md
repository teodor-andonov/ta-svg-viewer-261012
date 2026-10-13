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

## Version 2

One floating bottom bar: Open, zoom out, percentage (tap to fit), zoom in, and theme switch. Light/dark mode updates the interface and canvas and remembers your preference; it does not recolour SVG artwork.

On Android, you can always use **Open**. The installed PWA also registers **Share → SVG Viewer** for SVG files, subject to Android/Chrome support (some recent Android versions have a file-sharing regression). Reinstall the PWA if the share entry is not visible after this update. Android does not support assigning a PWA as the OS's default .svg opener.

On Windows/macOS/Linux desktop Chromium, installed PWA SVG file association is supported through `file_handlers` and `launchQueue`. Shared SVGs are transferred via temporary on-device Cache Storage and deleted after opening; never uploaded.

## Version 3 — desktop file handling, updates and file information

- Windows Chrome/Edge: install the PWA, allow its file-handling permission, and choose **SVG Viewer** for `.svg` in **Right-click → Open with** or **Windows Settings → Apps → Default apps → .svg**. If not registered, reinstall the PWA and check browser app permissions.
- The bottom panel shows the filename and any accessible relative directory; native full paths (such as `C:\\Projects\\foo.svg`) are hidden by web-platform security. Clicking the filename refreshes the original from disk when a browser file handle exists; the location text opens the native SVG picker near the last folder when supported.
- Light/dark mode controls the entire app shell and canvas (not vector artwork). Fixed stale JavaScript referencing a removed Fit button.
- A versioned offline cache and service worker update check on launch, hourly while open, and when returning online/foreground. When a new worker activates, idle app windows reload; viewers with open SVGs reload on next return to avoid interrupting the current view.
