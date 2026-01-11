import { existsSync, rmSync, statSync } from 'fs';
import { build } from 'esbuild';

const start = Date.now();

try {
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    console.log('Dist directory cleaned');
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

  console.log(`\nBuild success in ${duration}s`);
  console.log('Output     : dist/main.js');

  const size = (statSync('dist/main.js').size / 1024).toFixed(2);
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
