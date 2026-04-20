/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { FlowModelRenderer, useFlowModel } from '@nocobase/flow-engine';
import { List } from 'antd';
import React, { useState } from 'react';
import { observer } from '@formily/reactive-react';
import useStyles from './style';
import { CommentSubmit } from './CommentSubmit';
export const CommentList = observer((props) => {
  const { resource, handlePageChange, dataSource } = props;
  const { wrapSSR, hashId, componentCls } = useStyles();
  const [quoteContent, setQuoteContent] = useState('');
  const model = useFlowModel();
  model.context.defineMethod('setQuoteContent', (val) => {
    setQuoteContent(val);
  });
  return wrapSSR(
    React.createElement(
      'div',
      { className: `${componentCls} ${hashId}` },
      React.createElement(
        List,
        {
          ...props,
          pagination:
            resource?.getMeta()?.count > 0
              ? {
                  onChange: handlePageChange,
                  total: resource?.getMeta()?.count || 0,
                  pageSize: resource.getPageSize() || 10,
                  current: resource.getPage() || 1,
                }
              : false,
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
            },
          },
          dataSource?.length
            ? dataSource.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === dataSource.length - 1;
                return React.createElement(
                  'div',
                  {
                    key: index,
                    style: {
                      position: 'relative',
                      padding: `${isFirst ? 0 : '10px'} 0 ${isLast ? 0 : '10px'} 0`,
                    },
                  },
                  model.mapSubModels('items', (mol) => {
                    const fork = mol.createFork({}, `${item.id}-${item.content}`);
                    fork.context.defineProperty('record', {
                      get: () => item,
                      cache: false,
                    });
                    return React.createElement(FlowModelRenderer, { model: fork });
                  }),
                );
              })
            : null,
        ),
      ),
      React.createElement(CommentSubmit, { defaultValue: quoteContent }),
    ),
  );
});
//# sourceMappingURL=CommentList.js.map
