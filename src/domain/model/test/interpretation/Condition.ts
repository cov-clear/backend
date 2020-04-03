import { Validators } from '../../../Validators';
import { DomainValidationError } from '../../DomainValidationError';

export interface Condition {
  evaluate(obj: any): boolean;
}

export namespace Condition {
  export function from(ruleSchema: any): Condition {
    if (ruleSchema.and) {
      return AndCondition.from(ruleSchema.and);
    }
    if (ruleSchema.or) {
      return OrCondition.from(ruleSchema.or);
    }
    if (ruleSchema.comparator) {
      return SimpleCondition.from(ruleSchema);
    }
    throw new DomainValidationError('ruleSchema', `${JSON.stringify(ruleSchema)} is not a valid rule`);
  }
}

class OrCondition implements Condition {
  constructor(private rules: Condition[]) {}

  evaluate(obj: object): boolean {
    for (const rule of this.rules) {
      if (rule.evaluate(obj)) {
        return true;
      }
    }
    return false;
  }

  static from(ruleSchema: any) {
    if (!Array.isArray(ruleSchema)) {
      throw new DomainValidationError('ruleSchema', `${JSON.stringify(ruleSchema)} is not a valid OR condition`);
    }
    return new OrCondition(ruleSchema.map(Condition.from));
  }
}

class AndCondition implements Condition {
  constructor(private rules: Condition[]) {}

  evaluate(obj: any): boolean {
    for (const rule of this.rules) {
      if (!rule.evaluate(obj)) {
        return false;
      }
    }
    return true;
  }

  static from(ruleSchema: any) {
    if (!Array.isArray(ruleSchema)) {
      throw new DomainValidationError('ruleSchema', `${JSON.stringify(ruleSchema)} is not a valid AND condition`);
    }
    return new AndCondition(ruleSchema.map(Condition.from));
  }
}

class SimpleCondition implements Condition {
  constructor(
    private property: string,
    private comparator: '==' | '!=' | '>' | '<' | '<=' | '>=',
    private value: string | boolean | number
  ) {
    Validators.validateNotEmpty('simpleCondition.property', property);
    Validators.validateNotEmpty('simpleCondition.comparator', comparator);
    Validators.validateNotNullOrUndefined('simpleCondition.property', value);
  }

  evaluate(obj: any): boolean {
    switch (this.comparator) {
      case '==':
        return obj[this.property] === this.value;
      case '!=':
        return obj[this.property] !== this.value;
      case '>=':
        return obj[this.property] >= this.value;
      case '<=':
        return obj[this.property] <= this.value;
      case '<':
        return obj[this.property] < this.value;
      case '>':
        return obj[this.property] > this.value;
      default:
        throw new DomainValidationError(
          'simpleCondition.comparator',
          `${this.comparator} is not an accepted comparator`
        );
    }
  }

  static from(ruleSchema: any) {
    try {
      return new SimpleCondition(ruleSchema.property, ruleSchema.comparator, ruleSchema.value);
    } catch (error) {
      throw new DomainValidationError('ruleSchema', `${JSON.stringify(ruleSchema)} is not a valid SimpleCondition`);
    }
  }
}
