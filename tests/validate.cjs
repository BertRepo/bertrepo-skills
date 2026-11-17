'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let count = 0;
function check(condition, message) { assert.ok(condition, message); count++; }
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const skills = ['frontend-dev-playbook', 'prototype-to-code'];
for (const name of skills) {
  const base = path.join(root, 'skills', name);
  const entry = fs.readFileSync(path.join(base, 'SKILL.md'), 'utf8');
  check(entry.startsWith('---\n'), `${name}: YAML start`);
  check(new RegExp(`^name: ${name}$`, 'm').test(entry), `${name}: name`);
  check(/^description: .{40,}$/m.test(entry), `${name}: discoverable description`);
  check(/^license: MIT$/m.test(entry), `${name}: license`);
  check(!/99%|网关类工具会被|分享链接必须先克隆/.test(entry), `${name}: unsupported claims`);
  for (const file of walk(base).filter(f => f.endsWith('.md'))) {
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), target);
      check(resolved.startsWith(base + path.sep), `Link escapes skill: ${file}`);
      check(fs.existsSync(resolved), `Broken link ${target} in ${file}`);
    }
  }
}
const base = path.join(root, 'skills', 'frontend-dev-playbook');
const entry = fs.readFileSync(path.join(base, 'SKILL.md'), 'utf8');
const routes = [...entry.matchAll(/\]\(references\/([^)]+)\)/g)].map(m => m[1]);
check(new Set(routes).size === 13, 'Expected 13 distinct scenario references');
check(entry.split('\n').length <= 80, 'Keep entry small enough for progressive loading');
const scenarios = JSON.parse(fs.readFileSync(path.join(root, 'evals', 'scenarios.json'), 'utf8'));
check(scenarios.length >= 20, 'Scenario coverage');
check(new Set(scenarios.map(s => s.id)).size === scenarios.length, 'Unique scenario IDs');
for (const s of scenarios) {
  check(s.prompt.length > 5 && s.criteria.length > 10, `${s.id}: concrete behavioral criteria`);
  for (const ref of s.references) check(routes.includes(ref), `${s.id}: routed reference ${ref}`);
}
const patterns = [
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /Authorization\s*[:=]\s*["']?Bearer\s+[A-Za-z0-9._-]{15,}/i,
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /https?:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2})(?=[:/\s]|$)/,
  /[A-Z]:\\Users\\[^\\\s]+\\/i
];
for (const file of walk(root).filter(f => !f.includes(path.sep + '.git' + path.sep) && /\.(md|json|ps1|cjs)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8');
  if (file === __filename) continue; // Detector fixtures contain internal-address patterns, never credentials.
  for (const pattern of patterns) check(!pattern.test(text), `Sensitive data pattern in ${path.relative(root, file)}`);
}
console.log(`PASS ${count} structural/privacy checks; ${skills.length} skills, ${routes.length} routes, ${scenarios.length} evaluation cases.`);
console.log('Scenario references verified statically; agent behavior has not been evaluated by this script.');
