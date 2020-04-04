import { Validators } from '../../../Validators';

export class Condition {
  constructor(private schema: object) {
    Validators.validateSchema('schema', schema);
  }

  evaluate(obj: any): boolean {
    return Validators.isValidJson(obj, this.schema);
  }

  toSchema(): object {
    return this.schema;
  }

  static fromSchema(jsonSchema: object) {
    return new Condition(jsonSchema);
  }
}
