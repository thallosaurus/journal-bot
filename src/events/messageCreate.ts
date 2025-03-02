import { Bot } from "../../bot.ts";

import log from "../utils/logger.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { db, userIsOptedIn } from "../database/messages.ts";
import { addAttachment } from "../database/mod.ts";

Bot.events.messageCreate = (_, payload) => {
  //log.info(`[READY] Shard ID ${payload.shardId} of ${Bot.gateway.maxShards} shards is ready!`);

  if (!payload.isBot && userIsOptedIn(payload.channelId, payload.authorId)) {
    const timestamp = snowflakeToTimestamp(payload.id)

    console.log(payload);

    log.info(`[${timestamp}] Received message "${payload.content}"`)
    insertMessage(
      payload.id,
      payload.authorId,
      payload.channelId,
      timestamp,
      payload.content);

    const images = payload.attachments.filter(a => a.contentType && /image\/./.test(a.contentType))
    Promise.all(images.map((i) => {
      return downloadAttachment(i.url);
    }))
      .then(data => {
        for (const img of data) {
          addAttachment(payload.id, img)
        }
      }).then(e => Bot.helpers.addReaction(payload.channelId, payload.id, "🪬"));
  } else return;
};

/*Bot.events.messageUpdate = (_, payload) => {
  console.log(payload);
}*/
function insertMessage(id: bigint, author: bigint, origin: bigint, timestamp: number, content: string) {
  db.query("INSERT INTO messages (id, author, origin, timestamp, content) VALUES (?, ?, ?, ?, ?)", [id, author, origin, timestamp, content]);
}

async function downloadAttachment(url: string) {
  let data = await fetch(url);
  return new Uint8Array(await data.arrayBuffer());
}