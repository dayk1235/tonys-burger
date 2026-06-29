import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { getLogger } from '../logger/logger.js';
export class MCPIndexProvider {
    binaryPath;
    timeoutMs;
    name = 'codebase-memory-mcp';
    requestId = 0;
    constructor(binaryPath, timeoutMs) {
        this.binaryPath = binaryPath;
        this.timeoutMs = timeoutMs;
    }
    async index(options) {
        const start = Date.now();
        const log = getLogger();
        try {
            await this.callTool('index_repository', {
                repo_path: resolve(options.repoPath),
                mode: options.mode,
            });
            return {
                success: true,
                durationMs: Date.now() - start,
                mode: options.mode,
            };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            log.error({ error: message, mode: options.mode }, 'index failed');
            return {
                success: false,
                durationMs: Date.now() - start,
                error: message,
                mode: options.mode,
            };
        }
    }
    async health() {
        const log = getLogger();
        const resolved = resolve(this.binaryPath.replace(/^~/, process.env.HOME || ''));
        try {
            const initResult = await this.handshake();
            return {
                available: true,
                version: initResult.serverInfo?.version ?? 'unknown',
                lastContact: new Date(),
            };
        }
        catch (err) {
            log.warn({ error: err instanceof Error ? err.message : String(err) }, 'provider health check failed');
            return {
                available: false,
                error: err instanceof Error ? err.message : `Binary not found or not executable: ${resolved}`,
            };
        }
    }
    async handshake() {
        const result = await this.sendRequest('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'graphsync', version: '1.0.0' },
        });
        return result;
    }
    async callTool(name, args) {
        const result = await this.sendRequest('tools/call', {
            name,
            arguments: args,
        });
        return result;
    }
    async sendRequest(method, params) {
        const resolved = resolve(this.binaryPath.replace(/^~/, process.env.HOME || ''));
        return new Promise((resolvePromise, reject) => {
            let proc;
            try {
                proc = spawn(resolved, [], {
                    stdio: ['pipe', 'pipe', 'pipe'],
                });
            }
            catch (err) {
                return reject(new Error(`Failed to spawn ${resolved}: ${err}`));
            }
            const timer = setTimeout(() => {
                proc.kill();
                reject(new Error(`Request timed out after ${this.timeoutMs}ms`));
            }, this.timeoutMs);
            const rl = createInterface({ input: proc.stdout });
            let responseReceived = false;
            rl.on('line', (line) => {
                try {
                    const msg = JSON.parse(line);
                    if (msg.id === 1 && msg.method === undefined) {
                        if (msg.error) {
                            reject(new Error(`Initialize error: ${msg.error.message}`));
                        }
                        else {
                            proc.stdin.write(JSON.stringify({
                                jsonrpc: '2.0',
                                id: this.requestId++,
                                method,
                                params,
                            }) + '\n');
                        }
                        return;
                    }
                    if (msg.id === this.requestId - 1 || msg.id > 0) {
                        clearTimeout(timer);
                        responseReceived = true;
                        rl.close();
                        proc.stdin.end();
                        if (msg.error) {
                            reject(new Error(`RPC error: ${msg.error.message}`));
                        }
                        else {
                            resolvePromise(msg.result);
                        }
                    }
                }
                catch {
                    /* skip malformed lines */
                }
            });
            proc.on('error', (err) => {
                clearTimeout(timer);
                if (!responseReceived)
                    reject(new Error(`Process error: ${err.message}`));
            });
            proc.on('exit', (code) => {
                clearTimeout(timer);
                if (!responseReceived) {
                    reject(new Error(`Process exited with code ${code} before response`));
                }
            });
            proc.stdin.write(JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'graphsync', version: '1.0.0' },
                },
            }) + '\n');
        });
    }
}
//# sourceMappingURL=MCPIndexProvider.js.map