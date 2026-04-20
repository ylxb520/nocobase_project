export function mergeOptions(fieldOptions, modelOptions) {
  const newOptions = {
    ...fieldOptions,
    ...modelOptions,
  };
  for (const key of Object.keys(modelOptions)) {
    if (modelOptions[key] === null && fieldOptions[key]) {
      newOptions[key] = fieldOptions[key];
    }
  }
  return newOptions;
}
export const mapDataSourceWithCollection = (app, dataSourceModel, appendCollections = true) => {
  const plugin = app.pm.get('data-source-manager');
  const dataSource = app.dataSourceManager.dataSources.get(dataSourceModel.get('key'));
  const dataSourceStatus = plugin.dataSourceStatus[dataSourceModel.get('key')];
  const item = {
    key: dataSourceModel.get('key'),
    displayName: dataSourceModel.get('displayName'),
    status: dataSourceStatus,
    type: dataSourceModel.get('type'),
    // @ts-ignore
    isDBInstance: !!dataSource?.collectionManager.db,
  };
  const publicOptions = dataSource?.publicOptions();
  if (publicOptions) {
    item['options'] = publicOptions;
  }
  if (dataSourceStatus === 'loading-failed' || dataSourceStatus === 'reloading-failed') {
    item['errorMessage'] = plugin.dataSourceErrors[dataSourceModel.get('key')].message;
  }
  if (!dataSource) {
    return item;
  }
  if (appendCollections) {
    const collections = dataSource.collectionManager.getCollections();
    item.collections = collections.map((collection) => {
      const collectionOptions = collection.options;
      const collectionInstance = dataSource.collectionManager.getCollection(collectionOptions.name);
      const fields = [...collection.fields.values()].map((field) => field.options);
      const results = {
        ...collectionOptions,
        fields,
      };
      if (collectionInstance && collectionInstance.availableActions) {
        results['availableActions'] = collectionInstance.availableActions();
      }
      if (collectionInstance && collectionInstance.unavailableActions) {
        results['unavailableActions'] = collectionInstance.unavailableActions();
      }
      return results;
    });
  }
  return item;
};
//# sourceMappingURL=utils.js.map
