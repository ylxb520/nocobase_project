/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { ActionModel } from '@nocobase/client';
import { FlowModelContext } from '@nocobase/flow-engine';
import { ButtonProps } from 'antd';
export declare class TestActionModel extends ActionModel {
  defaultProps: ButtonProps;
}
export declare class NestedActionModel extends ActionModel {
  static scene: import('@nocobase/client').ActionSceneType;
  static defineChildren(ctx: FlowModelContext): Promise<
    (
      | {
          key: string;
          label: string;
          useModel: string;
          createModelOptions: {
            props: {};
            stepParams: {
              buttonSettings: {
                general: {
                  children: string;
                  title?: undefined;
                };
              };
            };
          };
        }
      | {
          key: string;
          label: string;
          useModel: string;
          createModelOptions: {
            props: {};
            stepParams: {
              buttonSettings: {
                general: {
                  title: string;
                  children?: undefined;
                };
              };
            };
          };
        }
    )[]
  >;
}
