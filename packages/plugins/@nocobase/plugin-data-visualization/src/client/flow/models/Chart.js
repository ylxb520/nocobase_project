/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { forwardRef, useState } from 'react';
import ECharts from './ECharts';
import { Empty, Result, Typography, Spin } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';
import { useT } from '../../locale';
const { Paragraph, Text } = Typography;
const ErrorFallback = ({ error }) => {
  const t = useT();
  return React.createElement(
    'div',
    { style: { backgroundColor: 'white' } },
    React.createElement(
      Result,
      { status: 'error', title: t('Render Failed'), subTitle: t('Please check the configuration.') },
      React.createElement(
        Paragraph,
        { copyable: true },
        React.createElement(
          Text,
          { type: 'danger', style: { whiteSpace: 'pre-line', textAlign: 'center' } },
          error.message,
        ),
      ),
    ),
  );
};
export const Chart = forwardRef(({ option, dataSource, onRefReady, loading }, ref) => {
  const [errorKey, setErrorKey] = useState(0);
  const t = useT();
  if (loading) {
    return React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 400 } },
      React.createElement(Spin, null),
    );
  }
  if (!option || !dataSource) {
    return React.createElement(Empty, {
      image: Empty.PRESENTED_IMAGE_SIMPLE,
      description: t('Please configure chart'),
    });
  }
  return React.createElement(
    ErrorBoundary,
    {
      onError: console.error,
      FallbackComponent: ErrorFallback,
      onReset: () => {
        setErrorKey((v) => v + 1);
      },
      resetKeys: [option],
    },
    React.createElement(ECharts, { key: errorKey, ref: ref, onRefReady: onRefReady, option: option }),
  );
});
//# sourceMappingURL=Chart.js.map
