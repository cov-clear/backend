import { Results } from '../Results';
import { Interpretation, InterpretationTheme } from './Interpretation';
import { Validators } from '../../../Validators';

export class OutputPattern {
  constructor(private namePattern: string, private theme: InterpretationTheme, private propertyVariables: object) {
    Validators.validateNotEmpty('namePattern', namePattern);
    Validators.validateNotEmpty('theme', theme);
    Validators.validateNotNullOrUndefined('propertyVariables', propertyVariables);
  }

  evaluate(results: Results): Interpretation {
    return new Interpretation(this.namePattern, this.theme, this.getVariables(results));
  }

  toSchema() {
    return {
      namePattern: this.namePattern,
      theme: this.theme,
      propertyVariables: this.propertyVariables,
    };
  }

  private getVariables(results: Results): Map<string, string> {
    const variables = new Map();
    Object.entries(this.propertyVariables).forEach(([variableName, propertyName]) => {
      const resultDetails = results.details as any;
      variables.set(variableName, resultDetails[propertyName]);
    });
    return variables;
  }

  static fromSchema(outputSchema: any) {
    return new OutputPattern(outputSchema.namePattern, outputSchema.theme, outputSchema.propertyVariables || {});
  }
}
