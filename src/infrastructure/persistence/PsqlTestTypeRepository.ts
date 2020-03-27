import knex from 'knex';
import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/TestType';
import { TestTypeId } from '../../domain/model/testType/TestTypeId';

const TEST_TYPE_TABLE_NAME = 'test-type';

export class PsqlTestTypeRepository implements TestTypeRepository {
  constructor(private db: knex) {}

  async save(testType: TestType): Promise<TestType> {
    return await this.db
      .raw(
        `
      insert into "${TEST_TYPE_TABLE_NAME}" (id, name, results_schema, require_trusted)
      values (:id, :name, :results_schema, :require_trusted)
      on conflict do nothing
    `,
        {
          id: testType.id.value,
          name: testType.name,
          results_schema: JSON.stringify(testType.resultsSchema),
          require_trusted: testType.requireTrusted,
        }
      )
      .then(() => testType);
  }

  async findByTrusted(trusted: boolean): Promise<Array<any>> {
    let testTypeRows: Array<any>;

    const columns = [
      'id',
      'name',
      'results_schema as resultsSchema',
      'require_trusted as requireTrusted',
    ];

    if (trusted) {
      // Return all
      testTypeRows = await this.db(TEST_TYPE_TABLE_NAME).select(columns);
    } else {
      // Filter out test types that require trusted
      testTypeRows = await this.db(TEST_TYPE_TABLE_NAME)
        .where({ require_trusted: true })
        .select(columns);
    }

    if (!testTypeRows) {
      return [];
    }

    return testTypeRows.map(
      (testTypeRow: any) =>
        new TestType(
          new TestTypeId(testTypeRow.id),
          testTypeRow.name,
          testTypeRow.resultsSchema,
          testTypeRow.requireTrusted
        )
    );
  }
}
