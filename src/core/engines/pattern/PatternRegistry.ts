import { PatternMemory } from "./PatternMemory";
import { Pattern, PatternStage, PatternCategory, PatternDefinition } from "./PatternTypes";
import { PatternValidator } from "./PatternValidator";

export class PatternRegistry {
  private definitions: Map<string, PatternDefinition> = new Map();
  private memories: PatternMemory = new PatternMemory();
  private validator: PatternValidator = new PatternValidator();

  registerDefinition(def: PatternDefinition): void {
    this.validator.validateDefinition(def);
    this.definitions.set(def.name, def);
  }

  getDefinition(name: string): PatternDefinition | undefined {
    return this.definitions.get(name);
  }

  getDefinitions(): PatternDefinition[] {
    return Array.from(this.definitions.values());
  }

  hasDefinition(name: string): boolean {
    return this.definitions.has(name);
  }

  unregisterDefinition(name: string): boolean {
    return this.definitions.delete(name);
  }

  getPatterns(): PatternMemory {
    return this.memories;
  }

  async storePattern(pattern: Pattern): Promise<void> {
    await this.memories.persist(pattern);
  }

  async getPattern(id: string): Promise<Pattern | undefined> {
    return this.memories.retrieve(id);
  }

  async findPatternsByCategory(category: PatternCategory | string): Promise<Pattern[]> {
    return this.memories.findByCategory(category);
  }

  async findPatternsByStage(stage: PatternStage): Promise<Pattern[]> {
    return this.memories.findByStage(stage);
  }

  async findActivePatterns(): Promise<Pattern[]> {
    return this.memories.findActive();
  }

  async getAllPatterns(): Promise<Pattern[]> {
    return this.memories.getAll();
  }

  definitionCount(): number {
    return this.definitions.size;
  }

  patternCount(): number {
    return this.memories.count();
  }
}
