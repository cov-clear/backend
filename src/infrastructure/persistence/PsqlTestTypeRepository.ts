import knex from 'knex';
import { TestTypeNameAlreadyExists, TestTypeRepository } from '../../domain/model/test/testType/TestTypeRepository';
import { TestType } from '../../domain/model/test/testType/TestType';
import { TestTypeId } from '../../domain/model/test/testType/TestTypeId';
import { InterpretationRules } from '../../domain/model/test/interpretation/InterpretationRules';

const TEST_TYPE_TABLE_NAME = 'test_type';
const TEST_TYPE_COLUMNS = [
  'id',
  'name',
  'results_schema as resultsSchema',
  'needed_permission_to_add_results as neededPermissionToAddResults',
  'results_interpretation_rules as resultsInterpretationRules',
];

export class PsqlTestTypeRepository implements TestTypeRepository {
  constructor(private db: knex) {}

  async save(testType: TestType): Promise<TestType> {
    try {
      return await this.db
        .raw(
          `
        insert into "${TEST_TYPE_TABLE_NAME}" 
            (id, name, results_schema, needed_permission_to_add_results, results_interpretation_rules)
        values
            (:id, :name, :results_schema, :needed_permission_to_add_results, :results_interpretation_rules)
        on conflict (id) do nothing
      `,
          {
            id: testType.id.value,
            name: testType.name,
            results_schema: JSON.stringify(testType.resultsSchema),
            needed_permission_to_add_results: testType.neededPermissionToAddResults,
            results_interpretation_rules: JSON.stringify(testType.interpretationRules.toSchema()),
          }
        )
        .then(() => testType);
    } catch (dbError) {
      if (dbError.constraint === 'test_type_name_unique') {
        throw new TestTypeNameAlreadyExists(testType.name);
      }
      throw dbError;
    }
  }

  async findByPermissions(permissions: string[]): Promise<Array<TestType>> {
    if (permissions.length === 0) {
      return [];
    }

    const testTypeRows: TestTypeRow[] = await this.db(TEST_TYPE_TABLE_NAME)
      .select(TEST_TYPE_COLUMNS)
      .whereIn('needed_permission_to_add_results', permissions);

    return testTypeRows.map(mapTestTypeRowToTestType);
  }

  async findById(testTypeId: TestTypeId) {
    const testTypeRow: any = await this.db(TEST_TYPE_TABLE_NAME)
      .select(TEST_TYPE_COLUMNS)
      .where('id', '=', testTypeId.value)
      .first();

    if (!testTypeRow) {
      return null;
    }

    return mapTestTypeRowToTestType(testTypeRow);
  }

  async findAll(): Promise<Array<TestType>> {
    const testTypeRows: TestTypeRow[] = await this.db(TEST_TYPE_TABLE_NAME).select(TEST_TYPE_COLUMNS);

    return testTypeRows.map(mapTestTypeRowToTestType);
  }
}

function mapTestTypeRowToTestType(row: TestTypeRow): TestType {
  return new TestType(
    new TestTypeId(row.id),
    row.name,
    row.resultsSchema,
    row.neededPermissionToAddResults,
    InterpretationRules.fromSchema(row.resultsInterpretationRules)
  );
}

interface TestTypeRow {
  id: string;
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
  resultsInterpretationRules: object[];
}
