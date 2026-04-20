/**
 * defaultShowCode: false
 * title: 基础用法
 */
import React from 'react';
import { Application, Plugin, FilterGroup } from '@nocobase/client';
import { transformFilter } from '@nocobase/utils/client';
import { observer } from '@formily/reactive-react';
import { observable } from '@formily/reactive';
import { Card, Divider, Input, Select, Space, Typography } from 'antd';
const { Text } = Typography;
// 一个最简 FilterItem，直接修改传入的响应式 value
const BasicFilterItem = observer(({ value }) => {
  return React.createElement(
    Space,
    { size: 8 },
    React.createElement(Input, {
      placeholder: '\u5B57\u6BB5\u540D\uFF0C\u5982 name',
      style: { width: 140 },
      value: value.path,
      onChange: (e) => (value.path = e.target.value),
    }),
    React.createElement(Select, {
      style: { width: 120 },
      value: value.operator,
      onChange: (v) => (value.operator = v),
      options: [
        { label: '等于($eq)', value: '$eq' },
        { label: '不等于($ne)', value: '$ne' },
        { label: '大于($gt)', value: '$gt' },
        { label: '小于($lt)', value: '$lt' },
        { label: '包含($includes)', value: '$includes' },
      ],
    }),
    React.createElement(Input, {
      placeholder: '\u503C\uFF0C\u5982 John',
      style: { width: 160 },
      value: value.value,
      onChange: (e) => (value.value = e.target.value),
    }),
  );
});
class PluginFilterGroupBasic extends Plugin {
  async load() {
    const Demo = observer(() => {
      // 外部维护一个响应式的 FilterGroup 值
      const filter = React.useMemo(
        () =>
          observable({
            logic: '$and',
            items: [
              { path: 'name', operator: '$eq', value: 'John' },
              { path: 'age', operator: '$gt', value: 18 },
            ],
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
            { size: 'small', title: 'FilterGroup' },
            React.createElement(FilterGroup, { value: filter, FilterItem: BasicFilterItem }),
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
  plugins: [PluginFilterGroupBasic],
});
export default app.getRootComponent();
//# sourceMappingURL=filter-group-basic.js.map
