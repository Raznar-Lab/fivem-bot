import { ButtonInteraction, Client } from "discord.js";
import { Config } from "../config";

export interface IButton {
    execute: (client: Client, config: Config, interaction: ButtonInteraction) => Promise<void>
}