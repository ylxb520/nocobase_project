/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { SchemaInitializer } from '@nocobase/client';
import React from 'react';
export declare function UpdateCommentActionButton(): React.JSX.Element;
export declare function UpdateCommentActionInitializer(props: any): React.JSX.Element;
export declare function QuoteReplyCommentActionButton(): React.JSX.Element;
export declare function QuoteReplyCommentActionInitializer(props: any): React.JSX.Element;
export declare const commentItemActionInitializers: SchemaInitializer<import('antd').ButtonProps, {}>;
