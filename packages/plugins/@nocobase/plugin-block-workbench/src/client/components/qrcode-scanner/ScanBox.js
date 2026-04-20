/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
export function ScanBox({ style = {} }) {
  const commonStyle = {
    position: 'absolute',
    backgroundColor: 'rgb(255, 255, 255)',
  };
  return React.createElement(
    'div',
    { id: 'qr-scan-box', style: { boxSizing: 'border-box', inset: '0px', ...style } },
    React.createElement('div', { style: { width: '40px', height: '5px', top: '-5px', left: '0px', ...commonStyle } }),
    React.createElement('div', { style: { width: '40px', height: '5px', top: '-5px', right: '0px', ...commonStyle } }),
    React.createElement('div', {
      style: { width: '40px', height: '5px', bottom: '-5px', left: '0px', ...commonStyle },
    }),
    React.createElement('div', {
      style: { width: '40px', height: '5px', bottom: '-5px', right: '0px', ...commonStyle },
    }),
    React.createElement('div', { style: { width: '5px', height: '45px', top: '-5px', left: '-5px', ...commonStyle } }),
    React.createElement('div', {
      style: { width: '5px', height: '45px', bottom: '-5px', left: '-5px', ...commonStyle },
    }),
    React.createElement('div', { style: { width: '5px', height: '45px', top: '-5px', right: '-5px', ...commonStyle } }),
    React.createElement('div', {
      style: { width: '5px', height: '45px', bottom: '-5px', right: '-5px', ...commonStyle },
    }),
  );
}
//# sourceMappingURL=ScanBox.js.map
