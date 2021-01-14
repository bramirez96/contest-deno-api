import { QueryResult } from '../../deps.ts';

export default class PGModel {
  protected parseSql(sql: string) {
    const parsedSql1 = sql.replaceAll('"', "'");
    const parsedSql2 = parsedSql1.replaceAll('`', '"');
    return parsedSql2;
  }

  protected parseResponse(query: QueryResult, config?: { first: boolean }) {
    const formattedData = query.rows.map((row) => {
      const parsedRow: { [key: string]: unknown } = {};
      (row as unknown[]).map(
        (cell, colNum) =>
          (parsedRow[query.rowDescription.columns[colNum].name] = cell)
      );
      return parsedRow;
    });
    return config?.first ? formattedData[0] : formattedData;
  }
}
