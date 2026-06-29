import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventBus } from '../src/bus/EventBus.js';
import { Debouncer } from '../src/policy/Debouncer.js';
import { GraphSyncEvent } from '../src/bus/events.js';
import type { BatchReadyPayload } from '../src/bus/events.js';

describe('Debouncer', () => {
  let bus: EventBus;
  let debouncer: Debouncer;

  beforeEach(() => {
    vi.useFakeTimers();
    bus = new EventBus();
    debouncer = new Debouncer(bus, 2000);
  });

  afterEach(() => {
    debouncer.stop();
    vi.useRealTimers();
  });

  it('emits BatchReady after delay', () => {
    const handler = vi.fn();
    bus.on(GraphSyncEvent.BatchReady, handler);

    debouncer.add(
      { path: 'test.md', type: 'change', timestamp: new Date() },
      'docs',
    );

    expect(handler).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(handler).toHaveBeenCalledTimes(1);

    const payload = handler.mock.calls[0][0] as BatchReadyPayload;
    expect(payload.source).toBe('docs');
    expect(payload.changes).toHaveLength(1);
  });

  it('resets timer on new events', () => {
    const handler = vi.fn();
    bus.on(GraphSyncEvent.BatchReady, handler);

    debouncer.add(
      { path: 'a.md', type: 'change', timestamp: new Date() },
      'docs',
    );

    vi.advanceTimersByTime(1000);

    debouncer.add(
      { path: 'b.md', type: 'change', timestamp: new Date() },
      'docs',
    );

    vi.advanceTimersByTime(1000);
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0][0] as BatchReadyPayload).changes).toHaveLength(2);
  });

  it('can flush immediately', () => {
    const handler = vi.fn();
    bus.on(GraphSyncEvent.BatchReady, handler);

    debouncer.add(
      { path: 'test.md', type: 'change', timestamp: new Date() },
      'docs',
    );

    debouncer.flush();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('can clear pending events', () => {
    const handler = vi.fn();
    bus.on(GraphSyncEvent.BatchReady, handler);

    debouncer.add(
      { path: 'test.md', type: 'change', timestamp: new Date() },
      'docs',
    );

    debouncer.clear();
    vi.advanceTimersByTime(2000);
    expect(handler).not.toHaveBeenCalled();
  });
});
