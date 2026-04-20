/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/// <reference types="react" />
import { Trigger } from '@nocobase/plugin-workflow/client';
export declare class AIEmployeeTrigger extends Trigger {
  sync: boolean;
  title: string;
  description: string;
  components: {
    ArrayItems: import('@formily/reactive-react').ReactFC<import('react').HTMLAttributes<HTMLDivElement>> &
      import('@formily/antd-v5').ArrayBaseMixins & {
        Item: import('@formily/reactive-react').ReactFC<
          import('react').HTMLAttributes<HTMLDivElement> & {
            type?: 'divide' | 'card';
          }
        >;
      };
    Parameter: import('react').FC<{}>;
    ParameterAddition: import('react').FC<{}>;
    EditParameter: import('react').FC<{}>;
    ParameterDesc: import('react').FC<{}>;
  };
  fieldset: {
    parameters: {
      type: string;
      'x-decorator': string;
      'x-component': string;
      title: string;
      description: string;
      required: boolean;
      items: {
        type: string;
        'x-decorator': string;
        properties: {
          left: {
            type: string;
            'x-component': string;
            properties: {
              sort: {
                type: string;
                'x-decorator': string;
                'x-component': string;
              };
              parameters: {
                type: string;
                'x-component': string;
                'x-component-props': {
                  style: {
                    width: string;
                  };
                };
              };
            };
          };
          right: {
            type: string;
            'x-component': string;
            properties: {
              desc: {
                type: string;
                'x-component': string;
              };
              edit: {
                type: string;
                'x-component': string;
              };
              remove: {
                type: string;
                'x-component': string;
                'x-component-props': {
                  style: {
                    padding: string;
                  };
                };
              };
            };
          };
        };
      };
      properties: {
        add: {
          type: string;
          'x-component': string;
        };
      };
    };
  };
  useVariables(config: any, options: any): any;
}
