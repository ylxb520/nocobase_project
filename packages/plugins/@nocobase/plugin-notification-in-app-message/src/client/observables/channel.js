/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
import { autorun, observable, reaction } from '@formily/reactive';
import { merge } from '@nocobase/utils/client';
import { getAPIClient } from '../utils';
import { userIdObs } from './user';
export var InappChannelStatusEnum;
(function (InappChannelStatusEnum) {
    InappChannelStatusEnum["all"] = "all";
    InappChannelStatusEnum["read"] = "read";
    InappChannelStatusEnum["unread"] = "unread";
})(InappChannelStatusEnum || (InappChannelStatusEnum = {}));
export const channelMapObs = observable({ value: {} });
export const isFetchingChannelsObs = observable({ value: false });
export const channelCountObs = observable({ value: 0 });
export const channelStatusFilterObs = observable({ value: 'all' });
export const channelListObs = observable.computed(() => {
    const channels = Object.values(channelMapObs.value)
        .filter((channel) => channel.userId == String(userIdObs.value ?? ''))
        .filter((channel) => {
        if (channelStatusFilterObs.value === 'read')
            return channel.totalMsgCnt - channel.unreadMsgCnt > 0;
        else if (channelStatusFilterObs.value === 'unread')
            return channel.unreadMsgCnt > 0;
        else
            return true;
    })
        .sort((a, b) => (a.latestMsgReceiveTimestamp > b.latestMsgReceiveTimestamp ? -1 : 1));
    return channels;
});
export const showChannelLoadingMoreObs = observable.computed(() => {
    if (channelListObs.value.length < channelCountObs.value)
        return true;
    else
        return false;
});
export const selectedChannelNameObs = observable({ value: null });
export const selectedChannelObs = observable.computed(() => {
    if (selectedChannelNameObs.value && channelMapObs.value && channelMapObs.value[selectedChannelNameObs.value])
        return channelMapObs.value[selectedChannelNameObs.value];
    else
        return null;
});
export const fetchChannels = async (params) => {
    const apiClient = getAPIClient();
    isFetchingChannelsObs.value = true;
    const res = await apiClient.request({
        url: 'myInAppChannels:list',
        method: 'get',
        params: merge({ filter: { status: channelStatusFilterObs.value } }, params ?? {}),
    });
    const channels = res.data?.data;
    if (Array.isArray(channels)) {
        channels.forEach((channel) => {
            channelMapObs.value[channel.name] = channel;
        });
    }
    await countChannels();
    isFetchingChannelsObs.value = false;
};
export const countChannels = async () => {
    const apiClient = getAPIClient();
    const res = await apiClient.request({
        url: 'myInAppChannels:list',
        method: 'get',
        params: { filter: { status: channelStatusFilterObs.value } },
    });
    const count = res.data?.meta?.count;
    if (count >= 0)
        channelCountObs.value = count;
};
autorun(() => {
    if (!selectedChannelNameObs.value && channelListObs.value[0]?.name) {
        selectedChannelNameObs.value = channelListObs.value[0].name;
    }
    else if (channelListObs.value.length === 0) {
        selectedChannelNameObs.value = null;
    }
    else if (channelListObs.value.length > 0 &&
        !channelListObs.value.find((channel) => channel.name === selectedChannelNameObs.value)) {
        selectedChannelNameObs.value = null;
    }
});
reaction(() => channelStatusFilterObs.value, () => {
    if (channelListObs.value[0]?.name) {
        selectedChannelNameObs.value = channelListObs.value[0].name;
    }
}, { fireImmediately: true });
//# sourceMappingURL=channel.js.map