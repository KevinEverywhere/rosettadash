#!/usr/bin/env node
/**
 * Fail fast when Playwright e2e ports (:3001 / :4201) are still held by a prior run.
 */
import { execSync } from 'node:child_process';

const E2E_PORTS = [3001, 4201];

function pidsOnPort(port) {
  try {
    return execSync(`lsof -ti :${port}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

const blocked = E2E_PORTS.flatMap((port) =>
  pidsOnPort(port).map((pid) => ({ port, pid })),
);

if (blocked.length === 0) {
  process.exit(0);
}

const byPort = new Map();
for (const { port, pid } of blocked) {
  const list = byPort.get(port) ?? [];
  list.push(pid);
  byPort.set(port, list);
}

console.error('E2E cannot start — required ports are already in use:\n');
for (const [port, pids] of byPort.entries()) {
  console.error(`  :${port}  PID ${pids.join(', ')}`);
}
console.error('\nStop the stale process(es), then re-run e2e:');
console.error(`  kill ${[...new Set(blocked.map((entry) => entry.pid))].join(' ')}`);
console.error('\nOr force-kill if needed:');
console.error(`  kill -9 ${[...new Set(blocked.map((entry) => entry.pid))].join(' ')}`);
console.error('\nThen: npm run verify:all');
process.exit(1);
