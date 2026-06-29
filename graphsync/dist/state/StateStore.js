import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, } from 'node:fs';
import { resolve } from 'node:path';
export class StateStore {
    baseDir;
    projectDir;
    statePath;
    queuePath;
    lockPath;
    constructor(stateDir, projectName) {
        this.baseDir = resolve(stateDir.replace(/^~/, process.env.HOME || ''));
        this.projectDir = resolve(this.baseDir, 'projects', projectName);
        this.statePath = resolve(this.projectDir, 'state.json');
        this.queuePath = resolve(this.projectDir, 'queue.json');
        this.lockPath = resolve(this.projectDir, 'lock');
    }
    ensureDirectories() {
        if (!existsSync(this.projectDir)) {
            mkdirSync(this.projectDir, { recursive: true });
        }
    }
    loadState() {
        if (!existsSync(this.statePath)) {
            return this.defaultState();
        }
        try {
            const raw = readFileSync(this.statePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch {
            return this.defaultState();
        }
    }
    saveState(state) {
        this.ensureDirectories();
        writeFileSync(this.statePath, JSON.stringify(state, null, 2), 'utf-8');
    }
    loadQueue() {
        if (!existsSync(this.queuePath)) {
            return [];
        }
        try {
            const raw = readFileSync(this.queuePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch {
            return [];
        }
    }
    saveQueue(queue) {
        this.ensureDirectories();
        writeFileSync(this.queuePath, JSON.stringify(queue, null, 2), 'utf-8');
    }
    enqueue(change) {
        const queue = this.loadQueue();
        queue.push(change);
        this.saveQueue(queue);
    }
    dequeue() {
        const queue = this.loadQueue();
        if (queue.length === 0)
            return null;
        const change = queue.shift();
        this.saveQueue(queue);
        return change;
    }
    acquireLock() {
        if (existsSync(this.lockPath)) {
            const pid = parseInt(readFileSync(this.lockPath, 'utf-8').trim(), 10);
            if (!isNaN(pid)) {
                try {
                    process.kill(pid, 0);
                    return false;
                }
                catch {
                    /* stale lock — clean it */
                }
            }
        }
        this.ensureDirectories();
        writeFileSync(this.lockPath, String(process.pid), 'utf-8');
        return true;
    }
    releaseLock() {
        try {
            if (existsSync(this.lockPath)) {
                unlinkSync(this.lockPath);
            }
        }
        catch {
            /* best effort */
        }
    }
    getProjectDir() {
        return this.projectDir;
    }
    defaultState() {
        return {
            version: 1,
            status: 'idle',
            provider: 'unknown',
            lastIndexedAt: null,
            lastCommit: null,
            lastMode: null,
            pendingChanges: 0,
            knowledgeSources: {},
        };
    }
}
//# sourceMappingURL=StateStore.js.map