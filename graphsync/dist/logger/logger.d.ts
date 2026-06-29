import pino from 'pino';
export declare function createLogger(options?: {
    level?: string;
    logDir?: string;
    project?: string;
    pretty?: boolean;
}): pino.Logger;
export declare function getLogger(): pino.Logger;
export declare function resetLogger(): void;
//# sourceMappingURL=logger.d.ts.map