import { Bot } from "../../bot.ts";

import log from "../utils/logger.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { userIsOptedIn } from "../database/mod.ts";
import { addAttachment, insertMessage } from "../database/mod.ts";

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

    const images = payload.attachments.filter(a => a.contentType && /image\/./.test(a.contentType));

    Promise.all(images.map(async (i) => {
      const data = await downloadAttachment(i.url);
      return { data, mime: i.contentType! };
    })).then(d => {
      for (const img of d) {
        addAttachment(payload.id, img.data, img.mime)
      }
    }).then(e => Bot.helpers.addReaction(payload.channelId, payload.id, "🪬"));

  } else return;
};

/*Bot.events.messageUpdate = (_, payload) => {
  console.log(payload);
}*/


async function downloadAttachment(url: string) {
  let data = await fetch(url);
  return new Uint8Array(await data.arrayBuffer());
}