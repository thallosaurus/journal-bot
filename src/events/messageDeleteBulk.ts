import { Bot } from "../../bot.ts";
import { deleteMessageBulk } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import log from "../utils/logger.ts";

Bot.events.messageDeleteBulk = (_, payload) => {
    console.log("delete bulk");
    //const timestamp = snowflakeToTimestamp(payload.id);
    console.log(payload);
    //log.info(`[${timestamp}] Received message delete`);

    deleteMessageBulk(payload.ids);
}