import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from 'discord.js';
import { ICommand } from '../../typings/commands';
import axios from 'axios';
import { updateInterval } from '../../status';
import { domainPattern, ipPattern } from '../../constants';

const cmd = new SlashCommandBuilder().setName('set-main-server').setDescription('Set the main server to update the status');
cmd.addStringOption(new SlashCommandStringOption().setName('server_host').setDescription('Server Host').setRequired(true));
cmd.addStringOption(new SlashCommandStringOption().setName('server_name').setDescription('Server Name').setRequired(true));
cmd.addIntegerOption(new SlashCommandIntegerOption().setName('update_interval').setDescription('The update interval in seconds (min: 3)').setRequired(false));

export const SetMainServer: ICommand = {
    adminOnly: true,
    data: cmd,
    execute: async (config, client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const curTime = new Date().getMilliseconds();
        const hostOpt = interaction.options.getString('server_host', true);
        const nameOpt = interaction.options.getString('server_name', true);
        const intervalOpt = interaction.options.getInteger('update_interval', false);

        if (intervalOpt) {
            if (intervalOpt < 3) {
                await interaction.editReply('The interval should not be lower than 3!');
                return;
            }

            config.data.fivemMain.interval = intervalOpt;
        }

        config.data.fivemMain.name = nameOpt;
        if (ipPattern.test(hostOpt)) {
            config.data.fivemMain.host = `http://${hostOpt}`;
        } else if (domainPattern.test(hostOpt)) {
            config.data.fivemMain.host = `https://${hostOpt}`;
        } else {
            await interaction.editReply('Invalid host! example: `abc.raznar.id` or `127.0.0.1:30120`');
            return;
        }

        try {
            const data = await axios.get(`${config.data.fivemMain.host}/info.json`);
            if (data.data != null) {
                config.data.fivemMain.maxPlayer = data.data.vars.sv_maxClients;
            }
        } catch (e) {
            await interaction.editReply('Cannot retrieve data from host!');
            return;
        }

        config.save();
        updateInterval(client, config.data.fivemMain);
        const newTime = new Date().getMilliseconds() - curTime;
        await interaction.editReply(`Updated, took \`${newTime > 1000 ? newTime.toFixed(2) : newTime}ms\``);
    },
};
