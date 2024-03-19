export interface IVMainConfig {
    host: string;
    name: string;
    maxPlayer: string;
    interval: number;
}

export interface IVServerConfig {
    inline: boolean;
    host: string;
    title: string;
    description: string;
}

export interface IVConfig {
    embed: {
        change: boolean;
        messageId?: string;
        channelId?: string;
        thumbnail: string;
        title: string;
        description: string;
        color: string;
    };
    servers: IVServerConfig[];
}
