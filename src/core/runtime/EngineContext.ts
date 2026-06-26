import { RuntimeClock } from "./RuntimeClock";
import { EventBus } from "./EventBus";
import { ContextBusImpl } from "./ContextBus";
import { WorkingMemory } from "./WorkingMemory";
import { EngineRegistry } from "./EngineRegistry";
import { RegisteredEngine } from "./EngineRegistry";

export class EngineExecutionContext {
  constructor(
    public readonly engineName: string,
    public readonly clock: RuntimeClock,
    public readonly eventBus: EventBus,
    public readonly contextBus: ContextBusImpl,
    public readonly workingMemory: WorkingMemory,
    public readonly registry: EngineRegistry,
    public readonly dependencies: Map<string, RegisteredEngine> = new Map()
  ) {}

  getDependency(name: string): RegisteredEngine | undefined {
    return this.dependencies.get(name);
  }

  hasDependency(name: string): boolean {
    return this.dependencies.has(name);
  }
}
