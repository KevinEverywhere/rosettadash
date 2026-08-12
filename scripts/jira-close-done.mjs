#!/usr/bin/env node
/**
 * Transition completed DAS tickets to Done.
 * Reads JIRA_* from ~/.cursor/mcp.json (jira server env) or process.env.
 * Usage: node scripts/jira-close-done.mjs [DAS-91 DAS-92 ...]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function loadEnv() {
  if (process.env.JIRA_API_KEY && process.env.JIRA_API_MAIL) {
    return {
      JIRA_URL: process.env.JIRA_URL || 'https://planetkevin.atlassian.net',
      JIRA_API_MAIL: process.env.JIRA_API_MAIL,
      JIRA_API_KEY: process.env.JIRA_API_KEY,
    };
  }
  const cfgPath = path.join(os.homedir(), '.cursor/mcp.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  return cfg.mcpServers?.jira?.env ?? {};
}

const env = loadEnv();
const base = env.JIRA_URL;
const auth = Buffer.from(`${env.JIRA_API_MAIL}:${env.JIRA_API_KEY}`).toString('base64');
const headers = {
  Authorization: `Basic ${auth}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function jira(apiPath, opts = {}) {
  const res = await fetch(`${base}${apiPath}`, {
    ...opts,
    headers: { ...headers, ...opts.headers },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${opts.method || 'GET'} ${apiPath} → ${res.status}`);
  }
  return body;
}

async function closeIssue(key) {
  const issue = await jira(`/rest/api/3/issue/${key}?fields=status,summary`);
  const status = issue.fields.status.name;
  const cat = issue.fields.status.statusCategory?.name;
  if (cat === 'Done' || /done|closed|complete/i.test(status)) {
    return { key, status, action: 'already_done' };
  }
  const trans = await jira(`/rest/api/3/issue/${key}/transitions`);
  const done = trans.transitions.find(
    (t) =>
      /done|complete|closed|resolve/i.test(t.name) ||
      /done/i.test(t.to?.name ?? ''),
  );
  if (!done) {
    return {
      key,
      status,
      action: 'no_done_transition',
      transitions: trans.transitions.map((t) => t.name),
    };
  }
  await jira(`/rest/api/3/issue/${key}/transitions`, {
    method: 'POST',
    body: JSON.stringify({ transition: { id: done.id } }),
  });
  return { key, status, action: 'closed', to: done.name };
}

const defaultKeys = [
  'DAS-83',
  'DAS-90',
  'DAS-91',
  'DAS-92',
  'DAS-94',
  'DAS-98',
  'DAS-99',
];
const keys = process.argv.slice(2).length ? process.argv.slice(2) : defaultKeys;

const results = [];
for (const key of keys) {
  try {
    results.push(await closeIssue(key));
  } catch (e) {
    results.push({ key, action: 'error', error: e.message });
  }
}
console.log(JSON.stringify(results, null, 2));
