import { Validators } from '../../../Validators';
import { DomainValidationError } from '../../DomainValidationError';

export interface Condition {
  evaluate(obj: any): boolean;
}

export namespace Condition {
  export function from(conditionSchema: any): Condition {
    if (conditionSchema.and) {
      return AndCondition.from(conditionSchema.and);
    }
    if (conditionSchema.or) {
      return OrCondition.from(conditionSchema.or);
    }
    if (conditionSchema.comparator) {
      return SimpleCondition.from(conditionSchema);
    }
    throw new DomainValidationError('conditionSchema', `${JSON.stringify(conditionSchema)} is not a valid condition`);
  }
}

class OrCondition implements Condition {
  constructor(private conditions: Condition[]) {}

  evaluate(obj: object): boolean {
    for (const condition of this.conditions) {
      if (condition.evaluate(obj)) {
        return true;
      }
    }
    return false;
  }

  static from(conditionSchema: any) {
    if (!Array.isArray(conditionSchema)) {
      throw new DomainValidationError(
        'conditionSchema',
        `${JSON.stringify(conditionSchema)} is not a valid OR condition`
      );
    }
    return new OrCondition(conditionSchema.map(Condition.from));
  }
}

class AndCondition implements Condition {
  constructor(private conditions: Condition[]) {}

  evaluate(obj: any): boolean {
    for (const condition of this.conditions) {
      if (!condition.evaluate(obj)) {
        return false;
      }
    }
    return true;
  }

  static from(conditionSchema: any) {
    if (!Array.isArray(conditionSchema)) {
      throw new DomainValidationError(
        'conditionSchema',
        `${JSON.stringify(conditionSchema)} is not a valid AND condition`
      );
    }
    return new AndCondition(conditionSchema.map(Condition.from));
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

  static from(conditionSchema: any) {
    try {
      return new SimpleCondition(conditionSchema.property, conditionSchema.comparator, conditionSchema.value);
    } catch (error) {
      throw new DomainValidationError(
        'conditionSchema',
        `${JSON.stringify(conditionSchema)} is not a valid SimpleCondition`
      );
    }
  }
}
