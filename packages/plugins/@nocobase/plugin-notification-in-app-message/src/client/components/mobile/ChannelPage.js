/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { observer } from '@nocobase/flow-engine';
import { css, useCurrentUserContext } from '@nocobase/client';
import { MobilePageContentContainer, MobilePageHeader, MobilePageNavigationBar, MobilePageProvider, } from '@nocobase/plugin-mobile/client';
import { Tabs } from 'antd-mobile';
import React, { useEffect } from 'react';
import { useLocalTranslation } from '../../../locale';
import { channelStatusFilterObs, fetchChannels, userIdObs } from '../../observables';
import { ChannelList } from './ChannelList';
const MobileMessageBoxInner = (props) => {
    const { t } = useLocalTranslation();
    const ctx = useCurrentUserContext();
    const currUserId = ctx.data?.data?.id;
    useEffect(() => {
        userIdObs.value = currUserId ?? null;
    }, [currUserId]);
    useEffect(() => {
        fetchChannels({});
    }, []);
    return (React.createElement(MobilePageProvider, { displayNavigationBar: props.displayNavigationBar },
        React.createElement(MobilePageHeader, null,
            React.createElement(MobilePageNavigationBar, null),
            React.createElement(Tabs, { className: css({
                    '.adm-tabs-header': {
                        borderBottomWidth: 0,
                    },
                    '.adm-tabs-tab': {
                        height: 49,
                        padding: '10px 0 10px',
                    },
                }), activeKey: channelStatusFilterObs.value, activeLineMode: 'auto', onChange: (key) => {
                    channelStatusFilterObs.value = key;
                    fetchChannels({});
                } },
                React.createElement(Tabs.Tab, { title: t('All'), key: "all" }),
                React.createElement(Tabs.Tab, { title: t('Unread'), key: "unread" }),
                React.createElement(Tabs.Tab, { title: t('Read'), key: "read" }))),
        React.createElement(MobilePageContentContainer, null,
            React.createElement(ChannelList, { onClickItem: props.onClickItem }))));
};
export const MobileChannelPage = observer(MobileMessageBoxInner, { displayName: 'MobileChannelPage' });
//# sourceMappingURL=ChannelPage.js.map