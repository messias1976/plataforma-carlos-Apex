#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return typeof result.status === 'number' ? result.status : 1;
}

const generateStatus = run('node', ['tools/generate-llms.js']);
if (generateStatus !== 0) {
  console.warn('Aviso: geração de llms.txt falhou, seguindo para build.');
}

const buildStatus = run('vite', ['build']);
process.exit(buildStatus);
