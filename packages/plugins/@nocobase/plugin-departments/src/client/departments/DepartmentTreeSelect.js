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
import React, { useCallback, useContext, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { useField } from '@formily/react';
import { useRecord } from '@nocobase/client';
import { ResourcesContext } from '../ResourcesProvider';
import { useDepartmentManager } from '../hooks/departments-manager';
export const DepartmentTreeSelect = (props) => {
  const field = useField();
  const [value, setValue] = React.useState({ label: null, value: null });
  const { treeData, initData, getByKeyword, loadData, loadedKeys, setLoadedKeys, originData } = props;
  const handleSearch = async (keyword) => {
    if (!keyword) {
      initData(originData);
      return;
    }
    await getByKeyword(keyword);
  };
  const getTitle = useCallback((record) => {
    const title = record.title;
    const parent = record.parent;
    if (parent) {
      return getTitle(parent) + ' / ' + title;
    }
    return title;
  }, []);
  useEffect(() => {
    initData(originData);
  }, [originData, initData]);
  useEffect(() => {
    if (!field.value) {
      setValue({ label: null, value: null });
      return;
    }
    setValue({
      label: getTitle(field.value) || field.value.label,
      value: field.value.id,
    });
  }, [field.value, getTitle]);
  return React.createElement(TreeSelect, {
    value: value,
    onSelect: (_, node) => {
      field.setValue(node);
    },
    onChange: (value) => {
      if (!value) {
        field.setValue(null);
      }
    },
    treeData: treeData,
    treeLoadedKeys: loadedKeys,
    onTreeLoad: (keys) => setLoadedKeys(keys),
    loadData: (node) => loadData({ key: node.id, children: node.children }),
    fieldNames: {
      value: 'id',
    },
    showSearch: true,
    allowClear: true,
    treeNodeFilterProp: 'title',
    onSearch: handleSearch,
    labelInValue: true,
  });
};
export const DepartmentSelect = () => {
  const departmentManager = useDepartmentManager();
  const { departmentsResource } = useContext(ResourcesContext);
  const {
    service: { data },
  } = departmentsResource || {};
  return React.createElement(DepartmentTreeSelect, { ...departmentManager, originData: data?.data });
};
export const SuperiorDepartmentSelect = () => {
  const departmentManager = useDepartmentManager();
  const { setTreeData, getChildrenIds } = departmentManager;
  const record = useRecord();
  const { departmentsResource } = useContext(ResourcesContext);
  const {
    service: { data },
  } = departmentsResource || {};
  useEffect(() => {
    if (!record.id) {
      return;
    }
    const childrenIds = getChildrenIds(record.id);
    childrenIds.push(record.id);
    setTreeData((treeData) => {
      const setDisabled = (treeData) => {
        return treeData.map((node) => {
          if (childrenIds.includes(node.id)) {
            node.disabled = true;
          }
          if (node.children) {
            node.children = setDisabled(node.children);
          }
          return node;
        });
      };
      return setDisabled(treeData);
    });
  }, [setTreeData, record.id, getChildrenIds]);
  return React.createElement(DepartmentTreeSelect, { ...departmentManager, originData: data?.data });
};
//# sourceMappingURL=DepartmentTreeSelect.js.map
