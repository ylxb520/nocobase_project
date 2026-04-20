/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { GetProp } from 'antd';
import { Bubble } from '@ant-design/x';
import { AIEmployee } from '../types';
export declare const defaultRoles: GetProp<typeof Bubble.List, 'roles'>;
export declare const aiEmployeeRole: (aiEmployee: AIEmployee) => {
  placement: string;
  typing: {
    step: number;
    interval: number;
  };
  variant: string;
  styles: {
    content: {
      width: string;
      margin: string;
      marginInlineEnd: number;
      minHeight: number;
    };
  };
  messageRender: (msg: any) => React.JSX.Element;
  loadingRender: () => React.JSX.Element;
};
