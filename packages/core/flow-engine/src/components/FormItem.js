/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Tooltip, Form } from 'antd';
const formItemPropKeys = [
  'colon',
  'dependencies',
  'extra',
  'getValueFromEvent',
  'getValueProps',
  'hasFeedback',
  'help',
  'htmlFor',
  'initialValue',
  'label',
  'labelAlign',
  'labelCol',
  'messageVariables',
  'name',
  'normalize',
  'noStyle',
  'preserve',
  'rules',
  'tooltip',
  'trigger',
  'validateStatus',
  'validateTrigger',
  'valuePropName',
  'wrapperCol',
  'labelWidth',
  'labelWrap',
  'layout',
  'required',
  'showLabel',
];
export const FormItem = ({ children, showLabel = true, labelWidth, ...rest }) => {
  // 过滤掉 Form.Item 专用 props，只保留要传给子组件的
  const childProps = Object.fromEntries(Object.entries(rest).filter(([key]) => !formItemPropKeys.includes(key)));
  const processedChildren =
    typeof children === 'function'
      ? children
      : React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...childProps });
          }
          return child;
        });
  const { label, labelWrap, colon = true, layout } = rest;
  const effectiveLabelWrap = !layout || layout === 'vertical' ? true : labelWrap;
  const renderLabel = () => {
    if (!showLabel) return null;
    if (effectiveLabelWrap) {
      // 垂直布局或者 labelWrap = true，宽度100%，自动换行
      return React.createElement(
        'div',
        {
          style: {
            width: '100%',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontWeight: 600,
          },
        },
        React.createElement('span', { style: { flex: 1 } }, label),
        colon && React.createElement('span', { style: { marginLeft: 4, flexShrink: 0 } }, ':'),
      );
    }
    // labelWrap = false → 省略 + tooltip
    return React.createElement(
      Tooltip,
      { title: label },
      React.createElement(
        'div',
        {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            maxWidth: (typeof labelWidth === 'number' ? labelWidth : 120) - 20,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            verticalAlign: 'middle',
            fontWeight: 600,
          },
        },
        React.createElement('span', { style: { flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' } }, label),
        colon && React.createElement('span', { style: { marginLeft: 4, flexShrink: 0 } }, ':'),
      ),
    );
  };
  return React.createElement(
    Form.Item,
    {
      ...rest,
      labelCol: { style: { width: labelWidth } },
      layout: layout,
      label: renderLabel(),
      colon: false,
      extra: rest.extra && React.createElement('span', { style: { whiteSpace: 'pre-wrap' } }, rest.extra),
      tooltip: rest.tooltip && {
        title: rest.tooltip,
        overlayInnerStyle: { whiteSpace: 'pre-line' },
      },
    },
    processedChildren,
  );
};
//# sourceMappingURL=FormItem.js.map
