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
import React from 'react';
import { Col, Row } from 'antd';
import { Department } from './Department';
import { Member } from './Member';
import { SchemaComponentOptions } from '@nocobase/client';
import { SuperiorDepartmentSelect, DepartmentSelect } from './DepartmentTreeSelect';
import { DepartmentsListProvider, UsersListProvider } from '../ResourcesProvider';
export const DepartmentManagement = () => {
  return React.createElement(
    SchemaComponentOptions,
    { components: { SuperiorDepartmentSelect, DepartmentSelect } },
    React.createElement(
      Row,
      { gutter: 48, style: { flexWrap: 'nowrap' } },
      React.createElement(
        Col,
        { span: 6, style: { borderRight: '1px solid #eee', minWidth: '300px' } },
        React.createElement(DepartmentsListProvider, null, React.createElement(Department, null)),
      ),
      React.createElement(
        Col,
        { flex: 'auto', style: { overflow: 'hidden' } },
        React.createElement(UsersListProvider, null, React.createElement(Member, null)),
      ),
    ),
  );
};
//# sourceMappingURL=DepartmentManagement.js.map
