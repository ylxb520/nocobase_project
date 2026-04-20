/**
 * defaultShowCode: false
 * title: 联动规则：左右均为 VariableInput，操作符根据左值类型动态变化
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, Select, Space, Typography, Input } from 'antd';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
// 联动规则的 FilterItem：左右两侧均为 VariableInput
// - 左侧：VariableInput 选择触发条件（字段/变量）
// - 中间：操作符（等于、不等于等）
// - 右侧：VariableInput 选择目标值（支持变量、常量、Null）
const LinkageRuleFilterItem = observer(({ value }) => {
  const flowContext = React.useMemo(() => {
    const ctx = new FlowContext();
    // 模拟表单字段上下文（多种数据类型）
    ctx.defineProperty('form', {
      value: {
        name: 'John',
        age: 25,
        active: true,
        createdAt: '2024-01-01',
        score: 85.5,
      },
      meta: {
        title: 'Form Fields',
        type: 'object',
        properties: {
          name: { title: 'Name', type: 'string' },
          age: { title: 'Age', type: 'number' },
          active: { title: 'Active', type: 'boolean' },
          createdAt: { title: 'Created At', type: 'date' },
          score: { title: 'Score', type: 'number' },
        },
      },
    });
    // 模拟用户上下文
    ctx.defineProperty('user', {
      value: { id: 1, role: 'admin', department: 'sales' },
      meta: {
        title: 'User Context',
        type: 'object',
        properties: {
          id: { title: 'User ID', type: 'number' },
          role: { title: 'User Role', type: 'string' },
          department: { title: 'User Department', type: 'string' },
        },
      },
    });
    return ctx;
  }, []);
  const [leftMeta, setLeftMeta] = React.useState(null);
  // 根据左侧变量类型动态提供操作符选项
  const operatorOptions = React.useMemo(() => {
    const t = (s) => s;
    const type = leftMeta?.type;
    const commonEmpty = [
      { label: t('为空'), value: '$empty' },
      { label: t('非空'), value: '$notEmpty' },
    ];
    if (type === 'string') {
      return [
        { label: t('等于'), value: '$eq' },
        { label: t('不等于'), value: '$ne' },
        { label: t('包含'), value: '$includes' },
        { label: t('开头是'), value: '$startsWith' },
        { label: t('结尾是'), value: '$endsWith' },
        ...commonEmpty,
      ];
    }
    if (type === 'number') {
      return [
        { label: t('等于'), value: '$eq' },
        { label: t('不等于'), value: '$ne' },
        { label: t('大于'), value: '$gt' },
        { label: t('大于等于'), value: '$gte' },
        { label: t('小于'), value: '$lt' },
        { label: t('小于等于'), value: '$lte' },
        ...commonEmpty,
      ];
    }
    if (type === 'boolean') {
      return [
        { label: t('等于'), value: '$eq' },
        { label: t('不等于'), value: '$ne' },
      ];
    }
    if (type === 'date' || type === 'datetime') {
      return [
        { label: t('等于'), value: '$eq' },
        { label: t('不等于'), value: '$ne' },
        { label: t('晚于'), value: '$gt' },
        { label: t('晚于等于'), value: '$gte' },
        { label: t('早于'), value: '$lt' },
        { label: t('早于等于'), value: '$lte' },
        ...commonEmpty,
      ];
    }
    return [{ label: t('等于'), value: '$eq' }, { label: t('不等于'), value: '$ne' }, ...commonEmpty];
  }, [leftMeta]);
  const isRightInputDisabled = value.operator === '$empty' || value.operator === '$notEmpty';
  // 右侧 VariableInput 的 metaTree：添加 Null 和 Constant 选项
  const rightMetaTree = React.useCallback(() => {
    const baseMetaTree = flowContext.getPropertyMetaTree();
    // 添加 Null 选项
    baseMetaTree.splice(0, 0, {
      name: 'Null',
      title: 'Null',
      type: 'null',
      paths: ['Null'],
      render: () => React.createElement(Input, { readOnly: true, placeholder: '<Null>', style: { color: '#999' } }),
    });
    // 添加 Constant 选项
    baseMetaTree.splice(1, 0, {
      name: 'Constant',
      title: 'Constant',
      type: 'string',
      paths: ['Constant'],
      render: () => React.createElement(Input, { placeholder: '\u8F93\u5165\u5E38\u91CF\u503C' }),
    });
    return baseMetaTree;
  }, [flowContext]);
  // 右侧 VariableInput 的转换器
  const rightConverters = {
    resolveValueFromPath: (item) => {
      if (item?.paths[0] === 'Null') return null;
      if (item?.paths[0] === 'Constant') return '';
      return undefined;
    },
  };
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(VariableInput, {
      value: value.leftValue,
      onChange: (variableValue, meta) => {
        value.leftValue = variableValue;
        setLeftMeta(meta || null);
        // 左值变化时，重置操作符和右值
        const nextOp = (operatorOptions && operatorOptions[0]?.value) || '';
        value.operator = nextOp;
        value.rightValue = '';
      },
      metaTree: () => flowContext.getPropertyMetaTree(),
      style: { width: 200 },
    }),
    React.createElement(Select, {
      style: { width: 120 },
      value: value.operator || undefined,
      onChange: (v) => (value.operator = v),
      options: operatorOptions,
      placeholder: '\u64CD\u4F5C\u7B26',
      disabled: !value.leftValue,
    }),
    React.createElement(VariableInput, {
      value: value.rightValue,
      onChange: (v) => (value.rightValue = v),
      metaTree: rightMetaTree,
      converters: rightConverters,
      style: { width: 240 },
      placeholder: '\u9009\u62E9\u76EE\u6807\u503C\u6216\u8F93\u5165\u5E38\u91CF',
      disabled: !value.leftValue || !value.operator || isRightInputDisabled,
    }),
  );
});
const { Text } = Typography;
class PluginLinkageRuleDemo extends Plugin {
  async load() {
    const Demo = observer(() => {
      const linkageRule = React.useMemo(
        () =>
          observable({
            logic: '$and',
            items: [{ leftValue: '', operator: '', rightValue: '' }],
          }),
        [],
      );
      const ruleObject = transformFilter(linkageRule);
      return React.createElement(
        'div',
        { style: { padding: 16 } },
        React.createElement(
          Space,
          { direction: 'vertical', size: 'large', style: { width: '100%' } },
          React.createElement(
            Card,
            {
              size: 'small',
              title:
                '\u8054\u52A8\u89C4\u5219\uFF1A\u64CD\u4F5C\u7B26\u6839\u636E\u5DE6\u4FA7\u53D8\u91CF\u7C7B\u578B\u52A8\u6001\u53D8\u5316',
            },
            React.createElement(FilterGroup, { value: linkageRule, FilterItem: LinkageRuleFilterItem }),
          ),
          React.createElement(
            Card,
            { size: 'small', title: '\u8F6C\u6362\u540E\u7684\u89C4\u5219\u5BF9\u8C61\uFF08transformFilter\uFF09' },
            React.createElement('pre', { style: { marginTop: 8 } }, JSON.stringify(ruleObject, null, 2)),
          ),
        ),
      );
    });
    this.router.add('root', { path: '/', element: React.createElement(Demo, null) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginLinkageRuleDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=linkage-rule.js.map
