/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useForm } from '@formily/react';
import { action } from '@formily/reactive';
import { uid } from '@formily/shared';
import {
  AddSubFieldAction,
  CollectionCategoriesContext,
  EditSubFieldAction,
  FieldSummary,
  ResourceActionContext,
  SchemaComponent,
  SchemaComponentContext,
  TemplateSummary,
  useAPIClient,
  useCancelAction,
  useCollectionManager_deprecated,
  useCompile,
  useCurrentAppInfo,
  useDataSourceManager,
  useRecord,
} from '@nocobase/client';
import { getPickerFormat } from '@nocobase/utils/client';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDataSourceRefresh } from '../../hooks/useDataSourceRefresh';
import { useDataSourceData } from '../../hooks/useResourceData';
import { CollectionFields } from './CollectionFields';
import { getCollectionSchema } from './schema/collections';
/**
 * @param service
 * @param exclude 不需要显示的 collection templates
 * @returns
 */
const useAsyncDataSource = (service, exclude) => {
  return (field, options) => {
    field.loading = true;
    service(field, options, exclude)
      .then(
        action.bound((data) => {
          field.dataSource = data;
          field.loading = false;
        }),
      )
      .catch((error) => console.log(error));
  };
};
const useSelectedRowKeys = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return [selectedRowKeys, setSelectedRowKeys];
};
const useDestroySubField = () => {
  const record = useRecord();
  const form = useForm();
  return {
    async run() {
      const children = form.values?.children?.slice?.();
      form.setValuesIn(
        'children',
        children.filter((child) => {
          return child.name !== record.name;
        }),
      );
    },
  };
};
const useBulkDestroySubField = () => {
  return {
    async run() {},
  };
};
const useNewId = (prefix) => {
  return `${prefix || ''}${uid()}`;
};
export const ConfigurationTable = () => {
  const { t } = useTranslation();
  const { interfaces } = useCollectionManager_deprecated();
  const {
    data: { database },
  } = useCurrentAppInfo() || {
    data: { database: {} },
  };
  const ds = useDataSourceManager();
  const ctx = useContext(SchemaComponentContext);
  const { name } = useParams();
  const data = useContext(CollectionCategoriesContext);
  const api = useAPIClient();
  const compile = useCompile();
  const service = useContext(ResourceActionContext);
  const loadCategories = async () => {
    return data.data.map((item) => ({
      label: compile(item.name),
      value: item.id,
    }));
  };
  const loadStorages = async () => {
    return api
      .resource('storages')
      .list()
      .then(({ data }) => {
        return data?.data?.map((item) => {
          return {
            label: t(compile(item.title)),
            value: item.name,
          };
        });
      });
  };
  const useRefreshActionProps = () => {
    return useDataSourceRefresh({
      dataSourceName: name,
      onSuccess: () => {
        service?.refresh?.();
      },
    });
  };
  const collectionSchema = useMemo(() => {
    return getCollectionSchema(name);
  }, [name]);
  const { data: dataSourceData } = useDataSourceData(name);
  const loadFilterTargetKeys = async (field) => {
    const { fields } = field.form.values;
    return Promise.resolve({
      data: fields,
    }).then(({ data }) => {
      return data?.map((item) => {
        return {
          label: compile(item.uiSchema?.title) || item.name,
          value: item.name,
        };
      });
    });
  };
  const schemaComponentContext = useMemo(() => ({ ...ctx, designable: false, dataSourceData }), [ctx, dataSourceData]);
  return React.createElement(
    SchemaComponentContext.Provider,
    { value: schemaComponentContext },
    React.createElement(SchemaComponent, {
      schema: collectionSchema,
      components: {
        AddSubFieldAction,
        EditSubFieldAction,
        FieldSummary,
        TemplateSummay: TemplateSummary,
        CollectionFields,
      },
      scope: {
        useRefreshActionProps,
        useDestroySubField,
        useBulkDestroySubField,
        useSelectedRowKeys,
        useAsyncDataSource,
        loadFilterTargetKeys,
        loadCategories,
        loadStorages,
        useNewId,
        useCancelAction,
        interfaces,
        enableInherits: database?.dialect === 'postgres',
        isPG: database?.dialect === 'postgres',
        getPickerFormat,
      },
    }),
  );
};
//# sourceMappingURL=ConfigurationTable.js.map
