/**
 * Custom Static Export Script for Mobile Builds
 *
 * This script creates a static SPA-style build for Capacitor from a Next.js
 * standalone build. It works around the Next.js App Router limitation where
 * dynamic routes require generateStaticParams() which can't be used with
 * Client Components.
 *
 * Approach:
 * 1. Build Next.js with standalone output (not export)
 * 2. Extract static assets from .next/static/
 * 3. Create an index.html that bootstraps the Next.js client-side app
 * 4. Copy public/ assets
 * 5. Output to www/ for Capacitor
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const frontendDir = path.join(__dirname, '..', '..', 'frontend');
const nextDir = path.join(frontendDir, '.next');
const publicDir = path.join(frontendDir, 'public');
const mobileDir = path.join(__dirname, '..');
const wwwDir = path.join(mobileDir, 'www');
const apiDir = path.join(frontendDir, 'app', 'api');
const apiHiddenDir = path.join(frontendDir, 'app', '_api_hidden');

// Build ID will be read from .next/BUILD_ID after build
let buildId = '';

function log(message) {
  console.log(`[build-static] ${message}`);
}

function run(cmd, cwd = frontendDir) {
  log(`Running: ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    console.error(`Command failed: ${cmd}`);
    return false;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function hideApiRoutes() {
  if (fs.existsSync(apiDir)) {
    log('Attempting to hide API routes for mobile build...');
    try {
      fs.renameSync(apiDir, apiHiddenDir);
      return true;
    } catch (err) {
      log(
        `Warning: Could not hide API routes (${err.code}). Continuing without hiding.`,
      );
      log('This is usually fine - API routes are not used in mobile builds.');
      return false;
    }
  }
  return false;
}

function restoreApiRoutes() {
  if (fs.existsSync(apiHiddenDir)) {
    log('Restoring API routes...');
    try {
      fs.renameSync(apiHiddenDir, apiDir);
    } catch (err) {
      log(
        `Warning: Could not restore API routes (${err.code}). Manual restore may be needed.`,
      );
    }
  }
}

/**
 * Generate the index.html that bootstraps the Next.js app
 * This acts as the entry point for all routes in the mobile app
 */
function generateIndexHtml() {
  // Read the build manifest to get the correct chunk files
  const buildManifestPath = path.join(nextDir, 'build-manifest.json');
  const appBuildManifestPath = path.join(nextDir, 'app-build-manifest.json');

  let buildManifest = {};
  let appBuildManifest = {};

  if (fs.existsSync(buildManifestPath)) {
    buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));
  }
  if (fs.existsSync(appBuildManifestPath)) {
    appBuildManifest = JSON.parse(
      fs.readFileSync(appBuildManifestPath, 'utf-8'),
    );
  }

  // Get the main entry point chunks (build-manifest.json has rootMainFiles with Turbopack)
  const rootLayoutChunks =
    buildManifest.rootMainFiles || appBuildManifest.rootMainFiles || [];
  const polyfillsChunks = buildManifest.polyfillFiles || [];
  const lowPriorityFiles = buildManifest.lowPriorityFiles || [];

  // Build script tags for the chunks (order matters: polyfills, main files, then low priority)
  const scriptTags = [
    ...polyfillsChunks,
    ...rootLayoutChunks,
    ...lowPriorityFiles,
  ]
    .filter((chunk) => chunk.endsWith('.js'))
    .map((chunk) => `<script src="/_next/${chunk}" defer></script>`)
    .join('\n    ');

  // Build CSS link tags
  const cssLinks = [...polyfillsChunks, ...rootLayoutChunks]
    .filter((chunk) => chunk.endsWith('.css'))
    .map((chunk) => `<link rel="stylesheet" href="/_next/${chunk}">`)
    .join('\n    ');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#ffffff">
    <title>MyApp</title>
    ${cssLinks}
    <style>
      /* Loading state while Next.js hydrates */
      #__next-loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        z-index: 9999;
      }
      #__next-loading.hidden {
        display: none;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div id="__next-loading">
      <div class="spinner"></div>
    </div>
    <div id="__next"></div>
    ${scriptTags}
    <script>
      // Hide loading state once app is mounted
      window.addEventListener('load', function() {
        setTimeout(function() {
          var loader = document.getElementById('__next-loading');
          if (loader) loader.classList.add('hidden');
        }, 100);
      });
    </script>
  </body>
