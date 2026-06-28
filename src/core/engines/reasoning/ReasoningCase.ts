import { Reasoning, ReasoningStage } from "./ReasoningTypes";
import { ReasoningWorkspace, ReasoningWorkspaceData } from "./ReasoningWorkspace";
import { ReasoningFactory } from "./ReasoningFactory";
import { ReasoningLifecycle } from "./ReasoningLifecycle";

export class ReasoningCase {
  private workspace: ReasoningWorkspace;
  private factory: ReasoningFactory;
  private lifecycle: ReasoningLifecycle;

  constructor() {
    this.workspace = new ReasoningWorkspace();
    this.factory = new ReasoningFactory();
    this.lifecycle = new ReasoningLifecycle();
  }

  getWorkspace(): ReasoningWorkspace {
    return this.workspace;
  }

  getFactory(): ReasoningFactory {
    return this.factory;
  }

  getLifecycle(): ReasoningLifecycle {
    return this.lifecycle;
  }

  getData(reasoningId: string): ReasoningWorkspaceData | undefined {
    return this.workspace.get(reasoningId);
  }

  transitionTo(reasoning: Reasoning, target: ReasoningStage, updates?: Record<string, unknown>): Reasoning {
    this.lifecycle.validateTransition(reasoning.stage, target);
    return this.factory.cloneWithTransition(reasoning, target, updates as Parameters<ReasoningFactory["cloneWithTransition"]>[2]);
  }
}
