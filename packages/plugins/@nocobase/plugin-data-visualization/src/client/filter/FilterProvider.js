/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { createContext, useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
export const ChartFilterContext = createContext({});
ChartFilterContext.displayName = 'ChartFilterContext';
export const ChartFilterProvider = (props) => {
  const [ready, setReady] = useState(false);
  const [enabled, _setEnabled] = useState(false);
  const [fields, setFields] = useState({});
  const [collapse, _setCollapse] = useState({ collapsed: false, row: 1 });
  const [form, _setForm] = useState();
  const setField = useMemoizedFn((name, props) => {
    setFields((fields) => ({
      ...fields,
      [name]: {
        ...(fields[name] || {}),
        ...props,
      },
    }));
  });
  const removeField = useMemoizedFn((name) => {
    setFields((fields) => {
      const newFields = {
        ...fields,
      };
      newFields[name] = undefined;
      return newFields;
    });
  });
  const setForm = useMemoizedFn(_setForm);
  const setEnabled = useMemoizedFn(_setEnabled);
  const setCollapse = ({ collapsed, row }) => {
    _setCollapse((collapse) => ({
      collapsed: collapsed !== undefined ? collapsed : collapse.collapsed,
      row: row !== undefined ? row : collapse.row,
    }));
  };
  useEffect(() => setReady(true), []);
  return React.createElement(
    ChartFilterContext.Provider,
    { value: { ready, enabled, setEnabled, fields, setField, removeField, collapse, setCollapse, form, setForm } },
    props.children,
  );
};
//# sourceMappingURL=FilterProvider.js.map
