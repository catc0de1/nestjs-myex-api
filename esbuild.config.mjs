import { existsSync, rmSync, statSync } from 'fs';
import { build } from 'esbuild';
import { execSync } from 'child_process';

const start = Date.now();
console.log(`\nStart Build:\n`);

function run(cmd, label) {
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.error(`\n${label} failed`);
    process.exit(1);
  }
}

try {
  // typescript strict check
  const TYPE_LABEL = 'TypeScript check';
  console.log(`\nTypeScript strict checking . . .`);
  run('pnpm tsc -p tsconfig.build.json --noEmit', TYPE_LABEL);
  console.log(`${TYPE_LABEL} done`);

  // eslint check
  // const LINT_LABEL = 'ESLint check';
  // console.log(`\nLinting with ESLint . . .\n`);
  // run('pnpm eslint . --max-warnings=0', LINT_LABEL);
  // console.log(`\n${LINT_LABEL} done`);

  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    console.log('\nDist directory cleaned');
  }

  await build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/main.js',
    minify: true,
    treeShaking: true,
    sourcemap: false,
    external: [
      // NestJS optional modules
      '@nestjs/microservices',
      '@nestjs/websockets',
      '@nestjs/websockets/socket-module',

      // ORM optional deps
      '@mikro-orm/core',
      '@nestjs/sequelize',
      '@nestjs/sequelize/dist/common/sequelize.utils',
      '@nestjs/mongoose',

      // Native / runtime deps
      'pg',
      'typeorm',
    ],
  });

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  const size = (statSync('dist/main.js').size / 1024).toFixed(2);

  console.log(`\nBuild success in ${duration}s`);
  console.log('Output     : dist/main.js');
  console.log(`Bundle size: ${size} KB`);
} catch (err) {
  console.error('Build failed');

  if (err.errors) {
    for (const e of err.errors) {
      console.error(`• ${e.text}`);
    }
  } else {
    console.error(err);
  }

  process.exit(1);
}
