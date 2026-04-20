import React from 'react';
function Grid({ items, itemRender }) {
  return React.createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
    items.map((row, rowIdx) =>
      React.createElement(
        'div',
        { key: rowIdx, style: { display: 'flex', gap: 8 } },
        row.map((col, colIdx) =>
          React.createElement(
            'div',
            {
              key: colIdx,
              style: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: '1px solid #eee',
                padding: 8,
              },
            },
            col.map((uid, blockIdx) =>
              React.createElement('div', { style: { width: '100%' }, key: blockIdx }, itemRender(uid)),
            ),
          ),
        ),
      ),
    ),
  );
}
const items = [
  [
    // 第一行
    ['A', 'B'],
    ['C'], // 第一行的第二列一个区块
  ],
  [
    // 第二行
    ['D'],
    ['E', 'F'], // 第二行的第二列两个区块
  ],
];
function GridDemo() {
  return React.createElement(
    'div',
    null,
    React.createElement(Grid, {
      items: items,
      itemRender: (uid) => React.createElement('div', { style: { background: '#f5f5f5', padding: 4 } }, uid),
    }),
  );
}
export default GridDemo;
//# sourceMappingURL=grid.js.map
