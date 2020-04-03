import { Results } from '../Results';
import { Interpretation, InterpretationTheme } from './Interpretation';
import { Validators } from '../../../Validators';

export class OutputPattern {
  private propertyVariables: Map<string, string>;

  constructor(private namePattern: string, private theme: InterpretationTheme, propertyVariables: Map<string, object>) {
    Validators.validateNotEmpty('namePattern', namePattern);
    Validators.validateNotEmpty('theme', theme);
    this.propertyVariables = propertyVariables ? new Map(Object.entries(propertyVariables)) : new Map();
  }

  evaluate(results: Results): Interpretation {
    return new Interpretation(this.namePattern, this.theme, this.getVariables(results));
  }

  getVariables(results: Results): Map<string, string> {
    const variables = new Map();
    this.propertyVariables.forEach((propertyName, variableName) => {
      const resultDetails = results.details as any;
      variables.set(variableName, resultDetails[propertyName]);
    });
    return variables;
  }

  static from(outputSchema: any) {
    return new OutputPattern(outputSchema.namePattern, outputSchema.theme, outputSchema.propertyVariables);
  }
}
