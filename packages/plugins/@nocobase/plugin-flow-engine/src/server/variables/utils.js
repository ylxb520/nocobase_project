/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { variables, inferSelectsFromUsage } from './registry';
import { adjustSelectsForCollection } from './selects';
import { fetchRecordOrRecordsJson, getExtraKeyFieldsForSelect, mergeFieldsWithExtras } from './records';
/**
 * 预取：构建“同记录”的字段/关联并集，一次查询写入 ctx.state.__varResolveBatchCache，供后续解析复用
 */
export async function prefetchRecordsForResolve(koaCtx, items) {
    try {
        const log = koaCtx.app?.logger?.child({ module: 'plugin-flow-engine', submodule: 'variables.prefetch' });
        const groupMap = new Map();
        const ensureGroup = (dataSourceKey, collection, filterByTk, strictSelects, opts) => {
            const groupKey = JSON.stringify({
                ds: dataSourceKey,
                collection,
                tk: filterByTk,
                f: Array.isArray(opts?.fields) ? [...opts.fields].sort() : undefined,
                a: Array.isArray(opts?.appends) ? [...opts.appends].sort() : undefined,
            });
            let group = groupMap.get(groupKey);
            if (!group) {
                group = {
                    dataSourceKey,
                    collection,
                    filterByTk,
                    strictSelects,
                    fields: new Set(),
                    appends: new Set(),
                };
                groupMap.set(groupKey, group);
            }
            return group;
        };
        const normalizeNestedSeg = (segment) => (/^\d+$/.test(segment) ? `[${segment}]` : segment);
        for (const it of items) {
            const template = it?.template ?? {};
            const contextParams = (it?.contextParams || {});
            const usage = variables.extractUsage(template);
            for (const [cpKey, recordParams] of Object.entries(contextParams)) {
                const parts = String(cpKey).split('.');
                const varName = parts[0];
                const nestedSeg = parts.slice(1).join('.');
                const paths = usage?.[varName] || [];
                if (!paths.length)
                    continue;
                const segNorm = nestedSeg ? normalizeNestedSeg(nestedSeg) : '';
                const remainders = [];
                for (const p of paths) {
                    if (!segNorm)
                        remainders.push(p);
                    else if (p === segNorm)
                        remainders.push('');
                    else if (p.startsWith(`${segNorm}.`) || p.startsWith(`${segNorm}[`))
                        remainders.push(p.slice(segNorm.length + 1));
                }
                if (!remainders.length)
                    continue;
                const dataSourceKey = recordParams?.dataSourceKey || 'main';
                const collection = recordParams?.collection;
                const filterByTk = recordParams?.filterByTk;
                if (!collection || typeof filterByTk === 'undefined')
                    continue;
                const explicitFields = recordParams?.fields;
                const explicitAppends = recordParams?.appends;
                const hasExplicit = Array.isArray(explicitFields) || Array.isArray(explicitAppends);
                const group = ensureGroup(dataSourceKey, collection, filterByTk, hasExplicit, {
                    fields: hasExplicit ? explicitFields : undefined,
                    appends: hasExplicit ? explicitAppends : undefined,
                });
                // 若显式传入了 fields/appends，则认为 selects 被“锁定”，不再基于模板 usage 扩展，
                // 避免在同一批解析中预取超出选择范围的字段，导致占位符被意外解析/覆盖。
                if (hasExplicit) {
                    const fixed = adjustSelectsForCollection(koaCtx, dataSourceKey, collection, explicitFields, explicitAppends);
                    fixed.fields?.forEach((f) => group.fields.add(f));
                    fixed.appends?.forEach((a) => group.appends.add(a));
                    continue;
                }
                let { generatedAppends, generatedFields } = inferSelectsFromUsage(remainders);
                const fixed = adjustSelectsForCollection(koaCtx, dataSourceKey, collection, generatedFields, generatedAppends);
                generatedFields = fixed.fields;
                generatedAppends = fixed.appends;
                if (generatedFields?.length)
                    generatedFields.forEach((f) => group.fields.add(f));
                if (generatedAppends?.length)
                    generatedAppends.forEach((a) => group.appends.add(a));
            }
        }
        if (!groupMap.size)
            return;
        // 确保请求级缓存存在
        const stateObj = koaCtx.state;
        if (stateObj && !stateObj['__varResolveBatchCache']) {
            stateObj['__varResolveBatchCache'] = new Map();
        }
        const cache = koaCtx.state?.['__varResolveBatchCache'];
        for (const { dataSourceKey, collection, filterByTk, strictSelects, fields, appends } of groupMap.values()) {
            try {
                const ds = koaCtx.app.dataSourceManager.get(dataSourceKey);
                const cm = ds.collectionManager;
                if (!cm?.db)
                    continue;
                const repo = cm.db.getRepository(collection);
                const collectionInfo = repo
                    ?.collection;
                const filterTargetKey = collectionInfo?.filterTargetKey;
                const modelInfo = repo.collection?.model;
                const pkAttr = modelInfo?.primaryKeyAttribute;
                const rawAttributes = modelInfo?.rawAttributes || undefined;
                const pkIsValid = !!(pkAttr &&
                    rawAttributes &&
                    Object.prototype.hasOwnProperty.call(rawAttributes, pkAttr));
                const fldBase = fields.size ? Array.from(fields).sort() : undefined;
                const extraKeys = getExtraKeyFieldsForSelect(filterByTk, {
                    filterTargetKey,
                    pkAttr,
                    pkIsValid,
                    rawAttributes,
                });
                const effectiveExtras = strictSelects && Array.isArray(extraKeys) && extraKeys.length
                    ? extraKeys.filter((k) => k === pkAttr)
                    : extraKeys;
                const fld = mergeFieldsWithExtras(fldBase, effectiveExtras);
                const app = appends.size ? Array.from(appends).sort() : undefined;
                const json = await fetchRecordOrRecordsJson(repo, {
                    filterByTk,
                    fields: fld,
                    appends: app,
                    filterTargetKey,
                    pkAttr,
                    pkIsValid,
                });
                if (cache) {
                    const key = JSON.stringify({ ds: dataSourceKey, c: collection, tk: filterByTk, f: fld, a: app });
                    cache.set(key, json);
                }
            }
            catch (e) {
                // 忽略预取失败，但记录为 debug
                log?.debug('[variables.resolve] prefetch query error', {
                    ds: dataSourceKey,
                    collection,
                    tk: filterByTk,
                    error: e?.message || String(e),
                });
            }
        }
    }
    catch (e) {
        koaCtx.app?.logger
            ?.child({ module: 'plugin-flow-engine', submodule: 'variables.prefetch' })
            ?.debug('[variables.resolve] prefetch fatal error', { error: e?.message || String(e) });
    }
}
//# sourceMappingURL=utils.js.map