/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
/** Global embed container element ID */
export declare const GLOBAL_EMBED_CONTAINER_ID = 'nocobase-embed-container';
/** Dataset key used to signal embed replacement in progress (skip style reset on close) */
export declare const EMBED_REPLACING_DATA_KEY = 'nocobaseEmbedReplacing';
export declare function usePage(): (
  | React.JSX.Element
  | {
      open: (
        config: any,
        flowContext: any,
      ) => Promise<unknown> & {
        type: 'embed';
        inputArgs: any;
        preventClose: boolean;
        destroy: (result?: any) => void;
        update: (newConfig: any) => void;
        close: (result?: any, force?: boolean) => void;
        Header: React.FC<{
          title?: React.ReactNode;
          extra?: React.ReactNode;
        }>;
        Footer: React.FC<{
          children?: React.ReactNode;
        }>;
        setFooter: (footer: React.ReactNode) => void;
        setHeader: (header: { title?: React.ReactNode; extra?: React.ReactNode }) => void;
        navigation: any;
        readonly record: unknown;
      };
    }
)[];
