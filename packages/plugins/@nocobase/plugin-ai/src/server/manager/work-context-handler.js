/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Registry } from '@nocobase/utils';
import _ from 'lodash';
export const createWorkContextHandler = (plugin) => new WorkContextHandlerImpl(plugin);
class WorkContextHandlerImpl {
  plugin;
  defaultStrategy;
  strategies;
  constructor(plugin) {
    this.plugin = plugin;
    this.defaultStrategy = {
      resolve: Stringify(plugin),
      background: NoBackground(plugin),
    };
    this.strategies = new Registry();
  }
  registerStrategy(type, strategies) {
    this.strategies.register(type, strategies);
  }
  async resolve(ctx, workContext) {
    return Promise.all(workContext.map((contextItem) => this.applyResolveStrategy(ctx, contextItem)));
  }
  async background(ctx, aiMessages) {
    const backgroundList = [];
    const workContextList = aiMessages.flatMap((aiMessage) => aiMessage.workContext);
    const workContextGroup = _.groupBy(workContextList, 'type');
    for (const key in workContextGroup) {
      const workContext = workContextGroup[key];
      if (!workContext?.length) {
        continue;
      }
      const background = await this.strategies.get(key)?.background?.(ctx, aiMessages, workContext);
      if (!background) {
        continue;
      }
      backgroundList.push(background);
    }
    return backgroundList;
  }
  async applyResolveStrategy(ctx, contextItem) {
    if (!contextItem) {
      return '';
    }
    const { resolve } = this.strategies.get(contextItem.type) ?? {};
    if (resolve) {
      return await resolve(ctx, contextItem);
    }
    return await this.defaultStrategy.resolve?.(ctx, contextItem);
  }
}
const Stringify = (_plugin) => async (_ctx, contextItem) => {
  return JSON.stringify(contextItem);
};
const NoBackground = (_plugin) => undefined;
//# sourceMappingURL=work-context-handler.js.map
