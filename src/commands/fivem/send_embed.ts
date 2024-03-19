import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, TextChannel } from 'discord.js';
import { ICommand } from '../../typings/commands';
import { newServerEmbed } from '../../embed';
import { IVConfig } from '../../typings/fivem';

const cmd = new SlashCommandBuilder().setName('send-embed').setDescription('Send the servers embed');
cmd.addStringOption(new SlashCommandStringOption().setName('title').setDescription('Set the name of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('description').setDescription('Set the value of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('color').setDescription('Set the color of the embed in HEX (#)').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('thumbnail').setDescription('Set the thumbnail of the embed').setRequired(true));
cmd.addChannelOption(new SlashCommandChannelOption().setName('channel').setDescription('The channel target').setRequired(true));

export const SendEmbed: ICommand = {
    adminOnly: true,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const title = interaction.options.getString('title', true);
        const description = interaction.options.getString('description', true);
        const color = interaction.options.getString('color', true);
        const thumbnail = interaction.options.getString('thumbnail', true);
        const channel = interaction.options.getChannel('channel', true);

        if (!(channel instanceof TextChannel)) {
            await interaction.editReply('The channel must be a text channel!');
            return;
        }

        try {
            new URL(thumbnail);
        } catch (e) {
            await interaction.editReply('The thumbnail must be an image URL, example: `https://link.com/photo.png`');
            return;
        }

        const fivemData: IVConfig = {
            embed: {
                change: false,
                title: title,
                description: description,
                thumbnail: thumbnail,
                color: color,
            },
            servers: [],
        };

        const embed = newServerEmbed(fivemData);
        const resMsg = await channel.send({
            embeds: [embed],
        });

        fivemData.embed.channelId = resMsg.channel.id;
        fivemData.embed.messageId = resMsg.id;
        config.data.fivemData.push(fivemData);
        config.save();
        await interaction.editReply('Embed sent successfully!');
    },
};
