/**
 * defaultShowCode: false
 * title: 变量作为左值（VariableInput on left）
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, Input, Select, Space } from 'antd';
import { FlowContext, VariableInput } from '@nocobase/flow-engine';
// 一个示例性的“变量作为左值”的 FilterItem：
// - 左侧使用 VariableInput（showValueComponent=false）选择上下文变量
// - 中间为操作符选择（静态集合）
// - 右侧为可替换的输入组件（此处用 Input）
const VariableLeftFilterItem = observer(({ value }) => {
  const flowContext = React.useMemo(() => {
    const ctx = new FlowContext();
    // 简单模拟上下文结构
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
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(VariableInput, {
      value: value.leftValue,
      onChange: (variableValue, meta) => {
        value.leftValue = variableValue;
        setLeftMeta(meta || null);
        // 重置 operator & rightValue
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
    React.createElement(Input, {
      placeholder: '\u503C',
      style: { width: 200 },
      value: value.rightValue,
      onChange: (e) => (value.rightValue = e.target.value),
      disabled: !value.leftValue || !value.operator,
    }),
  );
});
class PluginVariableLeftDemo extends Plugin {
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
            { size: 'small', title: '\u81EA\u5B9A\u4E49 FilterItem\uFF1A\u53D8\u91CF\u4F5C\u4E3A\u5DE6\u503C' },
            React.createElement(FilterGroup, { value: filter, FilterItem: VariableLeftFilterItem }),
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
  plugins: [PluginVariableLeftDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=context-filter-item-variable-left.js.map
