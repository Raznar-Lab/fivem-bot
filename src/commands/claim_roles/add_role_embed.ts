import { SlashCommandBuilder, SlashCommandRoleOption, SlashCommandStringOption } from 'discord.js';
import { ICommand } from '../../typings/commands';

const cmd = new SlashCommandBuilder().setName('add-role-embed').setDescription('Add the role to the claim role embed!');

cmd.addStringOption(new SlashCommandStringOption().setName('message_id').setDescription('The message embed ID of this channel (right click the embed to get the ID) - requires developer mode').setRequired(true));
cmd.addRoleOption(new SlashCommandRoleOption().setName('role').setDescription('The role to be added').setRequired(false));
cmd.addRoleOption(new SlashCommandRoleOption().setName('required_role').setDescription('The required role to be added').setRequired(false));

export const AddRoleEmbedCommand: ICommand = {
    adminOnly: true,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const messageIdOpt = interaction.options.getString('message_id', true);
        const roleOpt = interaction.options.getRole('role', false);
        const requiredRoleOpt = interaction.options.getRole('required_role', false);

        if (!roleOpt && !requiredRoleOpt) {
            await interaction.editReply('You must atleast provide one role!');
            return;
        }

        const claimRoleConf = config.data.claimRole.claims.find((v) => v.embed.messageId == messageIdOpt);
        if (!claimRoleConf) {
            await interaction.editReply('Cannot find the message!');
            return;
        }

        let changes = 0;
        if (roleOpt && !claimRoleConf.roles.includes(roleOpt.id)) {
            changes++;
            claimRoleConf.roles.push(roleOpt.id);
        }
        if (requiredRoleOpt && !claimRoleConf.requiredRoles.includes(requiredRoleOpt.id)) {
            changes++;
            claimRoleConf.requiredRoles.push(requiredRoleOpt.id);
        }

        config.save();
        await interaction.editReply(changes > 0 ? `Successfully updated, ${changes} changes` : `Updated, but there is no changes.`);
    },
};
