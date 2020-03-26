import knex from 'knex';
import { TestTypeRepository } from '../../domain/model/testType/TestTypeRepository';
import { TestType } from '../../domain/model/testType/testType';
import { TestTypeId } from '../../domain/model/testType/testTypeId';

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
          email: testType.name,
          results_schema: testType.resultsSchema,
          require_trusted: testType.requireTrusted,
        }
      )
      .then(() => testType);
  }

  async findByTrusted(trusted: boolean): Promise<Array<any>> {
    let testTypeRows;
    if (trusted) {
      // Return all
      testTypeRows: Array = await this.db(TEST_TYPE_TABLE_NAME).select([
        'id',
        'name',
        'results_schema as resultsSchema',
        'require_trusted as requireTrusted',
      ]);
    } else {
      // Filter out test types that require trusted
      testTypeRows: Array = await this.db(TEST_TYPE_TABLE_NAME)
        .where('require_trusted', '=', 'true') // How do we handle boolean ???
        .select([
          'id',
          'name',
          'results_schema as resultsSchema',
          'require_trusted as requireTrusted',
        ]);
    }

    if (!testTypeRows) {
      return [];
    }

    return testTypeRows.map(
      (testTypeRow: object) =>
        new TestType(
          new TestTypeId(testTypeRow.id),
          testTypeRow.name,
          testTypeRow.resultsSchema,
          testTypeRow.requireTrusted
        )
    );
  }
}
