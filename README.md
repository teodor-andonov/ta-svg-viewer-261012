# SVG Viewer

A minimal SVG viewer for Android and desktop. No framework, build tooling or dependencies.

**Live app:** https://teodor-andonov.github.io/ta-svg-viewer-261012/

## Interface

The app opens onto a blank canvas with a single floating bottom bar.
- **SVG Viewer / filename:** opens the native SVG file picker. After opening a file, the label becomes its filename; a secondary label shows only location/provenance information available to the browser.
- **– / percentage / +:** zoom controls, with the percentage returning to fit-to-screen.
- **Moon / sun:** switches the UI and surrounding canvas between light/dark, without modifying the SVG artwork.

Touch: drag to pan, pinch to zoom, double-tap to fit. Desktop: drag to pan, wheel to zoom, drop an SVG, Ctrl/Cmd+O to open.

Files are processed locally. Full native filesystem paths are generally not exposed to PWAs.

## Installation and file handling

Open the app in Chrome/Edge and select **Install app**. Windows users can select the installed PWA from **Open with** for SVG files where supported. Android users can use the in-app picker and, where supported, **Share → SVG Viewer**. File association and Android share support depend on browser/OS versions.

The PWA automatically checks for deployed updates using a versioned service worker, and stays functional offline after caching. Launcher icons are rasterized from the original custom line-drawing SVG previously shown on the empty screen. Existing Android/Windows installations may need reinstalling to refresh the OS-cached launcher icon.

## Structure

- `index.html`: single-screen shell
- `styles.css`: responsive light/dark interface
- `app.js`: viewer, zoom/pan, file handling
- `sw.js`: offline caching and share handoff
- `manifest.webmanifest`: PWA setup and file association
- `icons/`: SVG source and install icons
- `.github/workflows/pages.yml`: deployment to GitHub Pages

## Publishing

Releases are manual. Open **Actions → Publish SVG Viewer → Run workflow** and select `main`. Pushing commits does not trigger the Pages publishing workflow. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**, not **Deploy from a branch**.

## PWA maintenance

See [PWA.md](PWA.md) for this app’s identity, icons, update guard and release checks. Shared browser requirements live in the [TA PWA guide](https://github.com/teodor-andonov/261027_ta-guides/blob/main/guides/pwa/README.md); repository publishing policy is documented [separately](https://github.com/teodor-andonov/261027_ta-guides/blob/main/guides/publishing/README.md).
