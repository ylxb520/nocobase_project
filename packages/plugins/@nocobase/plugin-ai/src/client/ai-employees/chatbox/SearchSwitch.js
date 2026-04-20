/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React, { useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { observer } from '@nocobase/flow-engine';
import { useChatConversationsStore } from './stores/chat-conversations';
import { useChatBoxStore } from './stores/chat-box';
import { useLLMServiceCatalog } from '../../llm-services/hooks/useLLMServiceCatalog';
import { getServiceByOverride } from '../../llm-services/utils';
import { useT } from '../../locale';
export const SearchSwitch = observer(
  () => {
    const t = useT();
    const webSearch = useChatConversationsStore.use.webSearch();
    const setWebSearch = useChatConversationsStore.use.setWebSearch();
    const currentEmployee = useChatBoxStore.use.currentEmployee();
    const model = useChatBoxStore.use.model();
    const { services } = useLLMServiceCatalog();
    const currentService = getServiceByOverride(services, model);
    const supportWebSearch = currentService?.supportWebSearch ?? false;
    const isToolConflict = currentService?.isToolConflict ?? false;
    useEffect(() => {
      if (!supportWebSearch && webSearch) {
        setWebSearch(false);
      }
    }, [supportWebSearch, webSearch, setWebSearch]);
    const switchChecked = () => {
      if (!supportWebSearch) {
        return;
      }
      setWebSearch(!webSearch);
    };
    if (!currentEmployee) {
      return React.createElement(Button, {
        type: 'text',
        icon: React.createElement(GlobalOutlined, null),
        disabled: true,
      });
    }
    const enabledTooltip = t('Disable search');
    const unsupportedTooltip = t('Web search not supported');
    const disabledTooltip = isToolConflict
      ? React.createElement(
          'div',
          null,
          React.createElement('div', null, t('Enable search')),
          React.createElement('div', { style: { marginTop: 4 } }, t('Search disables tools')),
        )
      : t('Enable search');
    return webSearch
      ? React.createElement(
          Tooltip,
          { title: enabledTooltip, arrow: false },
          React.createElement(Button, {
            color: 'primary',
            variant: 'filled',
            icon: React.createElement(GlobalOutlined, null),
            onClick: switchChecked,
          }),
        )
      : React.createElement(
          Tooltip,
          { title: supportWebSearch ? disabledTooltip : unsupportedTooltip, arrow: false },
          React.createElement(Button, {
            type: 'text',
            icon: React.createElement(GlobalOutlined, null),
            onClick: switchChecked,
            disabled: !supportWebSearch,
          }),
        );
  },
  { displayName: 'SearchSwitch' },
);
//# sourceMappingURL=SearchSwitch.js.map
