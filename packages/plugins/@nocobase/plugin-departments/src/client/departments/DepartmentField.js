/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React, { useContext } from 'react';
import { useField } from '@formily/react';
import { ResourcesContext } from '../ResourcesProvider';
import { getDepartmentTitle } from '../utils';
import { EllipsisWithTooltip } from '@nocobase/client';
export const DepartmentField = () => {
  const { setDepartment } = useContext(ResourcesContext);
  const field = useField();
  const values = field.value || [];
  const deptsMap = values.reduce((mp, dept) => {
    mp[dept.id] = dept;
    return mp;
  }, {});
  const depts = values.map((dept, index) =>
    React.createElement(
      'span',
      { key: index },
      React.createElement(
        'a',
        {
          onClick: (e) => {
            e.preventDefault();
            setDepartment(deptsMap[dept.id]);
          },
        },
        getDepartmentTitle(dept),
      ),
      index !== values.length - 1 ? React.createElement('span', { style: { marginRight: 4, color: '#aaa' } }, ',') : '',
    ),
  );
  return React.createElement(EllipsisWithTooltip, { ellipsis: true }, depts);
};
//# sourceMappingURL=DepartmentField.js.map
