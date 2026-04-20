/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
interface CommentBlockDecoratorContextType {
  createAble?: boolean;
  editAble?: boolean;
  deleteAble?: boolean;
  setCreateAble?: (create: boolean) => void;
  setEditAble?: (create: boolean) => void;
  setDeleteAble?: (create: boolean) => void;
}
export declare function CommentBlockDecoratorContextProvider(props: { children: React.ReactNode }): React.JSX.Element;
export declare function useCommentBlockDescoratorContext(): CommentBlockDecoratorContextType;
export {};
