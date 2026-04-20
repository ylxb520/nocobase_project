/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This program is offered under a commercial license.
 * For more information, see <https://www.nocobase.com/agreement>
 */
import React, { Dispatch, SetStateAction } from 'react';
export declare const DatabaseServerContext: React.Context<{
  options: any[];
  setOptions?: Dispatch<SetStateAction<any>>;
  refresh?: Function;
  initialOptions: any[];
}>;
export declare const ServerContext: React.Context<{
  item: object;
}>;
export declare const DatabaseServerSelect: React.MemoExoticComponent<
  import('@formily/react').ReactFC<Omit<any, 'ref'>>
>;
export declare const DatabaseServerSelectProvider: (props: any) => React.JSX.Element;
