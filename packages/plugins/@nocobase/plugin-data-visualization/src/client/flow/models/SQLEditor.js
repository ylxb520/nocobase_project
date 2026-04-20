/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useRef } from 'react';
import { connect, mapProps, useForm } from '@formily/react';
import { Select, Form } from 'antd';
import { CodeEditor } from '../components/CodeEditor';
import { FlowContextSelector, observer, useFlowContext } from '@nocobase/flow-engine';
import { useDataSourceManager, useCompile, DEFAULT_DATA_SOURCE_KEY } from '@nocobase/client';
import { useT } from '../../locale';
const SQLEditorBase = observer((props) => {
  const { value, onChange } = props;
  const editorRef = useRef(null);
  const ctx = useFlowContext();
  const form = useForm();
  const dm = useDataSourceManager();
  const compile = useCompile();
  const t = useT();
  // 数据源选项
  const dsOptions = React.useMemo(() => {
    const all = dm.getAllCollections();
    return all
      .filter(({ key, isDBInstance }) => key === DEFAULT_DATA_SOURCE_KEY || isDBInstance)
      .map(({ key, displayName }) => ({ value: key, label: compile(displayName) }));
  }, [dm, compile]);
  // 当前 SQL 模式的数据源（默认 main）
  const sqlDsKey = form?.values?.query?.sqlDatasource ?? DEFAULT_DATA_SOURCE_KEY;
  const onDsChange = (key) => {
    form?.setValuesIn?.('query.sqlDatasource', key);
  };
  return React.createElement(
    'div',
    null,
    React.createElement(
      Form.Item,
      { label: t('Data source'), rules: [{ required: true }], style: { marginTop: 8 } },
      React.createElement(Select, {
        style: { width: 222 },
        placeholder: t('Data source'),
        options: dsOptions,
        value: sqlDsKey,
        onChange: onDsChange,
      }),
    ),
    React.createElement(CodeEditor, {
      ref: editorRef,
      language: 'sql',
      value: value,
      onChange: onChange,
      rightExtra: React.createElement(FlowContextSelector, {
        onChange: (val) => {
          if (!val) return;
          editorRef.current?.insertAtCursor(val);
        },
        metaTree: () => ctx.getPropertyMetaTree(),
      }),
    }),
  );
});
export const SQLEditor = connect(
  SQLEditorBase,
  mapProps((props) => ({
    value: props.value,
    onChange: props.onChange,
  })),
);
//# sourceMappingURL=SQLEditor.js.map
