import knex from 'knex';
import { TestTypeNameAlreadyExists, TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';

const TEST_TYPE_TABLE_NAME = 'test_type';
const TEST_TYPE_COLUMNS = [
  'id',
  'name',
  'results_schema as resultsSchema',
  'needed_permission_to_add_results as neededPermissionToAddResults',
];

export class PsqlTestTypeRepository implements TestTypeRepository {
  constructor(private db: knex) {}

  async save(testType: TestType): Promise<TestType> {
    try {
      return await this.db
        .raw(
          `
        insert into "${TEST_TYPE_TABLE_NAME}" (id, name, results_schema, needed_permission_to_add_results)
        values (:id, :name, :results_schema, :needed_permission_to_add_results)
        on conflict (id) do nothing
      `,
          {
            id: testType.id.value,
            name: testType.name,
            results_schema: JSON.stringify(testType.resultsSchema),
            needed_permission_to_add_results: testType.neededPermissionToAddResults,
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
    const linkRow: any = await this.db(TEST_TYPE_TABLE_NAME)
      .where('id', '=', testTypeId.value)
      .select(TEST_TYPE_COLUMNS)
      .first();

    if (!linkRow) {
      return null;
    }

    return new TestType(
      new TestTypeId(linkRow.id),
      linkRow.name,
      linkRow.resultsSchema,
      linkRow.neededPermissionToAddResults
    );
  }
}

function mapTestTypeRowToTestType(row: TestTypeRow): TestType {
  return new TestType(new TestTypeId(row.id), row.name, row.resultsSchema, row.neededPermissionToAddResults);
}

interface TestTypeRow {
  id: string;
  name: string;
  resultsSchema: object;
  neededPermissionToAddResults: string;
}
