import { Client, EmbedBuilder, TextChannel, APIEmbedField } from 'discord.js';
import { Config } from './config';
import { IVConfig } from './typings/fivem';

export const updateServerEmbeds = async (client: Client<true>, config: Config) => {
    for (const server of config.data.fivemData) {
        await updateServerEmbed(client, server);
    }
};

export const updateServerEmbed = async (client: Client<true>, config: IVConfig) => {
    if (!config.embed.channelId || !config.embed.messageId) {
        console.log('Cannot find channel or message id for embed!');
        return;
    }

    const channel = client.channels.cache.get(config.embed.channelId) as TextChannel;
    if (!channel) return;
    const msg = await channel.messages.fetch(config.embed.messageId);
    if (!msg) return;

    const embed = newServerEmbed(config);
    await msg.edit({
        embeds: [embed],
    });
};

export const newServerEmbed = (server: IVConfig) => {
    const embed = new EmbedBuilder();
    embed.setTitle(server.embed.title);
    embed.setDescription(server.embed.description);
    embed.setAuthor({
        name: 'Powered by raznar.id',
        iconURL: 'https://cdn.discordapp.com/attachments/776806054394593321/815101537508392981/20210225_100806.png?ex=6607aaf6&is=65f535f6&hm=dd6e80560ea0b77ed6678f2fa482b004ba471a0cadfd70da596ca6c218bdba6b&',
    });

    const fields: APIEmbedField[] = [];
    for (const v of server.servers) {
        fields.push({
            name: v.title,
            value: v.description.replaceAll('%host%', v.host),
            inline: v.inline,
        });
    }

    embed.setThumbnail(server.embed.thumbnail);
    embed.addFields(fields);

    try {
        embed.setColor(`#${server.embed.color.replaceAll('#', '')}`);
    } catch (e) {
        server.embed.color = '#ffffff';
        console.log('Failed to set color for embed!');
    }

    return embed;
};
