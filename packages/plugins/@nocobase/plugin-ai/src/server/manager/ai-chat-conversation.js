/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import _ from 'lodash';
export const createAIChatConversation = (ctx, sessionId) => {
  return new AIChatConversationImpl(ctx, sessionId);
};
class AIChatConversationImpl {
  ctx;
  sessionId;
  transaction;
  constructor(ctx, sessionId) {
    this.ctx = ctx;
    this.sessionId = sessionId;
  }
  async withTransaction(runnable, transaction) {
    const instance = this.clone();
    if (transaction) {
      instance.transaction = transaction;
      return await runnable(instance, transaction);
    }
    return await instance.ctx.db.sequelize.transaction(async (transaction) => {
      instance.transaction = transaction;
      return await runnable(instance, transaction);
    });
  }
  getSessionId() {
    return this.sessionId;
  }
  async addMessages(messages) {
    const isArray = _.isArray(messages);
    const messageList = isArray ? messages : [messages];
    const instances = await this.aiConversationMessagesRepo.create({
      values: messageList.map((message) => ({
        messageId: String(this.snowflake()),
        sessionId: this.sessionId,
        role: message.role,
        content: message.content,
        attachments: message.attachments,
        workContext: message.workContext,
        metadata: message.metadata,
        toolCalls: message.toolCalls,
      })),
      transaction: this.transaction,
    });
    return isArray ? instances : instances[0];
  }
  async removeMessages({ messageId }) {
    const filter = {
      sessionId: this.sessionId,
    };
    if (messageId) {
      filter.messageId = {
        $gte: messageId,
      };
    }
    await this.aiMessagesRepo.destroy({
      filter,
      transaction: this.transaction,
    });
  }
  async getMessage(messageId) {
    return await this.aiMessagesRepo.findByTargetKey(messageId);
  }
  async listMessages(query) {
    const filter = {
      sessionId: this.sessionId,
    };
    if (query?.messageId) {
      filter.messageId = {
        $lt: query.messageId,
      };
    }
    const messages = await this.aiConversationMessagesRepo.find({
      sort: ['-messageId'],
      limit: 50,
      filter,
    });
    return messages.reverse(); // 反转回正序
  }
  async lastUserMessage() {
    const filter = {
      sessionId: this.sessionId,
      role: 'user',
    };
    return await this.aiConversationMessagesRepo.findOne({
      sort: ['-messageId'],
      filter,
    });
  }
  async getChatContext(options) {
    const { userMessages, userDecisions: decisions, tools, middleware, getSystemPrompt, formatMessages } =
      options ?? {};
    const messages = userMessages ? (await formatMessages?.(userMessages)) ?? [] : undefined;
    const systemPrompt = (await getSystemPrompt?.()) ?? '';
    const chatContext = {
      systemPrompt,
      messages,
      decisions,
      tools,
      middleware,
    };
    return chatContext;
  }
  clone() {
    return new AIChatConversationImpl(this.ctx, this.sessionId);
  }
  snowflake() {
    return this.aiPlugin.snowflake.generate();
  }
  get aiConversationMessagesRepo() {
    return this.ctx.db.getRepository('aiConversations.messages', this.sessionId);
  }
  get aiMessagesRepo() {
    return this.ctx.db.getRepository('aiMessages');
  }
  get aiPlugin() {
    return this.ctx.app.pm.get('ai');
  }
}
//# sourceMappingURL=ai-chat-conversation.js.map
