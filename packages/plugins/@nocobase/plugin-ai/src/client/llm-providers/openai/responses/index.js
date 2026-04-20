/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import {
  stripModelIdPrefix,
  mergeVersionSegments,
  capitalize,
} from '../../../llm-services/component/EnabledModelsSelect';
import { ModelSettingsForm } from './ModelSettings';
import { ProviderSettingsForm } from '../components/ProviderSettings';
const formatModelLabel = (id) => {
  const name = stripModelIdPrefix(id);
  const segments = mergeVersionSegments(name.split(/[-_]/));
  return segments.map((s) => (s.toLowerCase() === 'gpt' ? 'GPT' : capitalize(s))).join('-');
};
export const openaiResponsesProviderOptions = {
  components: {
    ProviderSettingsForm,
    ModelSettingsForm,
  },
  formatModelLabel,
};
//# sourceMappingURL=index.js.map
