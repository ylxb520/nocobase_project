/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Select, InputNumber, Switch, Form, Slider, Segmented } from 'antd';
import { useT } from '../../locale';
import { normalizeBuilder, applyTypeChange, buildFieldOptions, getChartFormSpec } from './ChartOptionsBuilder.service';
import { sleep, appendColon } from '../utils';
import { useFlowSettingsContext } from '@nocobase/flow-engine';
export const ChartOptionsBuilder = ({ columns, initialValues, onChange }) => {
  const t = useT();
  const [form] = Form.useForm();
  const ctx = useFlowSettingsContext();
  const lang = ctx?.i18n?.language;
  // 为通用布尔项注入默认值，保证 UI 与生成配置一致
  const computedInitialValues = useMemo(() => ({ legend: true, tooltip: true, label: false, ...initialValues }), [
    initialValues,
  ]);
  // 程序化回填时抑制一次 onValuesChange，避免循环
  const ignoreOnValuesChangeRef = useRef(false);
  // 列变化规范化：仅在列非空时执行；基于当前表单值进行规范化并外抛，同时回填到表单
  useEffect(() => {
    if (!columns || columns.length === 0) return;
    const handleColumnChange = async () => {
      const current = form.getFieldsValue(true);
      const next = normalizeBuilder(current, columns);
      if (JSON.stringify(next) !== JSON.stringify(current)) {
        ignoreOnValuesChangeRef.current = true;
        form.setFieldsValue(next);
        await sleep(0);
        ignoreOnValuesChangeRef.current = false;
        onChange(next);
      }
    };
    handleColumnChange();
  }, [columns, form, onChange]);
  // 用户编辑：基于 all（当前表单值），在列就绪时规范化并外抛；列未就绪时仅外抛用户变更
  const handleValuesChange = (changed, all) => {
    if (ignoreOnValuesChangeRef.current) return;
    const noColumns = !columns || columns.length === 0;
    let next = { ...all };
    if ('type' in changed && !noColumns) {
      next = applyTypeChange(next, all.type, columns);
    }
    if (!noColumns) {
      next = normalizeBuilder(next, columns);
    }
    onChange(next);
  };
  const type = Form.useWatch('type', form) ?? 'line';
  const fieldOptions = useMemo(() => buildFieldOptions(columns || []), [columns]);
  return React.createElement(
    'div',
    { style: { padding: 1 } },
    React.createElement(
      Form,
      {
        form: form,
        layout: 'vertical',
        colon: true,
        initialValues: computedInitialValues,
        onValuesChange: handleValuesChange,
      },
      React.createElement(
        Form.Item,
        {
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Chart type'), lang)),
          name: 'type',
          required: true,
        },
        React.createElement(Select, {
          style: { width: 180 },
          options: [
            { label: t('Line'), value: 'line' },
            { label: t('Area'), value: 'area' },
            { label: t('Column'), value: 'bar' },
            { label: t('Bar'), value: 'barHorizontal' },
            { label: t('Pie'), value: 'pie' },
            { label: t('Doughnut'), value: 'doughnut' },
            { label: t('Funnel'), value: 'funnel' },
            { label: t('Scatter'), value: 'scatter' },
          ],
        }),
      ),
      renderChartOptions(type, { t, fieldOptions, lang }),
      React.createElement(
        Form.Item,
        {
          name: 'legend',
          valuePropName: 'checked',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Legend'), lang)),
        },
        React.createElement(Switch, null),
      ),
      React.createElement(
        Form.Item,
        {
          name: 'tooltip',
          valuePropName: 'checked',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Tooltip'), lang)),
        },
        React.createElement(Switch, null),
      ),
      React.createElement(
        Form.Item,
        {
          name: 'label',
          valuePropName: 'checked',
          label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t('Label'), lang)),
        },
        React.createElement(Switch, null),
      ),
    ),
  );
};
function renderItem(spec, ctx) {
  const { t, fieldOptions, lang } = ctx;
  if (spec.kind === 'select') {
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        label: React.createElement(
          'span',
          { style: { fontWeight: 500 } },
          appendColon(t(spec.labelKey || spec.label || ''), lang),
        ),
        name: spec.name,
        required: spec.required,
      },
      React.createElement(Select, {
        style: { width: 180 },
        allowClear: !!spec.allowClear,
        placeholder: spec.placeholderKey ? t(spec.placeholderKey) : undefined,
        options: fieldOptions,
      }),
    );
  }
  if (spec.kind === 'switch') {
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        name: spec.name,
        valuePropName: 'checked',
        label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t(spec.labelKey), lang)),
      },
      React.createElement(Switch, null),
    );
  }
  if (spec.kind === 'number') {
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t(spec.labelKey), lang)),
        name: spec.name,
      },
      React.createElement(InputNumber, { min: spec.min, max: spec.max, style: { width: 180 } }),
    );
  }
  if (spec.kind === 'slider') {
    const min = spec.min ?? 0;
    const max = spec.max ?? 100;
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t(spec.labelKey), lang)),
      },
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        React.createElement(
          Form.Item,
          { name: spec.name, style: { margin: 0, paddingLeft: 6 } },
          React.createElement(Slider, { min: min, max: max, step: 1, style: { width: 180 } }),
        ),
        React.createElement(
          Form.Item,
          { name: spec.name, noStyle: true },
          React.createElement(InputNumber, { min: min, max: max, step: 1, style: { width: 80 } }),
        ),
      ),
    );
  }
  if (spec.kind === 'enum') {
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t(spec.labelKey), lang)),
        name: spec.name,
      },
      React.createElement(Select, {
        style: { width: 180 },
        options: (spec.options || []).map((o) => ({ label: t(o.labelKey || o.label || ''), value: o.value })),
      }),
    );
  }
  if (spec.kind === 'segmented') {
    return React.createElement(
      Form.Item,
      {
        key: spec.name,
        label: React.createElement('span', { style: { fontWeight: 500 } }, appendColon(t(spec.labelKey), lang)),
        name: spec.name,
      },
      React.createElement(Segmented, {
        options: (spec.options || []).map((o) => ({ label: t(o.labelKey || o.label || ''), value: o.value })),
      }),
    );
  }
  return null;
}
const renderChartOptions = (type, options) => {
  const formSpecs = getChartFormSpec(type);
  return React.createElement(
    React.Fragment,
    null,
    formSpecs.map((spec) => renderItem(spec, options)),
  );
};
//# sourceMappingURL=ChartOptionsBuilder.js.map
