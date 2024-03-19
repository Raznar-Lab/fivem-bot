import { Client, EmbedBuilder, TextChannel, APIEmbedField, Embed, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageEditOptions, MessagePayload } from 'discord.js';
import { Config } from './config';
import { IVConfig } from './typings/fivem';
import { IClaimRole } from './typings/claim_roles';

export const updateClaimRoleEmbeds = async (client: Client<true>, config: Config) => {
    for (const claimRole of config.data.claimRole.claims) {
        if (!claimRole.embed.change) {
            if(claimRole.embed.change == undefined) claimRole.embed.change = false
            console.log('Skipping, the embed is not requesting a changes.');
            continue;
        }

        if (!claimRole.embed.channelId || !claimRole.embed.messageId) {
            console.log('Cannot find channel or message id for embed!');
            continue;
        }

        const component = newClaimRoleComponent(claimRole);
        await updateEmbed(client, claimRole.embed.channelId, claimRole.embed.messageId, { embeds: [component[0] as EmbedBuilder], components: [component[1] as ActionRowBuilder<ButtonBuilder>] });
    }
};

export const updateServerEmbeds = async (client: Client<true>, config: Config) => {
    for (const sConf of config.data.fivemData) {
        if (!sConf.embed.change) {
            if(sConf.embed.change == undefined) sConf.embed.change = false
            console.log('Skipping, the embed is not requesting a changes.');
            continue;
        }

        if (!sConf.embed.channelId || !sConf.embed.messageId) {
            console.log('Cannot find channel or message id for embed!');
            continue;
        }

        const embed = newServerEmbed(sConf);
        await updateEmbed(client, sConf.embed.channelId, sConf.embed.messageId, { embeds: [embed] });
    }
};

export const updateEmbed = async (client: Client<true>, channelId: string, messageId: string, content: string | MessageEditOptions | MessagePayload) => {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) return;
    const msg = await channel.messages.fetch(messageId);
    if (!msg) return;

    await msg.edit(content);
};

export const newServerEmbed = (config: IVConfig) => {
    const embed = new EmbedBuilder();
    embed.setTitle(config.embed.title);
    embed.setDescription(config.embed.description);
    embed.setAuthor({
        name: 'Powered by raznar.id',
        iconURL: 'https://cdn.discordapp.com/attachments/776806054394593321/815101537508392981/20210225_100806.png?ex=6607aaf6&is=65f535f6&hm=dd6e80560ea0b77ed6678f2fa482b004ba471a0cadfd70da596ca6c218bdba6b&',
    });

    const fields: APIEmbedField[] = [];
    for (const v of config.servers) {
        fields.push({
            name: v.title,
            value: v.description.replaceAll('%host%', v.host),
            inline: v.inline,
        });
    }

    embed.setThumbnail(config.embed.thumbnail);
    embed.addFields(fields);

    try {
        embed.setColor(`#${config.embed.color.replaceAll('#', '')}`);
    } catch (e) {
        config.embed.color = '#ffffff';
        console.log('Failed to set color for embed!');
    }

    return embed;
};

export const newClaimRoleComponent = (config: IClaimRole) => {
    const embed = new EmbedBuilder();
    embed.setTitle(config.embed.title);
    embed.setDescription(config.embed.description);
    embed.setAuthor({
        name: 'Powered by raznar.id',
        iconURL: 'https://cdn.discordapp.com/attachments/776806054394593321/815101537508392981/20210225_100806.png?ex=6607aaf6&is=65f535f6&hm=dd6e80560ea0b77ed6678f2fa482b004ba471a0cadfd70da596ca6c218bdba6b&',
    });

    embed.setThumbnail(config.embed.thumbnail);

    try {
        embed.setColor(`#${config.embed.color.replaceAll('#', '')}`);
    } catch (e) {
        config.embed.color = '#ffffff';
        console.log('Failed to set color for embed!');
    }

    const button = new ButtonBuilder();
    button.setCustomId(config.embed.custom_id);
    button.setStyle(ButtonStyle.Success);
    button.setLabel(config.embed.buttonText);

    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(button);

    try {
        embed.setColor(`#${config.embed.color.replaceAll('#', '')}`);
    } catch (e) {
        config.embed.color = '#ffffff';
        console.log('Failed to set color for embed!');
    }

    return [embed, row];
};
