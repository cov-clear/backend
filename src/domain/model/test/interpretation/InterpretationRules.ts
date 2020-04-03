import { Results } from '../Results';
import { Condition } from './Condition';
import { OutputPattern } from './Output';
import { Interpretation } from './Interpretation';
import { DomainValidationError } from '../../DomainValidationError';
import { Validators } from '../../../Validators';

export class InterpretationRules {
  constructor(private rules: InterpretationRule[]) {}

  interpret(results: Results): Array<Interpretation> {
    return this.rules
      .map((rule) => rule.interpret(results))
      .filter((interpretation) => interpretation !== null) as Interpretation[];
  }

  static from(interpretationRulesSchema: Array<any>) {
    if (!Array.isArray(interpretationRulesSchema)) {
      throw new DomainValidationError('interpretationRules', 'InterpretationRules must be an array');
    }
    return new InterpretationRules(interpretationRulesSchema.map(InterpretationRule.from));
  }
}

class InterpretationRule {
  constructor(private output: OutputPattern, private condition: Condition) {}

  interpret(results: Results): Interpretation | null {
    if (this.condition.evaluate(results.details)) {
      return this.output.evaluate(results);
    }
    return null;
  }

  static from(interpretationRuleSchema: any) {
    Validators.validateNotNullOrUndefined(
      interpretationRuleSchema.output,
      `${JSON.stringify(interpretationRuleSchema)} is not a valid interpretation rule schema`
    );
    Validators.validateNotNullOrUndefined(
      interpretationRuleSchema.condition,
      `${JSON.stringify(interpretationRuleSchema)} is not a valid interpretation rule schema`
    );
    return new InterpretationRule(
      OutputPattern.from(interpretationRuleSchema.output),
      Condition.from(interpretationRuleSchema.condition)
    );
  }
}
