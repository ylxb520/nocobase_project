/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { createMiddleware } from 'langchain';
import { AIEmployee } from '../ai-employee';
import { ToolsEntry } from '@nocobase/ai';
export declare const toolInteractionMiddleware: (
  aiEmployee: AIEmployee,
  tools: ToolsEntry[],
) => import('langchain/dist/agents/middleware/types.cjs').AgentMiddleware<
  undefined,
  import('zod/v3').ZodObject<
    {
      interruptOn: import('zod/v3').ZodOptional<
        import('zod/v3').ZodRecord<
          import('zod/v3').ZodString,
          import('zod/v3').ZodUnion<
            [
              import('zod/v3').ZodBoolean,
              import('zod/v3').ZodObject<
                {
                  allowedDecisions: import('zod/v3').ZodArray<
                    import('zod/v3').ZodEnum<['approve', 'edit', 'reject']>,
                    'many'
                  >;
                  description: import('zod/v3').ZodOptional<
                    import('zod/v3').ZodUnion<
                      [
                        import('zod/v3').ZodString,
                        import('zod/v3').ZodFunction<
                          import('zod/v3').ZodTuple<
                            [
                              import('zod/v3').ZodType<
                                import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                                import('zod/v3').ZodTypeDef,
                                import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>
                              >,
                              import('zod/v3').ZodType<
                                import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                                import('zod/v3').ZodTypeDef,
                                import('langchain/dist/agents/runtime.cjs').AgentBuiltInState
                              >,
                              import('zod/v3').ZodType<
                                import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                                import('zod/v3').ZodTypeDef,
                                import('langchain/dist/agents/runtime.cjs').Runtime<unknown>
                              >,
                            ],
                            import('zod/v3').ZodUnknown
                          >,
                          import('zod/v3').ZodUnion<
                            [import('zod/v3').ZodString, import('zod/v3').ZodPromise<import('zod/v3').ZodString>]
                          >
                        >,
                      ]
                    >
                  >;
                  argsSchema: import('zod/v3').ZodOptional<
                    import('zod/v3').ZodRecord<import('zod/v3').ZodString, import('zod/v3').ZodAny>
                  >;
                },
                'strip',
                import('zod/v3').ZodTypeAny,
                {
                  allowedDecisions: ('edit' | 'approve' | 'reject')[];
                  description?:
                    | string
                    | ((
                        args_0: import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                        args_1: import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                        args_2: import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                        ...args: unknown[]
                      ) => string | Promise<string>);
                  argsSchema?: Record<string, any>;
                },
                {
                  allowedDecisions: ('edit' | 'approve' | 'reject')[];
                  description?:
                    | string
                    | ((
                        args_0: import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                        args_1: import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                        args_2: import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                        ...args: unknown[]
                      ) => string | Promise<string>);
                  argsSchema?: Record<string, any>;
                }
              >,
            ]
          >
        >
      >;
      descriptionPrefix: import('zod/v3').ZodDefault<import('zod/v3').ZodString>;
    },
    'strip',
    import('zod/v3').ZodTypeAny,
    {
      interruptOn?: Record<
        string,
        | boolean
        | {
            allowedDecisions: ('edit' | 'approve' | 'reject')[];
            description?:
              | string
              | ((
                  args_0: import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                  args_1: import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                  args_2: import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                  ...args: unknown[]
                ) => string | Promise<string>);
            argsSchema?: Record<string, any>;
          }
      >;
      descriptionPrefix: string;
    },
    {
      interruptOn?: Record<
        string,
        | boolean
        | {
            allowedDecisions: ('edit' | 'approve' | 'reject')[];
            description?:
              | string
              | ((
                  args_0: import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                  args_1: import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                  args_2: import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                  ...args: unknown[]
                ) => string | Promise<string>);
            argsSchema?: Record<string, any>;
          }
      >;
      descriptionPrefix?: string;
    }
  >,
  {
    interruptOn?: Record<
      string,
      | boolean
      | {
          allowedDecisions: ('edit' | 'approve' | 'reject')[];
          description?:
            | string
            | ((
                args_0: import('@langchain/core/dist/messages/tool').ToolCall<string, Record<string, any>>,
                args_1: import('langchain/dist/agents/runtime.cjs').AgentBuiltInState,
                args_2: import('langchain/dist/agents/runtime.cjs').Runtime<unknown>,
                ...args: unknown[]
              ) => string | Promise<string>);
          argsSchema?: Record<string, any>;
        }
    >;
    descriptionPrefix: string;
  },
  readonly (import('@langchain/core/dist/tools').ClientTool | import('@langchain/core/dist/tools').ServerTool)[]
>;
export declare const toolCallStatusMiddleware: (aiEmployee: AIEmployee) => ReturnType<typeof createMiddleware>;
