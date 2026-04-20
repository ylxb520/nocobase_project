/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { z } from 'zod';
import { truncateLongStrings } from './utils';
import _ from 'lodash';
const buildSchema = (config) => {
  const schemaProperties = {};
  if (config.parameters?.length) {
    config.parameters.forEach((item) => {
      let fieldSchema;
      switch (item.type) {
        case 'string':
          fieldSchema = z.string();
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'boolean':
          fieldSchema = z.boolean();
          break;
        case 'enum':
          if (item.options && item.options.length > 0) {
            const enumValues = item.options.map((option) => option.value);
            if (typeof enumValues[0] === 'number') {
              const values = enumValues.map(String);
              fieldSchema = z.enum(values).transform((v) => Number(v));
            } else {
              fieldSchema = z.enum(enumValues);
            }
          } else {
            fieldSchema = z.string();
          }
          break;
        default:
          fieldSchema = z.any();
      }
      if (item.description) {
        fieldSchema = fieldSchema.describe(item.description);
      }
      if (!item.required) {
        fieldSchema = fieldSchema.optional();
      }
      schemaProperties[item.name] = fieldSchema;
    });
  }
  const schema = z.object(schemaProperties);
  return schema.describe(config.description || '');
};
const invoke = async (ctx, workflow, args) => {
  const workflowPlugin = ctx.app.pm.get('workflow');
  const processor = await workflowPlugin.trigger(workflow, {
    ...args,
  });
  const output = processor.execution.output ?? processor.lastSavedJob?.result;
  if (output == null || output === '') {
    return { status: 'error', content: 'No content' };
  }
  if (processor.execution.status < 0) {
    return { status: 'error', content: 'Workflow execution exceptions' };
  }
  const result = truncateLongStrings(output);
  return {
    status: 'success',
    content: JSON.stringify(result),
  };
};
export const getWorkflowCallers = (plugin, prefix) => async (register) => {
  const workflowPlugin = plugin.app.pm.get('workflow');
  const aiSupporterWorkflows = Array.from(workflowPlugin.enabledCache.values()).filter(
    (item) => item.type === 'ai-employee',
  );
  for (const workflow of aiSupporterWorkflows) {
    const config = workflow.config;
    register.registerTools({
      scope: 'CUSTOM',
      introduction: {
        title: workflow.title,
        about: workflow.description,
      },
      definition: {
        name: !_.isEmpty(prefix) ? `${prefix}-${workflow.key}` : workflow.key,
        description: workflow.description,
        schema: buildSchema(config),
      },
      invoke: async (ctx, args) => invoke(ctx, workflow, args),
    });
  }
};
//# sourceMappingURL=workflow-caller.js.map
