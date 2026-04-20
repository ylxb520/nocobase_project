/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { RightOutlined } from '@ant-design/icons';
import { useApp, useCompile, useDataSourceManager } from '@nocobase/client';
import { Breadcrumb, Space, Tag } from 'antd';
import React, { useContext, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataSourceContext } from '../DatabaseConnectionProvider';
import { NAMESPACE, lang } from '../locale';
import { statusEnum } from '../schema';
export const BreadcumbTitle = () => {
  const app = useApp();
  const { name } = useParams();
  const compile = useCompile();
  const dm = useDataSourceManager();
  const dataSourceKey = name || 'main';
  const { displayName } = dm.getDataSource(dataSourceKey) || {};
  const { dataSource } = useContext(DataSourceContext);
  const dataSourceValue = useMemo(
    () => (dataSource && dataSource?.name === dataSourceKey ? dataSource : dm.getDataSource(dataSourceKey)),
    [dataSource, dataSourceKey, dm.getDataSource(dataSourceKey)?.status],
  );
  const items = useMemo(() => {
    const status = dataSourceValue?.status;
    const option = statusEnum.find((v) => v.value === status);
    const res = [
      {
        title: React.createElement(
          Link,
          { to: app.pluginSettingsManager.getRoutePath(NAMESPACE) },
          lang('Data source manager'),
        ),
      },
    ];
    if (dataSourceValue) {
      res.push({
        title: React.createElement(
          Space,
          null,
          React.createElement('span', null, compile(displayName)),
          status && React.createElement(Tag, { key: status, color: option?.color }, compile(option?.label)),
        ),
      });
    }
    return res;
  }, [dataSourceValue]);
  return React.createElement(Breadcrumb, { separator: React.createElement(RightOutlined, null), items: items });
};
//# sourceMappingURL=BreadcumbTitle.js.map
