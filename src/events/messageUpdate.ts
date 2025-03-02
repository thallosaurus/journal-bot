import { Bot } from "../../bot.ts";
import { updateMessageId } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import log from "../utils/logger.ts";

Bot.events.messageUpdate = (_, payload) => {
    console.log("message update");
    const timestamp = snowflakeToTimestamp(payload.id);
    console.log(payload);
    log.info(`[${timestamp}] Received update "${payload.content}"`);
    updateMessageId(payload.id, payload.content);
}