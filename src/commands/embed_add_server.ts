import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption, TextBasedChannel } from 'discord.js';
import { ICommand } from '../typings/commands';
import { FiveMConfig } from '../typings/config';
import { domainPattern, ipPattern } from '../constants';
import { updateMessage } from '../embed';

const cmd = new SlashCommandBuilder().setName('embed-add-server').setDescription('Add server to the embed');
cmd.addStringOption(new SlashCommandStringOption().setName('message_id').setDescription('The message embed ID of this channel (right click the embed to get the ID) - requires developer mode').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('host').setDescription('The server host').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('title').setDescription('Set the title of the field').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('description').setDescription('Set the description of the field').setRequired(true));
cmd.addBooleanOption(new SlashCommandBooleanOption().setName('inline').setDescription('Keep the field inline or not?').setRequired(true));

export const EmbedAddServerCommand: ICommand = {
    adminOnly: true,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const msgOpt = interaction.options.getString('message_id', true);
        const hostOpt = interaction.options.getString('host', true);
        const titleOpt = interaction.options.getString('title', true);
        const descOpt = interaction.options.getString('description', true);
        const inlineOpt = interaction.options.getBoolean('inline', true);

        let data: FiveMConfig | undefined;
        let dataIndex = 0;
        for (let i = 0; i < config.data.fivemData.length; i++) {
            const fData = config.data.fivemData[i];
            if (fData.embed.messageId == msgOpt) {
                data = fData;
                dataIndex = i;
                break;
            }
        }

        if (!data) {
            await interaction.editReply('Message does not exist!');
            return;
        }

        let parsedHost = hostOpt;
        if (ipPattern.test(hostOpt)) {
            parsedHost = `http://${hostOpt}`;
        } else if (domainPattern.test(hostOpt)) {
            parsedHost = `https://${hostOpt}`;
        } else {
            await interaction.editReply('Invalid host! example: `abc.raznar.id` or `127.0.0.1:30120`');
            return;
        }

        if (!data.embed.channelId || !data.embed.messageId) {
            await interaction.editReply('The embed data from fivem is not completed! cannot update.');
            return;
        }

        const channel = (await client.channels.fetch(data.embed.channelId)) as TextBasedChannel;
        if (!channel) {
            await interaction.editReply('The channel from fivem data does not exists!');
            return;
        }

        const msg = await channel.messages.fetch(msgOpt);
        if (!msg) {
            await interaction.editReply('The message does not exists!');
            return;
        }

        const serverData = {
            host: parsedHost,
            title: titleOpt,
            description: descOpt.replaceAll('%host%', parsedHost),
            inline: inlineOpt,
        };

        config.data.fivemData[dataIndex].servers.push(serverData);
        await updateMessage(client, config.data.fivemData[dataIndex]);
        config.save();
        await interaction.editReply('The embed is updated successfully!');
    },
};
