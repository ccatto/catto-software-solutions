/**
 * Cross-platform mobile build script
 * Replaces build-mobile.sh for Windows compatibility
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '..', 'frontend');
const apiDir = path.join(frontendDir, 'app', 'api');
const apiHiddenDir = path.join(frontendDir, 'app', '_api_hidden');
const webConfigPath = path.join(frontendDir, 'next.config.ts');
const webConfigBackup = path.join(frontendDir, 'next.config.web.ts.bak');
const mobileConfigPath = path.join(frontendDir, 'next.config.mobile.ts');

function run(cmd, cwd = frontendDir) {
  console.log(`Running: ${cmd}`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit', shell: true });
    return true;
  } catch (error) {
    console.error(`Command failed: ${cmd}`);
    return false;
  }
}

function hideApiRoutes() {
  if (fs.existsSync(apiDir)) {
    console.log('Hiding API routes...');
    fs.renameSync(apiDir, apiHiddenDir);
  }
}

function restoreApiRoutes() {
  if (fs.existsSync(apiHiddenDir)) {
    fs.renameSync(apiHiddenDir, apiDir);
  }
}

function swapToMobileConfig() {
  if (fs.existsSync(webConfigPath)) {
    fs.renameSync(webConfigPath, webConfigBackup);
  }
  if (fs.existsSync(mobileConfigPath)) {
    fs.copyFileSync(mobileConfigPath, webConfigPath);
  }
}

function restoreWebConfig() {
  if (fs.existsSync(webConfigBackup)) {
    // Remove the mobile config copy
    if (fs.existsSync(webConfigPath)) {
      fs.unlinkSync(webConfigPath);
    }
    fs.renameSync(webConfigBackup, webConfigPath);
  }
}

async function build() {
  let buildSuccess = false;

  try {
    // Step 1: Hide API routes
    hideApiRoutes();

    // Step 2: Swap configs
    swapToMobileConfig();

    // Step 3: Build
    console.log('\n📦 Building frontend for mobile...\n');
    buildSuccess = run('yarn build');
  } finally {
    // Always restore everything
    restoreWebConfig();
    restoreApiRoutes();
  }

  if (buildSuccess) {
    console.log('\n✅ Mobile frontend build complete!\n');
    process.exit(0);
  } else {
    console.error('\n❌ Mobile frontend build failed!\n');
    process.exit(1);
  }
}

build();
