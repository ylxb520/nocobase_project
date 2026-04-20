/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { css } from '@emotion/css';
import { Schema } from '@formily/react';
import { observer } from '@nocobase/flow-engine';
import { useApp } from '@nocobase/client';
import { dayjs } from '@nocobase/utils/client';
import { Badge, Button, Flex, Layout, List, theme } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useLocalTranslation } from '../../locale';
import { channelListObs, channelStatusFilterObs, fetchChannels, inboxVisible, isFetchingChannelsObs, selectedChannelNameObs, showChannelLoadingMoreObs, } from '../observables';
import FilterTab from './FilterTab';
import MessageList from './MessageList';
const InnerInboxContent = () => {
    const app = useApp();
    const { token } = theme.useToken();
    const { t } = useLocalTranslation();
    const channels = channelListObs.value;
    const selectedChannelName = selectedChannelNameObs.value;
    const onLoadChannelsMore = useCallback(() => {
        const filter = {};
        const lastChannel = channels[channels.length - 1];
        if (lastChannel?.latestMsgReceiveTimestamp) {
            filter.latestMsgReceiveTimestamp = {
                $lt: lastChannel.latestMsgReceiveTimestamp,
            };
        }
        fetchChannels({ filter, limit: 30 });
    }, [channels]);
    useEffect(() => {
        if (inboxVisible.value) {
            fetchChannels({ limit: 30 });
        }
    }, [inboxVisible.value]);
    const loadChannelsMore = showChannelLoadingMoreObs.value ? (React.createElement("div", { style: {
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
        } },
        React.createElement(Button, { loading: isFetchingChannelsObs.value, onClick: onLoadChannelsMore }, t('Loading more')))) : null;
    return (React.createElement(Layout, { style: { height: '100%' } },
        React.createElement(Layout.Sider, { width: 350, style: {
                height: '100%',
                overflowY: 'auto',
                background: token.colorBgContainer,
                padding: '0 15px',
                border: 'none',
            } },
            React.createElement(FilterTab, null),
            React.createElement(List, { itemLayout: "horizontal", dataSource: channels, loadMore: loadChannelsMore, style: { paddingBottom: '20px' }, loading: channels.length === 0 && isFetchingChannelsObs.value, renderItem: (item) => {
                    const title = Schema.compile(item.title, { t: app.i18n.t });
                    const titleColor = selectedChannelName === item.name ? token.colorPrimaryText : token.colorText;
                    const textColor = selectedChannelName === item.name ? token.colorPrimaryText : token.colorTextTertiary;
                    return (React.createElement(List.Item, { className: css `
                &:hover {
                  background-color: ${token.colorBgTextHover}};
                }
              `, style: {
                            padding: '10px 10px',
                            color: titleColor,
                            ...(selectedChannelName === item.name ? { backgroundColor: token.colorPrimaryBg } : {}),
                            cursor: 'pointer',
                            marginTop: '10px',
                            border: 'none',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }, onClick: () => {
                            selectedChannelNameObs.value = item.name;
                        } },
                        React.createElement(Flex, { justify: "space-between", style: { width: '100%' } },
                            React.createElement("div", { style: {
                                    width: '150px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 'bold',
                                }, title: title }, title),
                            React.createElement("div", { style: {
                                    width: '120px',
                                    fontWeight: 400,
                                    textAlign: 'right',
                                    fontFamily: 'monospace',
                                    color: textColor,
                                } }, dayjs(Number.parseInt(item.latestMsgReceiveTimestamp.toString(), 10)).fromNow())),
                        React.createElement(Flex, { justify: "space-between", style: { width: '100%', marginTop: token.margin } },
                            React.createElement("div", { style: {
                                    width: '80%',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    color: textColor,
                                } },
                                ' ',
                                item.latestMsgTitle),
                            channelStatusFilterObs.value !== 'read' ? (React.createElement(Badge, { style: { border: 'none' }, count: item.unreadMsgCnt })) : null)));
                } })),
        React.createElement(Layout.Content, { style: { padding: token.paddingLG, height: '100%', overflowY: 'auto', backgroundColor: token.colorBgLayout } }, selectedChannelName ? React.createElement(MessageList, null) : null)));
};
export const InboxContent = observer(InnerInboxContent);
//# sourceMappingURL=InboxContent.js.map