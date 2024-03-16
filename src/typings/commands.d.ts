import { CacheType, ChatInputCommandInteraction, Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Config } from '../config';

export interface ICommand {
    data: SlashCommandBuilder;
    adminOnly: boolean;
    execute: (config: Config, client: Client<true>, interaction: ChatInputCommandInteraction) => Promise<void>;
}
