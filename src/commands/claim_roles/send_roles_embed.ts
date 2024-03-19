import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, TextChannel } from 'discord.js';
import { ICommand } from '../../typings/commands';
import { IClaimRole } from '../../typings/claim_roles';
import crypto from 'node:crypto';
import { newClaimRoleComponent } from '../../embed';
const cmd = new SlashCommandBuilder().setName('send-roles-embed').setDescription('Send the roles embed');
cmd.addStringOption(new SlashCommandStringOption().setName('title').setDescription('Set the name of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('description').setDescription('Set the value of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('color').setDescription('Set the color of the embed in HEX (#)').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('thumbnail').setDescription('Set the thumbnail of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('button_title').setDescription('The embed button title').setRequired(true));
cmd.addChannelOption(new SlashCommandChannelOption().setName('channel').setDescription('The channel target').setRequired(true));

export const SendRolesEmbedCommand: ICommand = {
    adminOnly: true,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const titleOpt = interaction.options.getString('title', true);
        const descOpt = interaction.options.getString('description', true);
        const btnTitleOpt = interaction.options.getString('button_title', true);
        const colorOpt = interaction.options.getString('color', true);
        const thumbnailOpt = interaction.options.getString('thumbnail', true);
        const channelOpt = interaction.options.getChannel('channel', true);

        if (!(channelOpt instanceof TextChannel)) {
            await interaction.editReply('The channel must be a text channel!');
            return;
        }

        try {
            new URL(thumbnailOpt);
        } catch (e) {
            await interaction.editReply('The thumbnail must be an image URL, example: `https://link.com/photo.png`');
            return;
        }

        const clConf: IClaimRole = {
            roles: [],
            requiredRoles: [],
            embed: {
                change: false,
                title: titleOpt,
                description: descOpt,
                color: colorOpt,
                thumbnail: thumbnailOpt,
                custom_id: crypto.randomUUID().toString().split('-')[0],
                buttonText: btnTitleOpt,
            },
        };

        const clIntrData = newClaimRoleComponent(clConf);
        const resMsg = await channelOpt.send({
            embeds: [clIntrData[0] as EmbedBuilder],
            components: [clIntrData[1] as ActionRowBuilder<ButtonBuilder>],
        });

        clConf.embed.channelId = resMsg.channel.id;
        clConf.embed.messageId = resMsg.id;
        config.data.claimRole.claims.push(clConf);
        config.save();
        await interaction.editReply('Embed sent successfully!');
    },
};
