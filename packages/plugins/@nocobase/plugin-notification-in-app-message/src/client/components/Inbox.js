/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please rwefer to: https://www.nocobase.com/agreement.
 */
import { observer } from '@nocobase/flow-engine';
import { Icon, useApp, useCurrentUserContext, useMobileLayout } from '@nocobase/client';
import { MobilePopup } from '@nocobase/plugin-mobile/client';
import { Badge, Button, ConfigProvider, Drawer, notification, theme, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocalTranslation } from '../../locale';
import { fetchChannels, inboxVisible, messageMapObs, selectedChannelNameObs, unreadMsgsCountObs, updateUnreadMsgsCount, userIdObs, } from '../observables';
import { InboxContent } from './InboxContent';
import { MobileChannelPage } from './mobile/ChannelPage';
import { MobileMessagePage } from './mobile/MessagePage';
const useStyles = createStyles(({ token }) => {
    return {
        button: {
            // @ts-ignore
            color: token.colorTextHeaderMenu + ' !important',
        },
    };
});
const InboxPopup = (props) => {
    const { token } = theme.useToken();
    const { isMobileLayout } = useMobileLayout();
    const [selectedChannel, setSelectedChannel] = useState(null);
    if (isMobileLayout) {
        return (React.createElement(React.Fragment, null,
            React.createElement(MobilePopup, { title: props.title, visible: props.visible, onClose: props.onClose, minHeight: '60vh' },
                React.createElement(MobileChannelPage, { displayNavigationBar: false, onClickItem: setSelectedChannel })),
            React.createElement(MobilePopup, { title: selectedChannel?.title, visible: props.visible && !!selectedChannel, onClose: () => setSelectedChannel(null), minHeight: '60vh' },
                React.createElement(MobileMessagePage, { displayPageHeader: false }))));
    }
    return (React.createElement(Drawer, { title: React.createElement("div", { style: { padding: '0', paddingLeft: token.padding } }, props.title), open: props.visible, width: 900, onClose: props.onClose, styles: {
            header: {
                paddingLeft: token.paddingMD,
            },
        } },
        React.createElement(InboxContent, null)));
};
const InnerInbox = (props) => {
    const app = useApp();
    const { t } = useLocalTranslation();
    const { styles } = useStyles();
    const ctx = useCurrentUserContext();
    const currUserId = ctx.data?.data?.id;
    const onMessageCreated = useCallback(({ detail }) => {
        notification.info({
            message: (React.createElement("div", { style: {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                } }, detail.title)),
            description: detail.content.slice(0, 100) + (detail.content.length > 100 ? '...' : ''),
            onClick: () => {
                inboxVisible.value = true;
                selectedChannelNameObs.value = detail.channelName;
                notification.destroy();
            },
            duration: detail.options.duration,
        });
        unreadMsgsCountObs.value = (unreadMsgsCountObs.value ?? 0) + 1;
    }, []);
    const onMessageUpdated = useCallback(({ detail }) => {
        messageMapObs.value[detail.id] = detail;
        fetchChannels({ filter: { name: detail.channelName } });
        updateUnreadMsgsCount();
    }, []);
    useEffect(() => {
        updateUnreadMsgsCount();
    }, []);
    useEffect(() => {
        userIdObs.value = currUserId ?? null;
    }, [currUserId]);
    const onIconClick = useCallback(() => {
        inboxVisible.value = true;
        fetchChannels({});
    }, []);
    useEffect(() => {
        app.eventBus.addEventListener('ws:message:in-app-message:created', onMessageCreated);
        app.eventBus.addEventListener('ws:message:in-app-message:updated', onMessageUpdated);
        return () => {
            app.eventBus.removeEventListener('ws:message:in-app-message:created', onMessageCreated);
            app.eventBus.removeEventListener('ws:message:in-app-message:updated', onMessageUpdated);
        };
    }, [app.eventBus, onMessageUpdated]);
    return (React.createElement(ConfigProvider, { theme: {
            components: { Drawer: { paddingLG: 0 } },
        } },
        React.createElement(Tooltip, { title: t('Message') },
            React.createElement(Button, { className: styles.button, onClick: onIconClick },
                React.createElement(Badge, { count: unreadMsgsCountObs.value, size: "small" },
                    React.createElement(Icon, { type: 'BellOutlined' })))),
        React.createElement(InboxPopup, { title: t('Message'), visible: inboxVisible.value, onClose: () => {
                inboxVisible.value = false;
            } })));
};
export const Inbox = observer(InnerInbox);
//# sourceMappingURL=Inbox.js.map