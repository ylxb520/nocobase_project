/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import type { FlowDefinitionOptions, StepDefinition } from './types';
import { IFlowRepository } from './flow-registry/BaseFlowRegistry';
export declare class FlowDefinition {
  protected flowRegistry: IFlowRepository;
  _steps: Map<string, FlowStep>;
  protected options: Omit<FlowDefinitionOptions, 'steps'>;
  constructor(options: FlowDefinitionOptions, flowRegistry: IFlowRepository);
  get key(): string;
  get title(): string;
  set title(title: string);
  get sort(): number;
  get on(): import('./types').FlowEvent<import('./models').FlowModel<import('./types').DefaultStructure>>;
  set on(on: import('./types').FlowEvent<import('./models').FlowModel<import('./types').DefaultStructure>>);
  get defaultParams():
    | Record<string, any>
    | ((ctx: import('./flowContext').FlowModelContext) =>
        | {
            [stepKey: string]: {
              [paramKey: string]: any;
            };
          }
        | Promise<{
            [stepKey: string]: {
              [paramKey: string]: any;
            };
          }>);
  get manual(): boolean;
  set manual(manual: boolean);
  get steps(): Record<string, StepDefinition<import('./models').FlowModel<import('./types').DefaultStructure>>>;
  getSortedSteps(): [string, FlowStep][];
  setOptions(flowOptions: Omit<FlowDefinitionOptions, 'key' | 'steps'>): void;
  getSteps(): Map<string, FlowStep>;
  mapSteps(callback: (step: FlowStep) => any): any[];
  getStep(stepKey: string): FlowStep;
  addStep(stepKey: string, flowStep: Omit<StepDefinition, 'key'>): FlowStep;
  setStep(stepKey: string, flowStep: StepDefinition): FlowStep;
  hasStep(stepKey: string): boolean;
  moveStep(sourceStepKey: string, targetStepKey: string): void;
  removeStep(stepKey: string): void;
  saveStep(step: FlowStep): Promise<void>;
  destroyStep(stepKey: string): Promise<void>;
  save(): Promise<void>;
  destroy(): Promise<void>;
  remove(): void;
  toData(): any;
  serialize(): any;
}
export declare class FlowStep {
  protected flowDef: FlowDefinition;
  protected options: StepDefinition;
  constructor(options: StepDefinition, flowDef: FlowDefinition);
  setOptions(stepOptions: Omit<StepDefinition, 'key' | 'flowKey'>): void;
  get key(): string;
  get flowKey(): string;
  get title(): string;
  set title(title: string);
  get uiSchema():
    | Record<
        string,
        import('@formily/json-schema').Stringify<{
          [key: symbol]: any;
          [key: `x-${string}`]: any;
          [key: `x-${number}`]: any;
          version?: string;
          name?: import('@formily/json-schema').SchemaKey;
          title?: any;
          description?: any;
          default?: any;
          readOnly?: boolean;
          writeOnly?: boolean;
          type?: import('@formily/json-schema').SchemaTypes;
          enum?: import('@formily/json-schema').SchemaEnum<any>;
          const?: any;
          multipleOf?: number;
          maximum?: number;
          exclusiveMaximum?: number;
          minimum?: number;
          exclusiveMinimum?: number;
          maxLength?: number;
          minLength?: number;
          pattern?: string | RegExp;
          maxItems?: number;
          minItems?: number;
          uniqueItems?: boolean;
          maxProperties?: number;
          minProperties?: number;
          required?: string | boolean | string[];
          format?: string;
          $ref?: string;
          $namespace?: string;
          definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
          properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
          items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
          additionalItems?: import('@formily/json-schema').Stringify<any>;
          patternProperties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
          additionalProperties?: import('@formily/json-schema').Stringify<any>;
          'x-value'?: any;
          'x-index'?: number;
          'x-pattern'?: any;
          'x-display'?: any;
          'x-validator'?: any;
          'x-decorator'?: any;
          'x-decorator-props'?: any;
          'x-component'?: any;
          'x-component-props'?: any;
          'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
          'x-content'?: any;
          'x-data'?: any;
          'x-visible'?: boolean;
          'x-hidden'?: boolean;
          'x-disabled'?: boolean;
          'x-editable'?: boolean;
          'x-read-only'?: boolean;
          'x-read-pretty'?: boolean;
          'x-compile-omitted'?: string[];
        }>
      >
    | ((
        ctx: import('./flowContext').FlowRuntimeContext<
          import('./models').FlowModel<import('./types').DefaultStructure>,
          any
        >,
      ) =>
        | Record<
            string,
            import('@formily/json-schema').Stringify<{
              [key: symbol]: any;
              [key: `x-${string}`]: any;
              [key: `x-${number}`]: any;
              version?: string;
              name?: import('@formily/json-schema').SchemaKey;
              title?: any;
              description?: any;
              default?: any;
              readOnly?: boolean;
              writeOnly?: boolean;
              type?: import('@formily/json-schema').SchemaTypes;
              enum?: import('@formily/json-schema').SchemaEnum<any>;
              const?: any;
              multipleOf?: number;
              maximum?: number;
              exclusiveMaximum?: number;
              minimum?: number;
              exclusiveMinimum?: number;
              maxLength?: number;
              minLength?: number;
              pattern?: string | RegExp;
              maxItems?: number;
              minItems?: number;
              uniqueItems?: boolean;
              maxProperties?: number;
              minProperties?: number;
              required?: string | boolean | string[];
              format?: string;
              $ref?: string;
              $namespace?: string;
              definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
              properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
              items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
              additionalItems?: import('@formily/json-schema').Stringify<any>;
              patternProperties?: import('@formily/json-schema').SchemaProperties<
                any,
                any,
                any,
                any,
                any,
                any,
                any,
                any
              >;
              additionalProperties?: import('@formily/json-schema').Stringify<any>;
              'x-value'?: any;
              'x-index'?: number;
              'x-pattern'?: any;
              'x-display'?: any;
              'x-validator'?: any;
              'x-decorator'?: any;
              'x-decorator-props'?: any;
              'x-component'?: any;
              'x-component-props'?: any;
              'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
              'x-content'?: any;
              'x-data'?: any;
              'x-visible'?: boolean;
              'x-hidden'?: boolean;
              'x-disabled'?: boolean;
              'x-editable'?: boolean;
              'x-read-only'?: boolean;
              'x-read-pretty'?: boolean;
              'x-compile-omitted'?: string[];
            }>
          >
        | Promise<
            Record<
              string,
              import('@formily/json-schema').Stringify<{
                [key: symbol]: any;
                [key: `x-${string}`]: any;
                [key: `x-${number}`]: any;
                version?: string;
                name?: import('@formily/json-schema').SchemaKey;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import('@formily/json-schema').SchemaTypes;
                enum?: import('@formily/json-schema').SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import('@formily/json-schema').Stringify<any>;
                patternProperties?: import('@formily/json-schema').SchemaProperties<
                  any,
                  any,
                  any,
                  any,
                  any,
                  any,
                  any,
                  any
                >;
                additionalProperties?: import('@formily/json-schema').Stringify<any>;
                'x-value'?: any;
                'x-index'?: number;
                'x-pattern'?: any;
                'x-display'?: any;
                'x-validator'?: any;
                'x-decorator'?: any;
                'x-decorator-props'?: any;
                'x-component'?: any;
                'x-component-props'?: any;
                'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
                'x-content'?: any;
                'x-data'?: any;
                'x-visible'?: boolean;
                'x-hidden'?: boolean;
                'x-disabled'?: boolean;
                'x-editable'?: boolean;
                'x-read-only'?: boolean;
                'x-read-pretty'?: boolean;
                'x-compile-omitted'?: string[];
              }>
            >
          >);
  get defaultParams(): Record<string, any>;
  set defaultParams(params: Record<string, any>);
  get use(): string;
  save(): Promise<void>;
  remove(): Promise<void>;
  destroy(): Promise<void>;
  serialize(): {
    flowKey: string;
    key?: string;
    isAwait?: boolean;
    use?: string;
    sort?: number;
    preset?: boolean;
    uiMode?:
      | import('./types').StepUIMode
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => import('./types').StepUIMode | Promise<import('./types').StepUIMode>);
    title?: string;
    uiSchema?:
      | Record<
          string,
          import('@formily/json-schema').Stringify<{
            [key: symbol]: any;
            [key: `x-${string}`]: any;
            [key: `x-${number}`]: any;
            version?: string;
            name?: import('@formily/json-schema').SchemaKey;
            title?: any;
            description?: any;
            default?: any;
            readOnly?: boolean;
            writeOnly?: boolean;
            type?: import('@formily/json-schema').SchemaTypes;
            enum?: import('@formily/json-schema').SchemaEnum<any>;
            const?: any;
            multipleOf?: number;
            maximum?: number;
            exclusiveMaximum?: number;
            minimum?: number;
            exclusiveMinimum?: number;
            maxLength?: number;
            minLength?: number;
            pattern?: string | RegExp;
            maxItems?: number;
            minItems?: number;
            uniqueItems?: boolean;
            maxProperties?: number;
            minProperties?: number;
            required?: string | boolean | string[];
            format?: string;
            $ref?: string;
            $namespace?: string;
            definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
            properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
            items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
            additionalItems?: import('@formily/json-schema').Stringify<any>;
            patternProperties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
            additionalProperties?: import('@formily/json-schema').Stringify<any>;
            'x-value'?: any;
            'x-index'?: number;
            'x-pattern'?: any;
            'x-display'?: any;
            'x-validator'?: any;
            'x-decorator'?: any;
            'x-decorator-props'?: any;
            'x-component'?: any;
            'x-component-props'?: any;
            'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
            'x-content'?: any;
            'x-data'?: any;
            'x-visible'?: boolean;
            'x-hidden'?: boolean;
            'x-disabled'?: boolean;
            'x-editable'?: boolean;
            'x-read-only'?: boolean;
            'x-read-pretty'?: boolean;
            'x-compile-omitted'?: string[];
          }>
        >
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) =>
          | Record<
              string,
              import('@formily/json-schema').Stringify<{
                [key: symbol]: any;
                [key: `x-${string}`]: any;
                [key: `x-${number}`]: any;
                version?: string;
                name?: import('@formily/json-schema').SchemaKey;
                title?: any;
                description?: any;
                default?: any;
                readOnly?: boolean;
                writeOnly?: boolean;
                type?: import('@formily/json-schema').SchemaTypes;
                enum?: import('@formily/json-schema').SchemaEnum<any>;
                const?: any;
                multipleOf?: number;
                maximum?: number;
                exclusiveMaximum?: number;
                minimum?: number;
                exclusiveMinimum?: number;
                maxLength?: number;
                minLength?: number;
                pattern?: string | RegExp;
                maxItems?: number;
                minItems?: number;
                uniqueItems?: boolean;
                maxProperties?: number;
                minProperties?: number;
                required?: string | boolean | string[];
                format?: string;
                $ref?: string;
                $namespace?: string;
                definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
                additionalItems?: import('@formily/json-schema').Stringify<any>;
                patternProperties?: import('@formily/json-schema').SchemaProperties<
                  any,
                  any,
                  any,
                  any,
                  any,
                  any,
                  any,
                  any
                >;
                additionalProperties?: import('@formily/json-schema').Stringify<any>;
                'x-value'?: any;
                'x-index'?: number;
                'x-pattern'?: any;
                'x-display'?: any;
                'x-validator'?: any;
                'x-decorator'?: any;
                'x-decorator-props'?: any;
                'x-component'?: any;
                'x-component-props'?: any;
                'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
                'x-content'?: any;
                'x-data'?: any;
                'x-visible'?: boolean;
                'x-hidden'?: boolean;
                'x-disabled'?: boolean;
                'x-editable'?: boolean;
                'x-read-only'?: boolean;
                'x-read-pretty'?: boolean;
                'x-compile-omitted'?: string[];
              }>
            >
          | Promise<
              Record<
                string,
                import('@formily/json-schema').Stringify<{
                  [key: symbol]: any;
                  [key: `x-${string}`]: any;
                  [key: `x-${number}`]: any;
                  version?: string;
                  name?: import('@formily/json-schema').SchemaKey;
                  title?: any;
                  description?: any;
                  default?: any;
                  readOnly?: boolean;
                  writeOnly?: boolean;
                  type?: import('@formily/json-schema').SchemaTypes;
                  enum?: import('@formily/json-schema').SchemaEnum<any>;
                  const?: any;
                  multipleOf?: number;
                  maximum?: number;
                  exclusiveMaximum?: number;
                  minimum?: number;
                  exclusiveMinimum?: number;
                  maxLength?: number;
                  minLength?: number;
                  pattern?: string | RegExp;
                  maxItems?: number;
                  minItems?: number;
                  uniqueItems?: boolean;
                  maxProperties?: number;
                  minProperties?: number;
                  required?: string | boolean | string[];
                  format?: string;
                  $ref?: string;
                  $namespace?: string;
                  definitions?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                  properties?: import('@formily/json-schema').SchemaProperties<any, any, any, any, any, any, any, any>;
                  items?: import('@formily/json-schema').SchemaItems<any, any, any, any, any, any, any, any>;
                  additionalItems?: import('@formily/json-schema').Stringify<any>;
                  patternProperties?: import('@formily/json-schema').SchemaProperties<
                    any,
                    any,
                    any,
                    any,
                    any,
                    any,
                    any,
                    any
                  >;
                  additionalProperties?: import('@formily/json-schema').Stringify<any>;
                  'x-value'?: any;
                  'x-index'?: number;
                  'x-pattern'?: any;
                  'x-display'?: any;
                  'x-validator'?: any;
                  'x-decorator'?: any;
                  'x-decorator-props'?: any;
                  'x-component'?: any;
                  'x-component-props'?: any;
                  'x-reactions'?: import('@formily/json-schema').SchemaReactions<any>;
                  'x-content'?: any;
                  'x-data'?: any;
                  'x-visible'?: boolean;
                  'x-hidden'?: boolean;
                  'x-disabled'?: boolean;
                  'x-editable'?: boolean;
                  'x-read-only'?: boolean;
                  'x-read-pretty'?: boolean;
                  'x-compile-omitted'?: string[];
                }>
              >
            >);
    defaultParams?:
      | Record<string, any>
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => Record<string, any> | Promise<Record<string, any>>);
    handler?: (
      ctx: import('./flowContext').FlowRuntimeContext<
        import('./models').FlowModel<import('./types').DefaultStructure>,
        any
      >,
      params: any,
    ) => any;
    beforeParamsSave?: (
      ctx: import('./flowContext').FlowSettingsContext<
        import('./models').FlowModel<import('./types').DefaultStructure>
      >,
      params: any,
      previousParams: any,
    ) => void | Promise<void>;
    afterParamsSave?: (
      ctx: import('./flowContext').FlowSettingsContext<
        import('./models').FlowModel<import('./types').DefaultStructure>
      >,
      params: any,
      previousParams: any,
    ) => void | Promise<void>;
    useRawParams?:
      | boolean
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => boolean | Promise<boolean>);
    scene?: import('./types').ActionScene | import('./types').ActionScene[];
    paramsRequired?: boolean;
    hideInSettings?:
      | boolean
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => boolean | Promise<boolean>);
    disabledInSettings?:
      | boolean
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => boolean | Promise<boolean>);
    disabledReasonInSettings?:
      | string
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) => string | Promise<string>);
    defineProperties?:
      | Record<string, import('./flowContext').PropertyOptions>
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) =>
          | Record<string, import('./flowContext').PropertyOptions>
          | Promise<Record<string, import('./flowContext').PropertyOptions>>);
    defineMethods?:
      | Record<
          string,
          (
            this: import('./flowContext').FlowRuntimeContext<
              import('./models').FlowModel<import('./types').DefaultStructure>,
              any
            >,
            ...args: any[]
          ) => any
        >
      | ((
          ctx: import('./flowContext').FlowRuntimeContext<
            import('./models').FlowModel<import('./types').DefaultStructure>,
            any
          >,
        ) =>
          | Record<
              string,
              (
                this: import('./flowContext').FlowRuntimeContext<
                  import('./models').FlowModel<import('./types').DefaultStructure>,
                  any
                >,
                ...args: any[]
              ) => any
            >
          | Promise<
              Record<
                string,
                (
                  this: import('./flowContext').FlowRuntimeContext<
                    import('./models').FlowModel<import('./types').DefaultStructure>,
                    any
                  >,
                  ...args: any[]
                ) => any
              >
            >);
  };
}
