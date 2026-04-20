import { ISchema } from '@nocobase/client';
interface GetSchemaOptions {
  dataSource?: string;
  collection?: string;
  association?: string;
  isEdit?: boolean;
  stepTitle?: string;
  isCusomeizeCreate?: boolean;
  isCurrent?: boolean;
}
export declare function getStepsFormSchema(options: GetSchemaOptions): ISchema;
interface GetStepsFormStepSchemaOptions extends GetSchemaOptions {
  title: string;
}
export declare function getStepsFormStepSchema({ title }: GetStepsFormStepSchemaOptions): {
  type: string;
  name: string;
  'x-component': string;
  'x-component-props': {
    title: string;
    uid: string;
  };
  properties: {
    step: {
      type: string;
      'x-component': string;
      'x-component-props': {
        uid: string;
      };
      properties: {
        grid: {
          type: string;
          'x-component': string;
          'x-initializer': string;
          properties: {};
        };
      };
    };
  };
};
export {};
