/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ObjectField, Field, connect, useForm } from '@formily/react';
import React, { useState } from 'react';
import { SQLEditor } from './SQLEditor';
import { Radio, Button, Space } from 'antd';
import { useT } from '../../locale';
import { BuildOutlined, ConsoleSqlOutlined, RightOutlined, DownOutlined, RightSquareOutlined } from '@ant-design/icons';
import { QueryBuilder } from './QueryBuilder';
import { ResultPanel } from './ResultPanel';
import { observer, useFlowSettingsContext } from '@nocobase/flow-engine';
import { configStore } from './config-store';
import { validateQuery } from './QueryBuilder.service';
const defaultSQL = `SELECT * FROM my_table
LIMIT 200;`;
const QueryMode = connect(({ value = 'builder', onChange, onClick }) => {
  const t = useT();
  return React.createElement(
    Radio.Group,
    {
      value: value,
      onChange: (e) => {
        const value = e.target.value;
        onChange(value);
      },
    },
    React.createElement(
      Radio.Button,
      { value: 'builder', onClick: () => onClick?.() },
      React.createElement(BuildOutlined, null),
      ' ',
      t('Builder'),
    ),
    React.createElement(
      Radio.Button,
      { value: 'sql', onClick: () => onClick?.() },
      React.createElement(ConsoleSqlOutlined, null),
      ' ',
      t('SQL'),
    ),
  );
});
export const QueryPanel = observer(() => {
  const t = useT();
  const form = useForm();
  const ctx = useFlowSettingsContext();
  const mode = form?.values?.query?.mode || 'builder';
  const qbRef = React.useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [running, setRunning] = useState(false);
  React.useEffect(() => {
    // 在 SQL 模式下，隐藏并取消校验 builder 模式相关字段，避免全表单 submit 时的必填校验
    const builderAddrs = ['collectionPath', 'measures', 'dimensions', 'filter', 'orders', 'limit', 'offset'];
    if (mode === 'sql') {
      // 新增：SQL 模式默认模板（仅在当前为空时设置）
      const currentSql = form?.values?.query?.sql;
      if (!currentSql || !String(currentSql).trim()) {
        form?.setValuesIn?.('query.sql', defaultSQL);
      }
      builderAddrs.forEach((addr) => {
        form.setFieldState(`query.${addr}`, (state) => {
          state.display = 'none';
          state.required = false;
        });
      });
      // 处理 measures 与 dimensions 内部项的 required
      form.query('query.measures.*.*').forEach((field) =>
        field.setState((state) => {
          state.display = 'none';
          state.required = false;
        }),
      );
      form.query('query.dimensions.*.*').forEach((field) =>
        field.setState((state) => {
          state.display = 'none';
          state.required = false;
        }),
      );
    } else {
      // 切回 builder 模式时，仅恢复显示；required 由原组件/Schema 再决定
      builderAddrs.forEach((addr) => {
        form.setFieldState(`query.${addr}`, (state) => {
          state.display = 'visible';
        });
      });
      form.query('query.measures.*.*').forEach((field) =>
        field.setState((state) => {
          state.display = 'visible';
        }),
      );
      form.query('query.dimensions.*.*').forEach((field) =>
        field.setState((state) => {
          state.display = 'visible';
        }),
      );
    }
  }, [mode, form]);
  // 图形化模式
  const handleBuilderChange = async (next) => {
    const query = form?.values?.query || {};
    form?.setValuesIn?.('query', {
      ...next,
      mode: query.mode,
      sql: query.sql,
    });
  };
  // SQL 模式
  // const handleSqlChange = async (sql: string) => {
  //   form?.setValuesIn?.('query.sql', sql);
  // };
  const handleRunQuery = async () => {
    console.log('---handleRunQuery', form.values?.query);
    try {
      setRunning(true);
      // 触发下层 QueryBuilder 的校验
      if (mode === 'builder') {
        try {
          await qbRef.current?.validate();
        } catch {
          setRunning(false);
          return;
        }
      }
      // 业务自定义校验
      const query = form.values?.query;
      const { success, message } = validateQuery(query);
      if (!success) {
        configStore.setError(ctx.model.uid, message);
        setShowResult(true);
        return;
      }
      // 通过校验后，写入查询参数并预览
      await ctx.model.onPreview(form.values, true);
      // 调整为不自动展示结果预览
      // setShowResult(true);
    } catch (error) {
      configStore.setError(ctx.model.uid, error?.message);
      setShowResult(true);
    } finally {
      setRunning(false);
    }
  };
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      ObjectField,
      { name: 'query' },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            // 解决父容器裁剪导致圆角/边框被吃掉的问题
            paddingTop: 1,
            paddingLeft: 1,
          },
        },
        React.createElement(Field, { name: 'mode', component: [QueryMode, { onClick: () => setShowResult(false) }] }),
        React.createElement(
          Space,
          null,
          React.createElement(
            Button,
            { type: 'link', loading: running, onClick: handleRunQuery },
            React.createElement(RightSquareOutlined, null),
            t('Run query'),
          ),
          React.createElement(
            Button,
            {
              type: 'link',
              'aria-expanded': showResult,
              onClick: () => setShowResult((v) => !v),
              style: { padding: 0 },
            },
            showResult ? t('Hide data') : t('View data'),
            showResult
              ? React.createElement(DownOutlined, { style: { fontSize: 12 } })
              : React.createElement(RightOutlined, { style: { fontSize: 12 } }),
          ),
        ),
      ),
      showResult
        ? React.createElement('div', { style: { marginTop: 8 } }, React.createElement(ResultPanel, null))
        : mode === 'builder'
        ? React.createElement(QueryBuilder, {
            ref: qbRef,
            initialValues: form?.values?.query,
            onChange: handleBuilderChange,
          })
        : React.createElement(Field, { name: 'sql', component: [SQLEditor] }),
    ),
  );
});
//# sourceMappingURL=QueryPanel.js.map
