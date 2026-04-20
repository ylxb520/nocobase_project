/**
 * defaultShowCode: false
 * title: 自定义 FilterItem
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, DatePicker, Input, Select, Space } from 'antd';
// 一个示例性的自定义 FilterItem：
// - 根据 operator 渲染不同的右侧输入组件（文本/日期）
// - 简单演示如何扩展交互
const MyFilterItem = observer(({ value }) => {
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(Input, {
      placeholder: '\u5B57\u6BB5\u540D\uFF0C\u5982 createdAt',
      style: { width: 160 },
      value: value.leftValue,
      onChange: (e) => (value.leftValue = e.target.value),
    }),
    React.createElement(Select, {
      style: { width: 160 },
      value: value.operator,
      onChange: (v) => (value.operator = v),
      options: [
        { label: '等于($eq)', value: '$eq' },
        { label: '不等于($ne)', value: '$ne' },
        { label: '大于($gt)', value: '$gt' },
        { label: '小于($lt)', value: '$lt' },
        { label: '日期等于($dateEq)', value: '$dateEq' },
      ],
    }),
    value.operator === '$dateEq'
      ? React.createElement(DatePicker, { style: { width: 180 }, onChange: (_, str) => (value.rightValue = str) })
      : React.createElement(Input, {
          placeholder: '\u503C',
          style: { width: 180 },
          value: value.rightValue,
          onChange: (e) => (value.rightValue = e.target.value),
        }),
  );
});
class PluginCustomFilterItemDemo extends Plugin {
  async load() {
    const Demo = observer(() => {
      const filter = React.useMemo(
        () =>
          observable({
            logic: '$and',
            items: [
              { leftValue: 'createdAt', operator: '$dateEq', rightValue: '' },
              { leftValue: 'status', operator: '$eq', rightValue: 'active' },
            ],
          }),
        [],
      );
      return React.createElement(
        'div',
        { style: { padding: 16 } },
        React.createElement(
          Card,
          { size: 'small', title: '\u4F7F\u7528\u81EA\u5B9A\u4E49 FilterItem' },
          React.createElement(FilterGroup, { value: filter, FilterItem: MyFilterItem }),
        ),
      );
    });
    this.router.add('root', { path: '/', element: React.createElement(Demo, null) });
  }
}
const app = new Application({
  router: { type: 'memory', initialEntries: ['/'] },
  plugins: [PluginCustomFilterItemDemo],
});
export default app.getRootComponent();
//# sourceMappingURL=custom-filter-item-basic.js.map
