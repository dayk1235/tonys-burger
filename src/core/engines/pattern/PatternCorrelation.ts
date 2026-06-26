import { ObservationRef, PatternDetectionResult } from "./PatternTypes";
import { CorrelationError } from "./PatternErrors";

export interface CorrelationResult {
  readonly coefficient: number;
  readonly significance: number;
  readonly direction: "POSITIVE" | "NEGATIVE" | "NONE";
  readonly sampleSize: number;
  readonly method: "PEARSON" | "SPEARMAN";
}

export class PatternCorrelation {
  pearson(observationsA: readonly ObservationRef[], observationsB: readonly ObservationRef[]): CorrelationResult {
    const paired = this.alignByTime(observationsA, observationsB);
    if (paired.length < 3) {
      throw new CorrelationError(`Need at least 3 paired observations, got ${paired.length}`);
    }

    const valuesA = paired.map((p) => this.extractNumericValue(p.a));
    const valuesB = paired.map((p) => this.extractNumericValue(p.b));
    const n = valuesA.length;
    const meanA = valuesA.reduce((s, v) => s + v, 0) / n;
    const meanB = valuesB.reduce((s, v) => s + v, 0) / n;

    let covariance = 0;
    let varianceA = 0;
    let varianceB = 0;

    for (let i = 0; i < n; i++) {
      const devA = valuesA[i] - meanA;
      const devB = valuesB[i] - meanB;
      covariance += devA * devB;
      varianceA += devA * devA;
      varianceB += devB * devB;
    }

    if (varianceA === 0 || varianceB === 0) {
      return {
        coefficient: 0,
        significance: 0,
        direction: "NONE",
        sampleSize: n,
        method: "PEARSON",
      };
    }

    const coefficient = covariance / (Math.sqrt(varianceA) * Math.sqrt(varianceB));
    const clampedCoeff = Math.max(-1, Math.min(1, coefficient));
    const tStat = clampedCoeff * Math.sqrt((n - 2) / Math.max(0.0001, 1 - clampedCoeff * clampedCoeff));
    const significance = this.approximatePValue(tStat, n - 2);

    return {
      coefficient: clampedCoeff,
      significance,
      direction: clampedCoeff > 0.3 ? "POSITIVE" : clampedCoeff < -0.3 ? "NEGATIVE" : "NONE",
      sampleSize: n,
      method: "PEARSON",
    };
  }

  detect(
    observations: readonly ObservationRef[],
    minCorrelation = 0.5
  ): PatternDetectionResult[] {
    const results: PatternDetectionResult[] = [];
    const categories = this.groupByCategory(observations);

    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        try {
          const result = this.pearson(categories[i].observations, categories[j].observations);
          if (Math.abs(result.coefficient) >= minCorrelation) {
            results.push({
              detected: true,
              strength: Math.abs(result.coefficient),
              confidence: result.significance,
              novelty: 1 - Math.abs(result.coefficient),
              evidence: [
                ...categories[i].observations.map((o) => o.id),
                ...categories[j].observations.map((o) => o.id),
              ],
              metadata: {
                categoryA: categories[i].category,
                categoryB: categories[j].category,
                coefficient: result.coefficient,
                direction: result.direction,
                method: result.method,
                sampleSize: result.sampleSize,
              },
            });
          }
        } catch {
          // skip pairs that fail correlation
        }
      }
    }

    return results;
  }

  private alignByTime(
    a: readonly ObservationRef[],
    b: readonly ObservationRef[]
  ): Array<{ a: ObservationRef; b: ObservationRef }> {
    const sortedA = [...a].sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());
    const sortedB = [...b].sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());
    const paired: Array<{ a: ObservationRef; b: ObservationRef }> = [];
    const windowMs = 3600000;

    for (const obsA of sortedA) {
      const timeA = new Date(obsA.timestamp).getTime();
      const closest = sortedB.reduce((best, obsB) => {
        const diff = Math.abs(new Date(obsB.timestamp).getTime() - timeA);
        return diff < best.diff ? { obs: obsB, diff } : best;
      }, { obs: sortedB[0], diff: Infinity });

      if (closest.diff <= windowMs) {
        paired.push({ a: obsA, b: closest.obs });
      }
    }

    return paired;
  }

  private extractNumericValue(obs: ObservationRef): number {
    const payload = obs.payload as Record<string, unknown>;
    const numericKeys = Object.entries(payload).filter(
      ([, v]) => typeof v === "number"
    );
    if (numericKeys.length === 0) return 0;
    return numericKeys[0][1] as number;
  }

  private groupByCategory(
    observations: readonly ObservationRef[]
  ): Array<{ category: string; observations: ObservationRef[] }> {
    const groups = new Map<string, ObservationRef[]>();
    for (const obs of observations) {
      const existing = groups.get(obs.category) || [];
      existing.push(obs);
      groups.set(obs.category, existing);
    }
    return Array.from(groups.entries())
      .filter(([, obsList]) => obsList.length >= 3)
      .map(([category, obsList]) => ({ category, observations: obsList }));
  }

  private approximatePValue(tStat: number, df: number): number {
    const absT = Math.abs(tStat);
    if (df <= 0) return 1;
    const x = df / (df + absT * absT);
    const beta = this.regularizedIncompleteBeta(df / 2, 0.5, x);
    return Math.max(0.01, Math.min(0.99, beta));
  }

  private regularizedIncompleteBeta(a: number, b: number, x: number): number {
    if (x === 0 || x === 1) return x;
    const bt = Math.exp(
      this.lgamma(a + b) - this.lgamma(a) - this.lgamma(b) +
      a * Math.log(x) + b * Math.log(1 - x)
    );
    if (x < (a + 1) / (a + b + 2)) {
      return bt * this.contFrac(a, b, x) / a;
    }
    return 1 - bt * this.contFrac(b, a, 1 - x) / b;
  }

  private contFrac(a: number, b: number, x: number): number {
    const maxIter = 100;
    const epsilon = 1e-10;
    let qab = a + b;
    let qap = a + 1;
    let qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let result = d;

    for (let m = 1; m <= maxIter; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      result *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      const delta = d * c;
      result *= delta;
      if (Math.abs(delta - 1) < epsilon) break;
    }

    return result;
  }

  private lgamma(x: number): number {
    const coef = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.1208650973866179e-2, -0.5395239384953e-5,
    ];
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) {
      y += 1;
      ser += coef[j] / y;
    }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
}
