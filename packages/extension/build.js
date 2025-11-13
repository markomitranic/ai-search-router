import * as esbuild from 'esbuild';
import { copyFile, mkdir, rm, readdir, stat } from 'fs/promises';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../..');
const distDir = join(rootDir, 'dist/chromium');

const isWatch = process.argv.includes('--watch');

console.log('🔨 Building AI Search Router Extension...\n');

// Clean dist
await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

// Build configuration
const buildOptions = {
  entryPoints: [
    'src/background.ts',
    'src/popup/popup.ts',
    'src/options/options.ts'
  ],
  bundle: true,
  outdir: distDir,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  sourcemap: isWatch ? 'inline' : false,
  minify: !isWatch,
  logLevel: 'info'
};

if (isWatch) {
  console.log('👀 Starting watch mode...\n');
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('✓ Watching for changes...\n');
} else {
  await esbuild.build(buildOptions);
  console.log('✓ TypeScript compiled\n');
}

// Copy static files
const staticFiles = [
  'manifest.json',
  'src/background.html',
  'src/popup/popup.html',
  'src/popup/popup.css',
  'src/options/options.html',
  'src/options/options.css'
];

console.log('📋 Copying static files...');
for (const file of staticFiles) {
  const dest = join(distDir, file.replace('src/', ''));
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(join(__dirname, file), dest);
  console.log(`  ✓ ${file}`);
}

// Copy icons directory
console.log('\n🎨 Copying icons...');
const iconsSource = join(__dirname, 'icons');
const iconsDest = join(distDir, 'icons');
await mkdir(iconsDest, { recursive: true });

async function copyDirectory(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyDirectory(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
      console.log(`  ✓ icons/${entry.name}`);
    }
  }
}

await copyDirectory(iconsSource, iconsDest);

console.log('\n✨ Build complete!\n');

if (!isWatch) {
  console.log('📦 Extension built to: dist/chromium/\n');
  console.log('Next steps:');
  console.log('  1. Open chrome://extensions/');
  console.log('  2. Enable "Developer mode"');
  console.log('  3. Click "Load unpacked"');
  console.log('  4. Select dist/chromium/\n');
}
