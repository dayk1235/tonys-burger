import { Reasoning, ReasoningInput, QuestionType, ConfidenceLevel } from "./ReasoningTypes";
import { ReasoningValidationError, ReasoningBoundaryError } from "./ReasoningErrors";

export class ReasoningValidator {
  private decisionIndicators = [
    "decide", "execute", "do it", "take action", "implement",
    "commit", "approve", "authorize", "proceed",
  ];

  private predictionIndicators = [
    "predict", "forecast", "will happen", "future state",
    "what will", "going to happen",
  ];

  validateInput(input: ReasoningInput): void {
    if (!input.attentionId || input.attentionId.trim().length === 0) {
      throw new ReasoningValidationError("attentionId is required");
    }
    if (!input.name || input.name.trim().length === 0) {
      throw new ReasoningValidationError("name is required");
    }
    if (!input.questionText || input.questionText.trim().length === 0) {
      throw new ReasoningValidationError("questionText is required — reasoning without a question is wandering");
    }
    if (!input.questionType || !this.isValidQuestionType(input.questionType)) {
      throw new ReasoningValidationError(`questionType must be a valid QuestionType, got "${input.questionType}"`);
    }
    if (!input.intent || input.intent.trim().length === 0) {
      throw new ReasoningValidationError("intent is required");
    }
    if (!input.businessId || input.businessId.trim().length === 0) {
      throw new ReasoningValidationError("businessId is required");
    }

    const lowerQuestion = input.questionText.toLowerCase();
    const lowerIntent = input.intent.toLowerCase();

    for (const indicator of this.decisionIndicators) {
      if (lowerQuestion.includes(indicator) || lowerIntent.includes(indicator)) {
        throw new ReasoningBoundaryError(
          `Input contains decision indicator "${indicator}". Reasoning analyzes — it does not decide.`
        );
      }
    }

    for (const indicator of this.predictionIndicators) {
      if (lowerQuestion.includes(indicator) || lowerIntent.includes(indicator)) {
        throw new ReasoningBoundaryError(
          `Input contains prediction indicator "${indicator}". Reasoning analyzes — it does not predict.`
        );
      }
    }
  }

  validateReasoning(reasoning: Reasoning): void {
    if (!reasoning.id) {
      throw new ReasoningValidationError("reasoning id is required");
    }
    if (reasoning.confidence < 0 || reasoning.confidence > 1) {
      throw new ReasoningValidationError("confidence must be in [0, 1]");
    }
    if (!reasoning.identity.attentionId) {
      throw new ReasoningValidationError("reasoning must trace to an attention source");
    }
    if (!reasoning.question || !reasoning.question.type) {
      throw new ReasoningValidationError("reasoning must have a question with a valid type");
    }
    if (!reasoning.question.text || reasoning.question.text.trim().length === 0) {
      throw new ReasoningValidationError("reasoning question text is empty");
    }
    if (!this.isValidConfidenceLevel(reasoning.question.desiredConfidenceLevel)) {
      throw new ReasoningValidationError(`invalid desiredConfidenceLevel: "${reasoning.question.desiredConfidenceLevel}"`);
    }
  }

  validateBoundary(reasoning: Reasoning): void {
    const lastTreeSteps = reasoning.tree.slice(-3);
    for (const step of lastTreeSteps) {
      if (step.stepType === "DECISION" || step.stepType === "EXECUTION") {
        throw new ReasoningBoundaryError(
          `Reasoning tree contains forbidden step type "${step.stepType}"`
        );
      }
    }
  }

  private isValidQuestionType(t: string): t is QuestionType {
    const valid: readonly QuestionType[] = [
      "WHY", "HOW", "WHAT_IF", "SHOULD_INVESTIGATE", "EXPLAIN",
      "COMPARE", "DIAGNOSE", "EVALUATE", "EXPLORE", "VALIDATE",
    ];
    return (valid as readonly string[]).includes(t);
  }

  private isValidConfidenceLevel(c: string): c is ConfidenceLevel {
    const valid: readonly ConfidenceLevel[] = [
      "VERY_LOW", "LOW", "MODERATE", "HIGH", "VERY_HIGH",
    ];
    return (valid as readonly string[]).includes(c);
  }
}
