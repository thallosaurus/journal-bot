import { Bot } from "../../bot.ts";
import { deleteMessageId } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import log from "../utils/logger.ts";

Bot.events.messageDelete = (_, payload) => {
    console.log("message delete");
    const timestamp = snowflakeToTimestamp(payload.id);
    console.log(payload);
    log.info(`[${timestamp}] Received message delete`);

    deleteMessageId(payload.id);
}