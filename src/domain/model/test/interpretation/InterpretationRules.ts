import { Results } from '../Results';
import { Condition } from './Condition';
import { OutputPattern } from './Output';
import { Interpretation } from './Interpretation';
import { DomainValidationError } from '../../DomainValidationError';
import { Validators } from '../../../Validators';

export class InterpretationRules {
  constructor(readonly rules: InterpretationRule[]) {}

  interpret(results: Results): Array<Interpretation> {
    return this.rules.filter((rule) => rule.matches(results)).map((rule) => rule.interpret(results));
  }

  toSchema() {
    return this.rules.map((rule) => rule.toSchema());
  }

  static fromSchema(interpretationRulesSchema: Array<any>) {
    if (!Array.isArray(interpretationRulesSchema)) {
      throw new DomainValidationError('interpretationRules', 'InterpretationRules must be an array');
    }
    return new InterpretationRules(interpretationRulesSchema.map(InterpretationRule.fromSchema));
  }
}

class InterpretationRule {
  constructor(private output: OutputPattern, private condition: Condition) {}

  interpret(results: Results): Interpretation {
    return this.output.evaluate(results);
  }

  matches(results: Results): boolean {
    return this.condition.evaluate(results.details);
  }

  toSchema() {
    return {
      output: this.output.toSchema(),
      condition: this.condition.toSchema(),
    };
  }

  static fromSchema(interpretationRuleSchema: any) {
    Validators.validateNotNullOrUndefined('interpretationRule.output', interpretationRuleSchema.output);
    Validators.validateNotNullOrUndefined('interpretationRule.condition', interpretationRuleSchema.condition);

    return new InterpretationRule(
      OutputPattern.fromSchema(interpretationRuleSchema.output),
      Condition.fromSchema(interpretationRuleSchema.condition)
    );
  }
}
