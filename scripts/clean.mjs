import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Windows often returns EPERM on .next/trace while `next dev` is running.
 * Retries help briefly; if it still fails, stop the dev server and run clean again.
 */
async function rmDirRobust(p, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      rmSync(p, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
      return;
    } catch (e) {
      const retryable = e?.code === 'EPERM' || e?.code === 'EBUSY' || e?.code === 'ENOTEMPTY';
      if (retryable && i < attempts - 1) {
        console.warn(
          `Could not remove (folder may be locked): ${p}\n  Attempt ${i + 1}/${attempts}. Stop "npm run dev" if this keeps failing.\n`
        );
        await sleep(350);
        continue;
      }
      throw e;
    }
  }
}

const root = process.cwd();
const dirs = ['.next', join('node_modules', '.cache')];

for (const d of dirs) {
  const p = join(root, d);
  if (existsSync(p)) {
    await rmDirRobust(p);
    console.log('Removed', d);
  }
}
console.log('Clean done. Run npm run dev');
