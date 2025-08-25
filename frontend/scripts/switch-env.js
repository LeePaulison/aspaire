#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

const environments = {
  local: 'http://localhost:4000/graphql',
  fly: 'https://aspaire-backend.fly.dev/graphql'
};

const target = process.argv[2];

if (!target || !environments[target]) {
  console.log('Usage: node scripts/switch-env.js [local|fly]');
  console.log('Current environments:');
  Object.entries(environments).forEach(([key, url]) => {
    console.log(`  ${key}: ${url}`);
  });
  process.exit(1);
}

try {
  let envContent = readFileSync(envPath, 'utf8');
  
  // Replace the GRAPHQL_URL line
  const urlRegex = /NEXT_PUBLIC_GRAPHQL_URL=.*/;
  const newUrl = `NEXT_PUBLIC_GRAPHQL_URL=${environments[target]}`;
  
  if (urlRegex.test(envContent)) {
    envContent = envContent.replace(urlRegex, newUrl);
  } else {
    envContent += `\n${newUrl}\n`;
  }
  
  writeFileSync(envPath, envContent);
  console.log(`✅ Switched to ${target} environment: ${environments[target]}`);
} catch (error) {
  console.error('❌ Error updating .env.local:', error.message);
  process.exit(1);
}
