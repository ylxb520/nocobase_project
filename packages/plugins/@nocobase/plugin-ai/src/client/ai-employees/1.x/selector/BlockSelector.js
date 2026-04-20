/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Button } from 'antd';
import { useT } from '../../../locale';
import { BuildOutlined } from '@ant-design/icons';
import { useAISelectionContext } from './AISelectorProvider';
import { useField } from '@formily/react';
import { CloseCircleOutlined, PauseOutlined } from '@ant-design/icons';
export const BlockSelector = ({ onSelect }) => {
  const t = useT();
  const { startSelect, stopSelect } = useAISelectionContext();
  const [selecting, setSelecting] = React.useState(false);
  const field = useField();
  return React.createElement(
    Button,
    {
      variant: 'dashed',
      color: 'primary',
      icon: React.createElement(BuildOutlined, null),
      size: 'small',
      onClick: () => {
        if (selecting) {
          setSelecting(false);
          stopSelect();
          return;
        }
        setSelecting(true);
        startSelect('blocks', {
          onSelect: (ctx) => {
            onSelect?.(ctx);
            field.value = ctx.uid;
            setSelecting(false);
          },
        });
      },
    },
    selecting
      ? React.createElement(React.Fragment, null, t('Selecting...'), ' ', React.createElement(PauseOutlined, null))
      : field.value
      ? React.createElement(
          React.Fragment,
          null,
          field.value,
          ' ',
          React.createElement(CloseCircleOutlined, {
            onClick: (e) => {
              e.stopPropagation();
              field.value = null;
            },
          }),
        )
      : t('Select block'),
  );
};
//# sourceMappingURL=BlockSelector.js.map
