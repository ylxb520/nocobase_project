/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
declare const Comment: {
  (): any;
  ActionBar: import('react').FunctionComponent<any>;
  List: import('react').FunctionComponent<any>;
  Item: import('react').MemoExoticComponent<
    import('@formily/reactive-react').ReactFC<
      {
        editing: boolean;
        setEditing: (editing: boolean) => void;
      } & {
        children?: import('react').ReactNode;
      }
    >
  >;
  Decorator: import('react').FunctionComponent<any>;
  Submit: typeof import('./Comment.Submit').CommentSubmit;
};
export { Comment };
