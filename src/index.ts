import { loadCommands, loadEvents, updateCommandsGuilds } from './commands';
import { Config } from './config';
import { Client, GatewayIntentBits } from 'discord.js';
import { updateInterval } from './status';

const config = new Config();
const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]
});

config.setFilePath("config.yml");
config.load();
client.login(config.data.token);

client.on('ready', async (cl) => {
    config.load();
    console.log("Logged in!");
    
    loadEvents(cl);
    const data = loadCommands(config);
    await updateCommandsGuilds(cl, data);
    updateInterval(cl, config.data.main)
})