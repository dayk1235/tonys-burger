export interface CanonicalEvent {
  readonly entity: Record<string, unknown>;
  readonly operation: string;
  readonly timestamp: string;
  readonly version: number;
}

export function createCanonicalEvent(
  entity: Record<string, unknown>,
  operation: string,
  timestamp: string,
  version: number,
): CanonicalEvent {
  return { entity, operation, timestamp, version };
}
