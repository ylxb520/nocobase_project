/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
function pickDefined(obj) {
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (typeof v !== 'undefined' && v !== null) out[k] = v;
  });
  return out;
}
function resolvePrimaryKey(ctx, dataSourceKey, collection) {
  try {
    const ds = ctx.dataSourceManager?.getDataSource?.(dataSourceKey || 'main');
    const col = ds?.collectionManager?.getCollection?.(collection);
    const pk = col?.getPrimaryKey?.();
    return pk || 'id';
  } catch (e) {
    return 'id';
  }
}
function normalizeOne(ctx, ref) {
  if (!ref) return undefined;
  const dataSourceKey = ref.dataSourceKey || 'main';
  const collection = ref.collection || ref.record?.__collectionName;
  if (!collection) return undefined;
  const pk = resolvePrimaryKey(ctx, dataSourceKey, collection) || 'id';
  const filterByTk =
    typeof ref.filterByTk !== 'undefined' ? ref.filterByTk : typeof ref.id !== 'undefined' ? ref.id : ref.record?.[pk];
  if (typeof filterByTk === 'undefined') return undefined;
  return pickDefined({
    collection,
    filterByTk,
    dataSourceKey,
    associationName: ref.associationName,
    sourceId: ref.sourceId,
    fields: ref.fields,
    appends: ref.appends,
  });
}
export function buildServerContextParams(ctx, input = {}) {
  // Helper: detect a record-like object
  const isRecordRef = (val) => {
    if (!val || typeof val !== 'object') return false;
    return (
      typeof val.collection === 'string' &&
      (typeof val.filterByTk !== 'undefined' || typeof val.id !== 'undefined' || val.record)
    );
  };
  const out = {};
  const visit = (src, path) => {
    if (isRecordRef(src)) {
      const norm = normalizeOne(ctx, src);
      if (norm) {
        const key = path.join('.');
        out[key] = norm;
      }
      return;
    }
    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        visit(src[i], [...path, String(i)]);
      }
      return;
    }
    if (src && typeof src === 'object') {
      for (const [k, v] of Object.entries(src)) {
        visit(v, [...path, k]);
      }
      return;
    }
  };
  visit(input, []);
  return Object.keys(out).length ? out : undefined;
}
//# sourceMappingURL=serverContextParams.js.map
