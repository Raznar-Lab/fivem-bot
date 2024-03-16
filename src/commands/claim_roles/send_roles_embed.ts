import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, TextChannel } from 'discord.js';
import { ICommand } from '../../typings/commands';
import { IClaimRole } from '../../typings/claim_roles';

const cmd = new SlashCommandBuilder()
.setName('send-roles-embed').setDescription('Send the roles embed')
cmd.addStringOption(new SlashCommandStringOption().setName('title').setDescription('Set the name of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('description').setDescription('Set the value of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('color').setDescription('Set the color of the embed in HEX (#)').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('thumbnail').setDescription('Set the thumbnail of the embed').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName("button_title").setDescription("The embed button title").setRequired(true))
cmd.addChannelOption(new SlashCommandChannelOption().setName('channel').setDescription('The channel target').setRequired(true));

export const SendRolesEmbedCommand: ICommand = {
    adminOnly: false,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const titleOpt = interaction.options.getString("title", true);
        const descOpt = interaction.options.getString("description", true);
        const btnTitleOpt = interaction.options.getString("button_title", true);
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
                title: titleOpt,
                description: descOpt,
                color: colorOpt,
                thumbnail: thumbnailOpt,
                custom_id:  crypto.randomUUID().toString().split("-")[0],
                buttonText: btnTitleOpt,
            }
        }
        const embed = new EmbedBuilder();
        embed.setTitle(titleOpt);
        embed.setDescription(descOpt);

        const button = new ButtonBuilder();
        button.setCustomId(clConf.embed.custom_id);
        button.setLabel(btnTitleOpt);

        const component = new ActionRowBuilder();
        component.addComponents(button);

        try {
            embed.setColor(`#${clConf.embed.color.replaceAll('#', '')}`);
        } catch (e) {
            clConf.embed.color = '#ffffff';
            console.log('Failed to set color for embed!');
        }


        const resMsg = await channelOpt.send({
            embeds: [embed]
        })

        clConf.embed.channelId = resMsg.channel.id;
        clConf.embed.messageId = resMsg.id;
        config.data.claimRole.claims.push(clConf);
        await interaction.editReply('Embed sent successfully!');
    },
};
