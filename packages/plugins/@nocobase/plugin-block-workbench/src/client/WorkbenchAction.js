/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { useFieldSchema } from '@formily/react';
import {
  Action,
  Icon,
  useComponent,
  withDynamicSchemaProps,
  ACLActionProvider,
  NAMESPACE_UI_SCHEMA,
} from '@nocobase/client';
import { css } from '@emotion/css';
import { Avatar } from 'antd';
import { List } from 'antd-mobile';
import { createStyles } from 'antd-style';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkbenchBlockContext } from './WorkbenchBlock';
import { WorkbenchLayout } from './workbenchBlockSettings';
const useStyles = createStyles(({ token, css }) => ({
  // 支持 css object 的写法
  action: css`
    display: flex;
    background-color: transparent;
    border: 0;
    height: auto;
    box-shadow: none;
    padding-top: 8px;
  `,
  avatar: css`
    width: 5em;
  `,
  title: css`
    margin-top: ${token.marginSM}px;
    width: 100%;
  `,
}));
function Button({ onlyIcon }) {
  const fieldSchema = useFieldSchema();
  const { icon, iconColor: backgroundColor } = fieldSchema['x-component-props'] || {};
  const { layout, ellipsis = true } = useContext(WorkbenchBlockContext);
  const { styles, cx } = useStyles();
  const { t } = useTranslation();
  const title = t(fieldSchema.title, { ns: NAMESPACE_UI_SCHEMA });
  const shouldShowTitle = !onlyIcon;
  if (layout === WorkbenchLayout.Grid) {
    return React.createElement(
      'div',
      { title: title, className: cx(styles.avatar) },
      React.createElement(Avatar, {
        style: { backgroundColor },
        size: 48,
        icon: React.createElement(Icon, { type: icon }),
      }),
      React.createElement(
        'div',
        {
          className: cx(styles.title),
          style: {
            whiteSpace: ellipsis ? 'nowrap' : 'normal',
            textOverflow: ellipsis ? 'ellipsis' : 'clip',
            overflow: ellipsis ? 'hidden' : 'visible',
          },
        },
        shouldShowTitle && title,
      ),
    );
  }
  return React.createElement('span', null, shouldShowTitle && title);
}
export const WorkbenchAction = withDynamicSchemaProps((props) => {
  const { className, targetComponent, iconColor, ...others } = props;
  const { styles, cx } = useStyles();
  const fieldSchema = useFieldSchema();
  const Component = useComponent(props?.targetComponent) || Action;
  const { layout = WorkbenchLayout.Grid } = fieldSchema.parent?.parent?.['x-component-props'] || {};
  if (layout === 'list') {
    const icon = fieldSchema['x-component-props']?.['icon'];
    const backgroundColor = fieldSchema['x-component-props']?.['iconColor'];
    return React.createElement(
      ACLActionProvider,
      null,
      React.createElement(Component, {
        className: cx(
          className,
          styles.action,
          'nb-action-panel',
          css`
            > span {
              width: 100%;
            }
            padding-top: 0px !important;
          `,
        ),
        ...others,
        onlyIcon: false,
        type: 'text',
        icon: null,
        title: React.createElement(
          List.Item,
          {
            prefix: React.createElement(Avatar, {
              style: { backgroundColor },
              icon: React.createElement(Icon, { type: icon }),
            }),
            onClick: () => {},
            style: { marginTop: '5px' },
          },
          React.createElement(Button, { onlyIcon: others?.onlyIcon }),
        ),
        confirmTitle: fieldSchema.title,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'rgb(255, 255, 255)',
        },
      }),
    );
  } else {
    return React.createElement(
      ACLActionProvider,
      null,
      React.createElement(Component, {
        className: cx(className, styles.action, 'nb-action-panel'),
        ...others,
        onlyIcon: false,
        type: 'text',
        icon: null,
        title: React.createElement(Button, { onlyIcon: others?.onlyIcon }),
        confirmTitle: fieldSchema.title,
        style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      }),
    );
  }
});
//# sourceMappingURL=WorkbenchAction.js.map
