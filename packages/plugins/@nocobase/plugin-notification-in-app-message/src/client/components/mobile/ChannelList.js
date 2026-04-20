/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { Schema } from '@formily/react';
import { reaction } from '@formily/reactive';
import { observer } from '@nocobase/flow-engine';
import { useApp } from '@nocobase/client';
import { dayjs } from '@nocobase/utils/client';
import { Badge, InfiniteScroll, List } from 'antd-mobile';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { channelListObs, channelStatusFilterObs, fetchChannels, showChannelLoadingMoreObs } from '../../observables';
import InfiniteScrollContent from './InfiniteScrollContent';
const InternalChannelList = (props) => {
    const app = useApp();
    const navigate = useNavigate();
    const channels = channelListObs.value;
    const listRef = useRef(null);
    useEffect(() => {
        const dispose = reaction(() => channelStatusFilterObs.value, () => {
            const ele = document.querySelector('.mobile-page-content');
            if (ele)
                ele.scrollTop = 0;
        });
        return dispose;
    }, []);
    const [fetctChannelsStatus, setFetchChannelsStatus] = useState('success');
    const onLoadChannelsMore = async () => {
        try {
            setFetchChannelsStatus('loading');
            const filter = {};
            const lastChannel = channels[channels.length - 1];
            if (lastChannel?.latestMsgReceiveTimestamp) {
                filter.latestMsgReceiveTimestamp = {
                    $lt: lastChannel.latestMsgReceiveTimestamp,
                };
            }
            const res = await fetchChannels({ filter, limit: 30 });
            setFetchChannelsStatus('success');
            return res;
        }
        catch {
            setFetchChannelsStatus('failure');
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(List, { ref: listRef, style: {
                '--border-top': 'none',
                '--font-size': 'var(--adm-font-size-6)',
                // @ts-ignore
                '--adm-font-size-main': 'var(--adm-font-size-4)',
            } },
            channelListObs.value.map((item) => {
                const channelTitle = Schema.compile(item.title, { t: app.i18n.t });
                return (React.createElement(List.Item, { key: item.name, onClick: () => {
                        if (props.onClickItem) {
                            props.onClickItem(item);
                        }
                        else {
                            navigate(`/page/in-app-message/messages?channel=${item.name}`);
                        }
                    }, description: React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                        React.createElement("div", null, item.latestMsgTitle),
                        React.createElement("div", null,
                            React.createElement(Badge, { style: { border: 'none' }, content: channelStatusFilterObs.value !== 'read' && item.unreadMsgCnt > 0 ? item.unreadMsgCnt : null }))) },
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        } },
                        React.createElement("div", null,
                            " ",
                            channelTitle),
                        React.createElement("div", { style: { color: 'var(--adm-color-weak)', fontSize: 'var(--adm-font-size-main)' } }, dayjs(item.latestMsgReceiveTimestamp).fromNow(true)))));
            }),
            React.createElement(InfiniteScroll, { loadMore: onLoadChannelsMore, hasMore: fetctChannelsStatus !== 'failure' && showChannelLoadingMoreObs.value },
                React.createElement(InfiniteScrollContent, { loadMoreStatus: fetctChannelsStatus, hasMore: showChannelLoadingMoreObs.value, retry: onLoadChannelsMore })))));
};
export const ChannelList = observer(InternalChannelList, { displayName: 'ChannelList' });
//# sourceMappingURL=ChannelList.js.map