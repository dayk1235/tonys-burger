import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pc from 'picocolors';

export async function stopCommand(): Promise<void> {
  const stateDir = resolve(
    (process.env.HOME || '~').replace(/^~/, process.env.HOME || ''),
    '.graphsync',
  );

  const projectsDir = resolve(stateDir, 'projects');
  const { readdirSync } = await import('node:fs');
  let found = false;

  if (existsSync(projectsDir)) {
    const projects = readdirSync(projectsDir);
    for (const project of projects) {
      const lockPath = resolve(projectsDir, project, 'lock');
      if (existsSync(lockPath)) {
        try {
          const pid = parseInt(readFileSync(lockPath, 'utf-8').trim(), 10);
          if (!isNaN(pid)) {
            try {
              process.kill(pid, 'SIGTERM');
              console.log(pc.green(`  ✓ Sent stop signal to GraphSync (PID ${pid}) for '${project}'`));
              found = true;
            } catch {
              console.log(pc.yellow(`  ! Stale lock for '${project}' (PID ${pid} not found), cleaning up`));
            }
          }
        } catch {
          /* skip unreadable locks */
        }
      }
    }
  }

  if (!found) {
    console.log(pc.yellow('  ! No running GraphSync instance found'));
  }
}
