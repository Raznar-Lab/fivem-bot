import { Config } from '../config';
import { REST, Client, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody, GuildMember } from 'discord.js';
import { ICommand } from '../typings/commands';
import { PingCommand } from './ping';
import { ReloadCommand } from './reload';
import { FiveMCommands } from './fivem';
import { ClaimRolesCommand } from './claim_roles';

const commands: ICommand[] = [PingCommand, ReloadCommand, ...FiveMCommands, ...ClaimRolesCommand];
export const loadCommandEvents = (client: Client<true>, config: Config) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isChatInputCommand()) {
            for (const cmd of commands) {
                if (cmd.data.name == interaction.commandName) {
                    const member = interaction.member! as GuildMember;
                    if (config.data.adminRoles.length > 0 && !member.roles.cache.some((s) => config.data.adminRoles.includes(s.id))) {
                        console.log(`[${new Date().toISOString()}] [${interaction.user.username}] command /${interaction.commandName} on ${interaction.guild!.name} guild rejected`);
                        await interaction.editReply('You do not have permission to run this command!');
                        return;
                    }

                    console.log(`[${new Date().toISOString()}] [${interaction.user.username}] executed command /${interaction.commandName} on ${interaction.guild!.name} guild`);
                    await cmd.execute(config, client, interaction);
                }
            }
        }
    });
};

export const updateCommandsGuilds = async (client: Client<true>, commandsJSON: RESTPostAPIChatInputApplicationCommandsJSONBody[]) => {
    const guilds = await client.guilds.fetch();
    const guildNames = guilds.map((g, gId) => gId);
    guilds.clear();

    const rest = new REST().setToken(client.token);
    console.log(`Started refreshing ${commands.length} application (/) commands for ${guildNames.length} guild(s).`);

    let total = 0;
    for (const gId of guildNames) {
        const data = await rest.put(Routes.applicationGuildCommands(client.user.id, gId), {
            body: commandsJSON,
        });

        if (data) total += (data as []).length;
    }

    console.log(`Successfully reloaded ${total} application (/) commands.`);
};

export const loadCommands = (): RESTPostAPIChatInputApplicationCommandsJSONBody[] => {

    const commandsJSON: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    for (const cmd of commands) {
        const data = cmd.data.toJSON();
        commandsJSON.push(data);
    }

    return commandsJSON;
};
