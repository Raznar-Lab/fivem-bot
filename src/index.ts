import { loadCommands, loadCommandEvents, updateCommandsGuilds } from './commands';
import { Config } from './config';
import { Client, GatewayIntentBits } from 'discord.js';
import { updateInterval } from './status';
import { updateServerEmbeds } from './embed';
import { loadButtonEvents } from './buttons';

const config = new Config();
const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds],
});

config.setFilePath('config.yml');
config.load();
client.login(config.data.token);

client.on('ready', async (cl) => {
    config.load();
    console.log('Logged in!');

    loadCommandEvents(cl, config);
    loadButtonEvents(cl, config);
    const data = loadCommands();
    await updateCommandsGuilds(cl, data);
    await updateServerEmbeds(cl, config);
    updateInterval(cl, config.data.fivemMain);
});
