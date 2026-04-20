import { lang } from '../locale';
export async function submitHandler(ctx, params) {
  const blockModel = ctx.blockModel;
  await blockModel.form.validateFields();
  const values = blockModel.form.getFieldsValue(true);
  const viewUid = ctx.view.inputArgs?.viewUid;
  const bulkEditActionModel = ctx.engine.getModel(viewUid, true);
  const collectionModel = bulkEditActionModel?.parent;
  const editModeParams = bulkEditActionModel?.getStepParams('bulkEditSettings', 'editMode') || {};
  const updateMode = editModeParams?.value || 'selected';
  const updateData = {
    values,
    forceUpdate: false,
  };
  if (updateMode === 'selected') {
    const rows = collectionModel?.resource?.getSelectedRows?.() || [];
    const pk = ctx.collection?.getPrimaryKey?.() || ctx.collection?.filterTargetKey || 'id';
    const filterKey = ctx.collection?.filterTargetKey || pk || 'id';
    const ids = rows.map((r) => ctx.collection.getFilterByTK(r)).filter((v) => v != null);
    if (!ids?.length) {
      ctx.message.error(lang('Please select the records to be edited'));
      ctx.exit();
      return;
    }
    updateData.filter = { $and: [{ [filterKey]: { $in: ids } }] };
  } else {
    updateData.filter = collectionModel?.resource.getFilter();
  }
  const collection = collectionModel?.context?.collection;
  if (!collection) {
    ctx.message.error?.(ctx.t('Collection not found'));
    ctx.exit?.();
    return;
  }
  if (updateData.filter) {
    await ctx.api
      .resource(collection.name, null, {
        'x-data-source': collection?.dataSourceKey,
      })
      .update({ filter: updateData.filter, values: updateData.values, ...params.requestConfig?.params });
  } else {
    await ctx.api
      .resource(collection.name, null, {
        'x-data-source': collection?.dataSourceKey,
      })
      .update({ values: updateData.values, forceUpdate: true, ...params.requestConfig?.params });
  }
  ctx.message.success(ctx.t('Saved successfully'));
}
//# sourceMappingURL=submitHandler.js.map
