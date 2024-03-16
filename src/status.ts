import { ActivityType, Client } from "discord.js";
import { FiveMMainServerConfig } from "./typings/config";
import axios from "axios";

let curInterval: NodeJS.Timeout | undefined;
export const updateInterval = (client: Client<true>, data: FiveMMainServerConfig) => {
    if (data.interval > 2) {
        if (curInterval) clearInterval(curInterval);
        start(client, data);
        return;
    }

    console.log("[WARNING] Not starting interval - interval is set lower than 3 seconds.")
};

const start = (client: Client<true>, data: FiveMMainServerConfig) => {
    curInterval = setInterval(async () => {
        try {
            const res = await axios.get(`${data.host}/players.json`)
            client.user.setActivity({
                type: ActivityType.Watching,
                name: `[${res.data.length}/${data.maxPlayer}] on ${data.name}`
            })
        } catch(err) {
            console.log("Failed to update activity, perhaps the host is not valid?")
        }
    }, data.interval * 1000);
};
