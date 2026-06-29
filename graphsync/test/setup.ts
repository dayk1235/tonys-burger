import { createLogger, resetLogger } from '../src/logger/logger.js';

beforeAll(() => {
  createLogger({ level: 'silent' });
});

afterAll(() => {
  resetLogger();
});
