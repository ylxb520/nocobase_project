import React, { useMemo, useState } from 'react';
import { Card } from 'antd';
import { FlowContext, FlowContextProvider } from '@nocobase/flow-engine';
import { TextAreaWithContextSelector } from '../../../../../../src/flow/components/TextAreaWithContextSelector';
export default () => {
  const [value, setValue] = useState('Hello, {{ ctx.user.name }}');
  const ctx = useMemo(() => {
    const c = new FlowContext();
    c.defineProperty('user', {
      value: { name: 'Alice' },
      meta: {
        title: 'User',
        type: 'object',
        properties: { name: { title: 'Name', type: 'string' } },
      },
    });
    return c;
  }, []);
  return React.createElement(
    'div',
    { style: { padding: 16 } },
    React.createElement(
      Card,
      { size: 'small', title: '\u7B80\u5355\u793A\u4F8B' },
      React.createElement(
        FlowContextProvider,
        { context: ctx },
        React.createElement(TextAreaWithContextSelector, { value: value, onChange: setValue, rows: 2 }),
      ),
      React.createElement(
        'pre',
        { style: { marginTop: 12, background: '#f7f7f7', padding: 8, borderRadius: 4 } },
        value,
      ),
    ),
  );
};
//# sourceMappingURL=index.js.map
