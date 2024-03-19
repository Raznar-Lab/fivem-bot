import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { ICommand } from '../typings/commands';
import { updateClaimRoleEmbeds, updateServerEmbeds } from '../embed';

export const ReloadCommand: ICommand = {
    adminOnly: true,
    data: new SlashCommandBuilder().setName('reload').setDescription('Reloads the bot config.'),
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply("Reloading config, this might take time...")
        const startTime = new Date().getMilliseconds();
        config.load();
        await updateServerEmbeds(client, config);
        await updateClaimRoleEmbeds(client, config);
        const timeTook = new Date().getMilliseconds() - startTime;
        await interaction.editReply(`Reloaded config, took \`${timeTook > 1000 ? timeTook.toFixed(2) : timeTook}ms\``);
    },
};
