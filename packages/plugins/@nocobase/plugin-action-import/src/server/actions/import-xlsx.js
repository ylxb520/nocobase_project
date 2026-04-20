/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import XLSX from 'xlsx';
import { Mutex } from 'async-mutex';
import { XlsxImporter } from '../services/xlsx-importer';
const IMPORT_LIMIT_COUNT = 2000;
const mutex = new Mutex();
async function importXlsxAction(ctx, next) {
  let columns = ctx.request.body.columns;
  if (typeof columns === 'string') {
    columns = JSON.parse(columns);
  }
  let readLimit = IMPORT_LIMIT_COUNT;
  // add header raw
  readLimit += 1;
  if (ctx.request.body.explain) {
    readLimit += 1;
  }
  const workbook = XLSX.read(ctx.file.buffer, {
    type: 'buffer',
    sheetRows: readLimit,
    cellDates: true,
  });
  const repository = ctx.getCurrentRepository();
  const dataSource = ctx.dataSource;
  const collection = repository.collection;
  const importer = new XlsxImporter({
    collectionManager: dataSource.collectionManager,
    collection,
    columns,
    workbook,
    explain: ctx.request.body.explain,
    repository,
    rowDefaultValues: ctx.action.params?.rowDefaultValues || {},
  });
  const importedCount = await importer.run({
    context: ctx,
  });
  ctx.bodyMeta = { successCount: importedCount };
  ctx.body = ctx.bodyMeta;
}
export async function importXlsx(ctx, next) {
  if (mutex.isLocked()) {
    throw new Error(
      ctx.t(`another import action is running, please try again later.`, {
        ns: 'action-import',
      }),
    );
  }
  const release = await mutex.acquire();
  try {
    await importXlsxAction(ctx, next);
  } finally {
    release();
  }
  await next();
}
//# sourceMappingURL=import-xlsx.js.map
