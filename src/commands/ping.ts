import { SlashCommandBuilder } from 'discord.js';
import { ICommand } from '../typings/commands';

export const PingCommand: ICommand = {
    adminOnly: false,
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        await interaction.editReply('pong!');
    },
};
