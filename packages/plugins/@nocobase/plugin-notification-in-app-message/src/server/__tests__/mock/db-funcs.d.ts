export declare function createMessages({ messagesRepo }: {
    messagesRepo: any;
}, { unreadNum, readNum, channelName, startTimeStamp, userId }: {
    unreadNum: any;
    readNum: any;
    channelName: any;
    startTimeStamp: any;
    userId: any;
}): Promise<void>;
export declare function createChannels({ channelsRepo }: {
    channelsRepo: any;
}, { totalNum }: {
    totalNum: any;
}): Promise<{
    name: string;
    title: string;
    notificationType: string;
}[]>;
