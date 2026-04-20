/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { LoadingOutlined } from '@ant-design/icons';
import { connect, mapProps, mapReadPretty } from '@formily/react';
import { Icon, StablePopover, css } from '@nocobase/client';
import { Select as AntdSelect } from 'antd';
import React from 'react';
import { lang } from '../locale';
import { ReadPretty } from './ReadPretty';
const { Option, OptGroup } = AntdSelect;
const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes((input || '').toLowerCase());
const InternalSelect = connect(
  (props) => {
    const { ...others } = props;
    const { options, ...othersProps } = { ...others };
    const mode = props.mode || props.multiple ? 'multiple' : undefined;
    const group1 = options.filter((option) => option.group === 2);
    const group2 = options.filter((option) => option.group === 1);
    return React.createElement(
      AntdSelect,
      {
        showSearch: true,
        filterOption: filterOption,
        allowClear: true,
        ...othersProps,
        onChange: (changed) => {
          props.onChange?.(changed === undefined ? null : changed);
        },
        mode: mode,
      },
      React.createElement(
        OptGroup,
        { label: lang('Basic charts') },
        group1.map((option) =>
          React.createElement(
            Option,
            { key: option.key, value: option.key, label: lang(option.title) },
            React.createElement(
              StablePopover,
              {
                placement: 'right',
                zIndex: 99999999999,
                content: () =>
                  React.createElement(
                    'span',
                    null,
                    lang(option?.description)
                      ?.split(',')
                      .map((item) => React.createElement('div', { key: item }, item)),
                  ),
                trigger: 'hover',
              },
              React.createElement(
                'div',
                {
                  className: css`
                    display: flex;
                    gap: 4px;
                    align-items: center;
                  `,
                },
                React.createElement(Icon, { type: option.iconId }),
                React.createElement('span', { role: 'img', 'aria-label': lang(option.title) }, lang(option.title)),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        OptGroup,
        { label: lang('More charts') },
        group2.map((option) =>
          React.createElement(
            Option,
            { key: option.key, value: option.key, label: lang(option.title) },
            React.createElement(
              StablePopover,
              {
                placement: 'right',
                zIndex: 99999999999,
                content: () =>
                  React.createElement(
                    'span',
                    null,
                    lang(option?.description)
                      ?.split(',')
                      .map((item) => React.createElement('div', { key: item }, item)),
                  ),
                trigger: 'hover',
              },
              React.createElement(
                'div',
                {
                  className: css`
                    display: flex;
                    gap: 4px;
                    align-items: center;
                  `,
                },
                React.createElement(Icon, { type: option.iconId }),
                React.createElement('span', { role: 'img', 'aria-label': lang(option.title) }, lang(option.title)),
              ),
            ),
          ),
        ),
      ),
    );
  },
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon:
          field?.['loading'] || field?.['validating'] ? React.createElement(LoadingOutlined, null) : props?.suffixIcon,
      };
    },
  ),
  mapReadPretty(ReadPretty),
);
export const CustomSelect = InternalSelect;
CustomSelect.ReadPretty = ReadPretty;
export default CustomSelect;
//# sourceMappingURL=CustomSelect.js.map
