import { Bot } from "../../bot.ts";

import log from "../utils/logger.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { db, userIsOptedIn } from "../database/messages.ts";

Bot.events.messageCreate = (_, payload) => {
  //log.info(`[READY] Shard ID ${payload.shardId} of ${Bot.gateway.maxShards} shards is ready!`);
  //console.log(payload);

  
  if (userIsOptedIn(payload.channelId, payload.authorId)) {
    const timestamp = snowflakeToTimestamp(payload.id)
    
    log.info(`[${timestamp}] Received message "${payload.content}"`)
    insertMessage(
      payload.id,
      payload.authorId,
      payload.channelId,
      timestamp,
      payload.content);

      Bot.helpers.addReaction(payload.channelId, payload.id, "🪬");
  } else return;
};

/*Bot.events.messageUpdate = (_, payload) => {
  console.log(payload);
}*/
function insertMessage(id: bigint, author: bigint, origin: bigint, timestamp: number, content: string) {
  db.query("INSERT INTO messages (id, author, origin, timestamp, content) VALUES (?, ?, ?, ?, ?)", [id, author, origin, timestamp, content]);
}