import { ConfidenceLevel } from "./ReasoningTypes";

export type QuestionType =
  | "WHY"
  | "HOW"
  | "WHAT_IF"
  | "SHOULD_INVESTIGATE"
  | "EXPLAIN"
  | "COMPARE"
  | "DIAGNOSE"
  | "EVALUATE"
  | "EXPLORE"
  | "VALIDATE";

export interface ReasoningQuestion {
  readonly id: string;
  readonly type: QuestionType;
  readonly text: string;
  readonly intent: string;
  readonly knownFacts: readonly string[];
  readonly unknownFacts: readonly string[];
  readonly assumptions: readonly string[];
  readonly desiredConfidenceLevel: ConfidenceLevel;
  readonly scope: string;
  readonly constraints: readonly string[];
  readonly expectedOutput: string;
  readonly priority: number;
  readonly createdAt: string;
}

export class ReasoningQuestionFactory {
  private static counter = 0;

  createQuestion(
    type: QuestionType,
    text: string,
    intent: string,
    scope: string,
    expectedOutput: string,
    priority: number,
    overrides?: Partial<Omit<ReasoningQuestion, "id" | "type" | "text" | "intent" | "scope" | "expectedOutput" | "priority" | "createdAt">>
  ): ReasoningQuestion {
    const now = new Date().toISOString();
    return {
      id: `qst_${Date.now()}_${++ReasoningQuestionFactory.counter}`,
      type,
      text,
      intent,
      knownFacts: overrides?.knownFacts ?? [],
      unknownFacts: overrides?.unknownFacts ?? [],
      assumptions: overrides?.assumptions ?? [],
      desiredConfidenceLevel: overrides?.desiredConfidenceLevel ?? "HIGH",
      scope,
      constraints: overrides?.constraints ?? [],
      expectedOutput,
      priority: Math.max(0, Math.min(1, priority)),
      createdAt: now,
    };
  }

  inferQuestionType(text: string, intent: string): QuestionType {
    const lower = `${text} ${intent}`.toLowerCase();

    if (lower.includes("why") || lower.includes("cause") || lower.includes("root")) return "DIAGNOSE";
    if (lower.includes("how") && (lower.includes("improve") || lower.includes("optimize"))) return "EVALUATE";
    if (lower.includes("what if") || lower.includes("what would")) return "WHAT_IF";
    if (lower.includes("should")) return "SHOULD_INVESTIGATE";
    if (lower.includes("explain") || lower.includes("clarify")) return "EXPLAIN";
    if (lower.includes("compare") || lower.includes("versus") || lower.includes("vs")) return "COMPARE";
    if (lower.includes("diagnose") || lower.includes("problem")) return "DIAGNOSE";
    if (lower.includes("evaluate") || lower.includes("assess")) return "EVALUATE";
    if (lower.includes("explore") || lower.includes("investigate")) return "EXPLORE";
    if (lower.includes("validate") || lower.includes("verify")) return "VALIDATE";
    if (lower.includes("how")) return "HOW";

    return "EXPLAIN";
  }
}
