/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import * as React from 'react';
export declare function useDialog(): (
  | React.JSX.Element
  | {
      open: (
        config: any,
        flowContext: any,
      ) => Promise<unknown> & {
        type: 'dialog';
        inputArgs: any;
        preventClose: boolean;
        destroy: (result?: any) => void;
        update: (newConfig: any) => void;
        close: (result?: any, force?: boolean) => void;
        Footer: React.FC<{
          children?: React.ReactNode;
        }>;
        Header: React.FC<{
          title?: React.ReactNode;
          extra?: React.ReactNode;
        }>;
        setFooter: (footer: React.ReactNode) => void;
        setHeader: (header: { title?: React.ReactNode; extra?: React.ReactNode }) => void;
        navigation: any;
        readonly record: unknown;
      };
    }
)[];
