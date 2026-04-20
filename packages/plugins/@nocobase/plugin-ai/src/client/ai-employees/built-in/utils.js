/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
const BUILDER_AI_USERNAMES = ['nathan', 'orin', 'dara'];
export const isBuiltIn = (aiEmployee) => {
  return aiEmployee?.builtIn;
};
export const isEngineer = (aiEmployee) => {
  return isBuiltIn(aiEmployee) && aiEmployee.username === 'nathan';
};
export const isDataModelingAssistant = (aiEmployee) => {
  return isBuiltIn(aiEmployee) && aiEmployee.username === 'orin';
};
export const isHide = (aiEmployee) => {
  return isBuiltIn(aiEmployee) && BUILDER_AI_USERNAMES.includes(aiEmployee.username);
};
export const isSupportLanguage = (language) => {
  return ['js', 'javascript', 'sql'].includes(language?.toLowerCase() ?? null);
};
//# sourceMappingURL=utils.js.map
