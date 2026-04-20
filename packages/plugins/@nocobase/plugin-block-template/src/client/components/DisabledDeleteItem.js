/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaSettingsDivider, SchemaSettingsItem } from '@nocobase/client';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Space } from 'antd';
import React from 'react';
import { useT } from '../locale';
export const DisabledDeleteItem = () => {
  const t = useT();
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(SchemaSettingsDivider, null),
    React.createElement(
      SchemaSettingsItem,
      { disabled: true, title: t('Delete') },
      React.createElement(
        Space,
        null,
        t('Delete'),
        React.createElement(
          Tooltip,
          { title: t('This is part of a template, deletion is not allowed') },
          React.createElement(QuestionCircleOutlined, null),
        ),
      ),
    ),
  );
};
//# sourceMappingURL=DisabledDeleteItem.js.map
