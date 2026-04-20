/**
 * defaultShowCode: false
 * title: 右侧输入根据左值类型动态渲染
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, DatePicker, Input, InputNumber, Select, Space } from 'antd';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
// 根据左值的类型动态渲染右侧输入组件，并动态提供操作符
const DynamicRightFilterItem = observer(({ value }) => {
  const flowContext = React.useMemo(() => {
    const ctx = new FlowContext();
    ctx.defineProperty('user', {
      value: { id: 1, name: 'Alice', age: 20, active: true, createdAt: '2024-07-01' },
      meta: {
        title: 'User',
        type: 'object',
        properties: {
          name: { title: 'Name', type: 'string' },
          age: { title: 'Age', type: 'number' },
          active: { title: 'Active', type: 'boolean' },
          createdAt: { title: 'Created At', type: 'date' },
        },
      },
    });
    ctx.defineProperty('org', {
      value: { title: 'Sales' },
      meta: { title: 'Org', type: 'object', properties: { title: { title: 'Title', type: 'string' } } },
    });
    return ctx;
  }, []);
  const [leftMeta, setLeftMeta] = React.useState(null);
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
  const RightInput = React.useMemo(() => {
    const type = leftMeta?.type;
    if (type === 'number') return 'number';
    if (type === 'boolean') return 'boolean';
    if (type === 'date' || type === 'datetime') return 'date';
    return 'string';
  }, [leftMeta]);
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
    RightInput === 'number'
      ? React.createElement(InputNumber, {
          style: { width: 200 },
          value: typeof value.rightValue === 'number' ? value.rightValue : undefined,
          onChange: (num) => (value.rightValue = num),
          disabled: !value.leftValue || !value.operator || isRightInputDisabled,
        })
      : RightInput === 'boolean'
      ? React.createElement(Select, {
          style: { width: 200 },
          value: value.rightValue,
          onChange: (v) => (value.rightValue = v),
          options: [
            { label: 'true', value: true },
            { label: 'false', value: false },
          ],
          disabled: !value.leftValue || !value.operator || isRightInputDisabled,
        })
      : RightInput === 'date'
      ? React.createElement(DatePicker, {
          style: { width: 200 },
          onChange: (_, str) => (value.rightValue = str),
          disabled: !value.leftValue || !value.operator || isRightInputDisabled,
        })
      : React.createElement(Input, {
          placeholder: '\u503C',
          style: { width: 200 },
          value: value.rightValue,
          onChange: (e) => (value.rightValue = e.target.value),
          disabled: !value.leftValue || !value.operator || isRightInputDisabled,
        }),
  );
});
class PluginDynamicRightDemo extends Plugin {
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
              title:
                '\u81EA\u5B9A\u4E49 FilterItem\uFF1A\u53F3\u4FA7\u8F93\u5165\u6839\u636E\u5DE6\u503C\u7C7B\u578B\u52A8\u6001\u6E32\u67D3',
            },
            React.createElement(FilterGroup, { value: filter, FilterItem: DynamicRightFilterItem }),
          ),
          React.createElement(
            Card,
            { size: 'small', title: '\u8F6C\u6362\u540E\u7684\u67E5\u8BE2\u5BF9\u8C61\uFF08transformFilter\uFF09' },
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
  plugins: [PluginDynamicRightDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=dynamic-right-input-by-left-type.js.map
