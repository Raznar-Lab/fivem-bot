import { Client } from 'discord.js';
import { IButton } from '../typings/button';
import { Config } from '../config';
import { ClaimRoleButton } from './claim_roles';

const buttons: IButton[] = [ClaimRoleButton];
export const loadButtonEvents = (client: Client, config: Config) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) {
            return;
        }

        for (const button of buttons) {
            await button.execute(client, config, interaction);
        }
    });
};
