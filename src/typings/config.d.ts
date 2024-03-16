export interface FiveMMainServerConfig {
    host: string;
    name: string;
    maxPlayer: string;
    interval: number;
}

export interface FiveMServerConfig {
    inline: boolean;
    host: string;
    title: string;
    description: string;
}

export interface FiveMConfig {
    embed: {
        messageId?: string;
        channelId?: string;
        thumbnail: string;
        title: string;
        description: string;
        color: string;
    }
    servers: FiveMServerConfig[];
}

export interface IConfig {
    token: string;
    adminRoles: string[];
    fivemData: FiveMConfig[];
    main: FiveMMainServerConfig;
}