import { Reasoning } from "./ReasoningTypes";

export type GapType =
  | "OBSERVATION"
  | "EVIDENCE"
  | "KNOWLEDGE"
  | "BUSINESS_CONTEXT"
  | "TEMPORAL_CONTEXT"
  | "HUMAN_INPUT"
  | "ENVIRONMENTAL";

export type GapStatus = "KNOWN" | "UNKNOWN" | "NEEDED" | "UNAVAILABLE";

export interface InformationGapEntry {
  readonly type: GapType;
  readonly description: string;
  readonly status: GapStatus;
  readonly estimatedImpact: number;
  readonly canBeResolved: boolean;
}

export interface InformationGapResult {
  readonly gaps: readonly InformationGapEntry[];
  readonly totalGaps: number;
  readonly resolvableGaps: number;
  readonly unresolvableGaps: number;
  readonly overallImpact: number;
  readonly criticalGaps: readonly InformationGapEntry[];
}

export class ReasoningInformationGap {
  analyze(reasoning: Reasoning): InformationGapResult {
    const gaps: InformationGapEntry[] = [];
    const question = reasoning.question;
    const context = reasoning.context;

    if (question.unknownFacts.length > 0) {
      for (const unknown of question.unknownFacts) {
        gaps.push({
          type: "EVIDENCE",
          description: unknown,
          status: "UNKNOWN",
          estimatedImpact: 0.4,
          canBeResolved: true,
        });
      }
    }

    const observationCount = reasoning.provenance.sourceObservationIds.length;
    if (observationCount === 0) {
      gaps.push({
        type: "OBSERVATION",
        description: "No observations linked to this reasoning case",
        status: "NEEDED",
        estimatedImpact: 0.6,
        canBeResolved: true,
      });
    } else if (observationCount < 3) {
      gaps.push({
        type: "OBSERVATION",
        description: `Only ${observationCount} observations — more would strengthen analysis`,
        status: "KNOWN",
        estimatedImpact: 0.2,
        canBeResolved: true,
      });
    }

    const knowledgeCount = reasoning.provenance.sourceKnowledgeIds.length;
    if (knowledgeCount === 0) {
      gaps.push({
        type: "KNOWLEDGE",
        description: "No knowledge sources referenced",
        status: "NEEDED",
        estimatedImpact: 0.5,
        canBeResolved: true,
      });
    } else if (knowledgeCount < 2) {
      gaps.push({
        type: "KNOWLEDGE",
        description: `Only ${knowledgeCount} knowledge source — broader knowledge would improve confidence`,
        status: "KNOWN",
        estimatedImpact: 0.2,
        canBeResolved: true,
      });
    }

    const memoryCount = reasoning.provenance.sourceMemoryIds.length;
    if (memoryCount === 0) {
      gaps.push({
        type: "EVIDENCE",
        description: "No memory references — historical patterns unavailable",
        status: "UNAVAILABLE",
        estimatedImpact: 0.3,
        canBeResolved: false,
      });
    }

    if (context.environment === "unknown" || !context.environment) {
      gaps.push({
        type: "BUSINESS_CONTEXT",
        description: "Business environment not identified",
        status: "UNKNOWN",
        estimatedImpact: 0.3,
        canBeResolved: true,
      });
    }

    if (context.temporalContext === "normal" && reasoning.type === "DIAGNOSTIC") {
      gaps.push({
        type: "TEMPORAL_CONTEXT",
        description: "Temporal pattern not analyzed — timing may reveal root causes",
        status: "NEEDED",
        estimatedImpact: 0.15,
        canBeResolved: true,
      });
    }

    if (context.ownerConcerns.length === 0) {
      gaps.push({
        type: "HUMAN_INPUT",
        description: "No owner concerns captured",
        status: "UNKNOWN",
        estimatedImpact: 0.2,
        canBeResolved: true,
      });
    }

    const resolvableGaps = gaps.filter((g) => g.canBeResolved).length;
    const unresolvableGaps = gaps.filter((g) => !g.canBeResolved).length;
    const overallImpact = gaps.length > 0
      ? Math.min(1, gaps.reduce((s, g) => s + g.estimatedImpact, 0) / Math.max(1, gaps.length) * (gaps.length / 5))
      : 0;
    const criticalGaps = gaps.filter((g) => g.estimatedImpact >= 0.5);

    return {
      gaps,
      totalGaps: gaps.length,
      resolvableGaps,
      unresolvableGaps,
      overallImpact,
      criticalGaps,
    };
  }
}
