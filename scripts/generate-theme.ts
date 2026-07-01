#!/usr/bin/env bun
/**
 * Theme Generator Script
 * Reads src/config/theme.config.ts and writes the CSS custom properties
 * into src/styles/globals.css, keeping the rest of the file intact.
 *
 * Usage: bun run generate:theme
 */

import { themeConfig, ThemeTokens } from '../src/config/theme.config';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const GLOBALS_CSS_PATH = resolve(__dirname, '../src/styles/globals.css');

/** Map ThemeTokens keys to CSS custom property names */
const TOKEN_TO_CSS_VAR: Record<keyof ThemeTokens, string> = {
  radius: '--radius',
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  border: '--border',
  input: '--input',
  ring: '--ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
};

function buildBlock(tokens: ThemeTokens): string {
  return (Object.keys(tokens) as (keyof ThemeTokens)[])
    .map((key) => `  ${TOKEN_TO_CSS_VAR[key]}: ${tokens[key]};`)
    .join('\n');
}

const rootBlock = `:root {\n${buildBlock(themeConfig.light)}\n}`;
const darkBlock = `.dark {\n${buildBlock(themeConfig.dark)}\n}`;

// Replace the :root { ... } and .dark { ... } blocks in globals.css
let css = readFileSync(GLOBALS_CSS_PATH, 'utf-8');
css = css.replace(/:root\s*\{[^}]*\}/s, rootBlock);
css = css.replace(/\.dark\s*\{[^}]*\}/s, darkBlock);

writeFileSync(GLOBALS_CSS_PATH, css, 'utf-8');
console.log('✅ globals.css updated from theme.config.ts');
