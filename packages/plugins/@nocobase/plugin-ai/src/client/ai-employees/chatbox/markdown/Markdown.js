/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { css } from '@emotion/css';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { lazy } from '@nocobase/client';
import { Code } from './Code';
import { Form } from './Form';
const { Echarts } = lazy(() => import('./ECharts'), 'Echarts');
export const Markdown = ({ message }) => {
  const tagIndexes = {};
  const getIndex = (tagName) => {
    if (!(tagName in tagIndexes)) {
      tagIndexes[tagName] = -1;
    }
    return ++tagIndexes[tagName];
  };
  return React.createElement(
    'div',
    {
      className: css`
        margin-bottom: -1em;
      `,
    },
    React.createElement(
      ReactMarkdown,
      {
        components: {
          code: (props) => React.createElement(Code, { ...props, message: message }),
          form: (props) => React.createElement(Form, { ...props, message: message }),
          // @ts-ignore
          echarts: (props) => {
            return React.createElement(Echarts, { ...props, index: getIndex('echarts'), message: message });
          },
          // collections: (props) => {
          //   return <Collections {...props} message={message} />;
          // },
        },
        rehypePlugins: [
          rehypeRaw,
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              tagNames: [...defaultSchema.tagNames, 'echarts', 'form', 'collections'],
              attributes: {
                ...defaultSchema.attributes,
                form: ['uid', 'datasource', 'collection'],
              },
            },
          ],
        ],
        remarkPlugins: [remarkGfm],
      },
      message.content,
    ),
  );
};
//# sourceMappingURL=Markdown.js.map
