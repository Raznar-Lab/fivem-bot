export interface IClaimRoleEmbed {
    change: boolean;
    custom_id: string;
    title: string;
    color: string;
    thumbnail: string;
    description: string;
    buttonText: string;
    channelId?: string;
    messageId?: string;
    
}

export interface IClaimRole {
    roles: string[];
    requiredRoles: string[];
    embed: IClaimRoleEmbed;
}

export interface IClaimRoleLang {
    claimed: string;
    alreadyClaimed: string;
}

export interface IClaimRoleConfig {
    lang: IClaimRoleLang;
    claims: IClaimRole[];
}
