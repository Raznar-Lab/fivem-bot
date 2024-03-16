import { GuildMember } from 'discord.js';
import { IButton } from '../typings/button';
import { IClaimRole } from '../typings/claim_roles';

export const ClaimRoleButton: IButton = {
    execute: async (client, config, interaction) => {
        let claimRoleData: IClaimRole | undefined;
        let claimIndex = 0;

        for (let i = 0; i < config.data.claimRole.claims.length; i++) {
            if (config.data.claimRole.claims[i].embed.custom_id == interaction.customId) {
                claimRoleData = config.data.claimRole.claims[i];
                claimIndex = i;
                break;
            }
        }

        if (!claimRoleData) {
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        const member = interaction.member! as GuildMember;
        if (claimRoleData.requiredRoles.length > 0 && !member.roles.cache.some((s) => claimRoleData.requiredRoles.includes(s.id))) {
            interaction.editReply("You don't have permission to execute this button!");
            return;
        }

        const claimedRoles = member.roles.cache.filter((role) => claimRoleData.roles.includes(role.id));
        if (claimedRoles.size >= claimRoleData.roles.length) {
            await interaction.editReply(config.data.claimRole.lang.alreadyClaimed.replaceAll('%role_list%', claimRoleData.roles.map((role) => `<@&${role}>`).join(', ')));
            return;
        }

        for (const roleID of claimRoleData.roles) {
            const role = interaction.guild!.roles.cache.find((role) => role.id === roleID);
            if (!role) continue;

            await member.roles.add(role);
        }

        await interaction.editReply(config.data.claimRole.lang.claimed.replaceAll('%role_list%', claimRoleData.roles.map((role) => `<@&${role}>`).join(', ')));
    },
};
