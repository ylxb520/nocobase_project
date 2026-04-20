/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { z } from 'zod';
export declare const ArgSchema: z.ZodObject<
  {
    datasource: z.ZodString;
    collectionName: z.ZodString;
    fields: z.ZodArray<z.ZodString>;
    appends: z.ZodArray<z.ZodString>;
    filter: z.ZodObject<{}, z.core.$catchall<z.ZodAny>>;
    sort: z.ZodArray<z.ZodString>;
    offset: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
  },
  z.core.$strip
>;
export type ArgType = z.infer<typeof ArgSchema>;
