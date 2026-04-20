/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import React from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { observer } from '@nocobase/flow-engine';
import { fetchChannels, channelStatusFilterObs } from '../observables';
import { useLocalTranslation } from '../../locale';
const _FilterTab = () => {
    const { t } = useLocalTranslation();
    const items = [
        { label: t('All'), key: 'all' },
        { label: t('Unread'), key: 'unread' },
        { label: t('Read'), key: 'read' },
    ];
    return (React.createElement(ConfigProvider, { theme: {
            components: { Tabs: { horizontalItemMargin: '20px' } },
        } },
        React.createElement(Tabs, { activeKey: channelStatusFilterObs.value, items: items, onChange: (key) => {
                channelStatusFilterObs.value = key;
                fetchChannels({});
            } })));
};
const FilterTab = observer(_FilterTab);
export default FilterTab;
//# sourceMappingURL=FilterTab.js.map