</html>`;

  return html;
}

/**
 * Create a simple SPA fallback HTML
 * This is used when the app doesn't have complex manifest requirements
 */
function generateSimpleSpaHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#ffffff">
    <title>MyApp</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      #__next-loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
      }
      .logo {
        font-size: 32px;
        font-weight: bold;
        color: #3498db;
        margin-bottom: 20px;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  </head>
  <body>
    <div id="__next-loading">
      <div class="logo">MyApp</div>
      <div class="spinner"></div>
    </div>
    <div id="__next"></div>
    <script>
      // Redirect to load the app properly
      // This fallback is for deep links that don't match static files
      var path = window.location.pathname;
      if (path !== '/' && path !== '/index.html') {
        // Store the intended path and redirect to root
        sessionStorage.setItem('capacitor_deep_link', path);
      }
    </script>
  </body>
</html>`;
}

async function build() {
  let hiddenApi = false;

  try {
    log('Starting mobile static build...');

    // Step 0: Clean .next folder to avoid file lock issues (especially on Windows/OneDrive)
    if (fs.existsSync(nextDir)) {
      log('Cleaning .next folder...');
      try {
        // Use shx for cross-platform cleanup - more reliable than fs.rmSync on Windows
        run('npx shx rm -rf .next', frontendDir);
      } catch {
        log(
          'Warning: Could not clean .next folder. Build may fail if files are locked.',
        );
      }
    }

    // Step 1: Hide API routes (they won't work in static build)
    hiddenApi = hideApiRoutes();

    // Step 2: Build Next.js with standalone output
    log('Building Next.js (standalone mode)...');
    const buildSuccess = run('yarn build');

    if (!buildSuccess) {
      throw new Error('Next.js build failed');
    }

    // Step 3: Read the build ID
    const buildIdPath = path.join(nextDir, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      buildId = fs.readFileSync(buildIdPath, 'utf-8').trim();
      log(`Build ID: ${buildId}`);
    }

    // Step 4: Clean and prepare www directory
    log('Preparing www directory...');
    cleanDir(wwwDir);

    // Step 5: Copy static assets from .next/static
    const staticSrc = path.join(nextDir, 'static');
    const staticDest = path.join(wwwDir, '_next', 'static');
    if (fs.existsSync(staticSrc)) {
      log('Copying static assets...');
      copyDirRecursive(staticSrc, staticDest);
    }

    // Step 6: Copy public assets
    if (fs.existsSync(publicDir)) {
      log('Copying public assets...');
      const publicEntries = fs.readdirSync(publicDir, { withFileTypes: true });
      for (const entry of publicEntries) {
        const srcPath = path.join(publicDir, entry.name);
        const destPath = path.join(wwwDir, entry.name);
        if (entry.isDirectory()) {
          copyDirRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    // Step 7: Generate index.html
    log('Generating index.html...');
    let indexHtml;
    try {
      indexHtml = generateIndexHtml();
    } catch {
      log('Using simple SPA fallback HTML...');
      indexHtml = generateSimpleSpaHtml();
    }
    fs.writeFileSync(path.join(wwwDir, 'index.html'), indexHtml);

    // Step 8: Create 404.html as copy of index.html (for SPA routing)
    fs.writeFileSync(path.join(wwwDir, '404.html'), indexHtml);

    // Step 9: Verify output
    const files = fs.readdirSync(wwwDir);
    log(`Output files: ${files.join(', ')}`);

    log('Mobile static build complete!');
    log(`Output directory: ${wwwDir}`);

    return true;
  } catch (error) {
    console.error('Build failed:', error.message);
    return false;
  } finally {
    // Always restore API routes
    if (hiddenApi) {
      restoreApiRoutes();
    }
  }
}

// Run the build
build().then((success) => {
  process.exit(success ? 0 : 1);
});
