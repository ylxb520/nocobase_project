/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { AIEmployee } from '../ai-employee';
import z from 'zod';
export declare const conversationMiddleware: (
  aiEmployee: AIEmployee,
  options: {
    providerName: string;
    model: string;
    messageId?: string;
    agentThread?: {
      sessionId: string;
      thread: number;
    };
  },
) => import('langchain/dist/agents/middleware/types.cjs').AgentMiddleware<
  z.ZodObject<
    {
      messageId: z.ZodOptional<z.ZodCoercedString<unknown>>;
      lastMessageIndex: z.ZodDefault<
        z.ZodObject<
          {
            lastHumanMessageIndex: z.ZodDefault<z.ZodNumber>;
            lastAIMessageIndex: z.ZodDefault<z.ZodNumber>;
            lastToolMessageIndex: z.ZodDefault<z.ZodNumber>;
            lastMessageIndex: z.ZodDefault<z.ZodNumber>;
          },
          z.core.$strip
        >
      >;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      ctx: z.ZodAny;
    },
    z.core.$strip
  >,
  {
    ctx: any;
  },
  readonly (import('@langchain/core/dist/tools').ClientTool | import('@langchain/core/dist/tools').ServerTool)[]
>;
