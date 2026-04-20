/**
 * defaultShowCode: false
 * title: 数据范围场景（支持 Null 和 Constant）
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, Select, Space, Divider, Typography, Input } from 'antd';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
// 数据范围场景的 FilterItem：
// - 左侧：VariableInput（showValueComponent=false）选择上下文变量
// - 中间：操作符（根据左侧变量类型动态调整）
// - 右侧：VariableInput（默认 showValueComponent），支持变量、Null 和 Constant 选项
const DataScopeFilterItem = observer(({ value }) => {
  const flowContext = React.useMemo(() => {
    const ctx = new FlowContext();
    ctx.defineProperty('user', {
      value: { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, active: true },
      meta: {
        title: 'User',
        type: 'object',
        properties: {
          id: { title: 'ID', type: 'number' },
          name: { title: 'Name', type: 'string' },
          email: { title: 'Email', type: 'string' },
          age: { title: 'Age', type: 'number' },
          active: { title: 'Active', type: 'boolean' },
        },
      },
    });
    ctx.defineProperty('org', {
      value: { id: 9, title: 'Sales', type: 'department' },
      meta: {
        title: 'Organization',
        type: 'object',
        properties: {
          id: { title: 'ID', type: 'number' },
          title: { title: 'Title', type: 'string' },
          type: { title: 'Type', type: 'string' },
        },
      },
    });
    return ctx;
  }, []);
  const [leftMeta, setLeftMeta] = React.useState(null);
  // 根据左侧变量类型动态生成操作符选项
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
    return [{ label: t('等于'), value: '$eq' }, { label: t('不等于'), value: '$ne' }, ...commonEmpty];
  }, [leftMeta]);
  // 右侧 VariableInput 的 metaTree：添加 Null 和 Constant 选项
  const getRightMetaTree = React.useCallback(() => {
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
    baseMetaTree.splice(0, 0, {
      name: 'Constant',
      title: 'Constant',
      type: 'string',
      paths: ['Constant'],
      render: () => React.createElement(Input, { placeholder: '\u8F93\u5165\u5E38\u91CF\u503C' }),
    });
    return baseMetaTree;
  }, [flowContext]);
  // 右侧 VariableInput 的 converters
  const rightConverters = React.useMemo(
    () => ({
      resolveValueFromPath: (item) => {
        if (item?.paths[0] === 'Constant') return '';
        if (item?.paths[0] === 'Null') return null;
        return undefined;
      },
    }),
    [],
  );
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(VariableInput, {
      value: value.leftValue,
      onChange: (variableValue, meta) => {
        value.leftValue = variableValue;
        setLeftMeta(meta || null);
        // 左值变化时，重置 operator 与 rightValue
        const nextOp = (operatorOptions && operatorOptions[0]?.value) || '';
        value.operator = nextOp;
        value.rightValue = '';
      },
      metaTree: () => flowContext.getPropertyMetaTree(),
      showValueComponent: false,
    }),
    React.createElement(Select, {
      style: { width: 160 },
      value: value.operator || undefined,
      onChange: (v) => (value.operator = v),
      options: operatorOptions,
      placeholder: '\u9009\u62E9\u64CD\u4F5C\u7B26',
      disabled: !value.leftValue,
    }),
    React.createElement(VariableInput, {
      value: value.rightValue,
      onChange: (v) => (value.rightValue = v),
      metaTree: getRightMetaTree,
      converters: rightConverters,
      style: { width: 280 },
    }),
  );
});
const { Text } = Typography;
class PluginDataScopeDemo extends Plugin {
  async load() {
    const Demo = observer(() => {
      const filter = React.useMemo(
        () =>
          observable({
            logic: '$and',
            items: [{ leftValue: '', operator: '', rightValue: '' }],
          }),
        [],
      );
      const queryObject = transformFilter(filter);
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
              title: '\u6570\u636E\u8303\u56F4\u573A\u666F\uFF1A\u652F\u6301 Null \u548C Constant \u9009\u9879',
            },
            React.createElement(FilterGroup, { value: filter, FilterItem: DataScopeFilterItem }),
          ),
          React.createElement(
            Card,
            { size: 'small', title: '\u5F53\u524D\u503C' },
            React.createElement(Text, { type: 'secondary' }, 'FilterGroup \u503C\uFF08\u54CD\u5E94\u5F0F\uFF09'),
            React.createElement('pre', { style: { marginTop: 8 } }, JSON.stringify(filter, null, 2)),
            React.createElement(Divider, { style: { margin: '12px 0' } }),
            React.createElement(
              Text,
              { type: 'secondary' },
              '\u8F6C\u6362\u540E\u7684\u67E5\u8BE2\u5BF9\u8C61\uFF08transformFilter\uFF09',
            ),
            React.createElement('pre', { style: { marginTop: 8 } }, JSON.stringify(queryObject, null, 2)),
          ),
        ),
      );
    });
    this.router.add('root', { path: '/', element: React.createElement(Demo, null) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginDataScopeDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=data-scope-with-null-constant.js.map
