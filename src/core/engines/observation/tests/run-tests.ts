/**
 * @file run-tests.ts
 * @description Coordinates and triggers all unit/integration tests for the Observation Engine.
 */

// Import all test files to register them under Node's native test runner
import "./lifecycle.test";
import "./validation.test";
import "./quality.test";
import "./failure.test";
import "./recovery.test";
import "./integration.test";
