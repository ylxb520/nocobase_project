/**
 * defaultShowCode: false
 * title: 右侧为 VariableInput（支持变量或静态值）
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, Select, Space, Divider, Typography } from 'antd';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
// 右侧显示 VariableInput（showValueComponent=true），可选择变量或输入静态值
// - 左侧：VariableInput（showValueComponent=false）选择上下文变量
// - 中间：操作符
// - 右侧：VariableInput（showValueComponent=true），metaTree 动态依赖左侧值
const VariableRightFilterItem = observer(({ value }) => {
  const flowContext = React.useMemo(() => {
    const ctx = new FlowContext();
    ctx.defineProperty('user', {
      value: { id: 1, name: 'Alice', email: 'alice@example.com' },
      meta: {
        title: 'User',
        type: 'object',
        properties: {
          id: { title: 'ID', type: 'number' },
          name: { title: 'Name', type: 'string' },
          email: { title: 'Email', type: 'string' },
        },
      },
    });
    ctx.defineProperty('org', {
      value: { id: 9, title: 'Sales' },
      meta: {
        title: 'Org',
        type: 'object',
        properties: { id: { title: 'ID', type: 'number' }, title: { title: 'Title', type: 'string' } },
      },
    });
    ctx.defineProperty('now', {
      value: new Date().toISOString(),
      meta: { title: 'Now', type: 'string' },
    });
    return ctx;
  }, []);
  const [leftMeta, setLeftMeta] = React.useState(null);
  const operatorOptions = React.useMemo(
    () => [
      { label: '等于', value: '$eq' },
      { label: '不等于', value: '$ne' },
      { label: '包含', value: '$includes' },
    ],
    [],
  );
  // 右侧 VariableInput 的 metaTree：
  // - 若左侧已选择变量，则取其对应子树（例如选择 {{ ctx.user }}，右侧就建议从 user 的字段中选）
  // - 否则提供整个 ctx 的 metaTree
  const rightMetaTree = React.useCallback(() => {
    if (value.leftValue) {
      // 传入左侧变量表达式，获取子树
      return flowContext.getPropertyMetaTree(value.leftValue);
    }
    return flowContext.getPropertyMetaTree();
  }, [flowContext, value.leftValue]);
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(VariableInput, {
      value: value.leftValue,
      onChange: (variableValue, meta) => {
        value.leftValue = variableValue;
        setLeftMeta(meta || null);
        value.operator = operatorOptions?.[0]?.value || '';
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
      metaTree: rightMetaTree,
      showValueComponent: true,
      style: { width: 260 },
    }),
  );
});
const { Text } = Typography;
class PluginVariableRightDemo extends Plugin {
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
                '\u81EA\u5B9A\u4E49 FilterItem\uFF1A\u53F3\u4FA7\u4E3A VariableInput\uFF08\u53D8\u91CF\u6216\u9759\u6001\u503C\uFF09',
            },
            React.createElement(FilterGroup, { value: filter, FilterItem: VariableRightFilterItem }),
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
  plugins: [PluginVariableRightDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=variable-right-input.js.map
