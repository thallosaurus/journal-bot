import { ApplicationCommandTypes, Errors, InteractionResponseTypes } from "../../deps.ts";
import { addAttachment, insertMessage, userIsOptedIn } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "import_message",
  description: "Manually save this message to the Bot Cache",
  type: ApplicationCommandTypes.Message,
  execute: async (Bot, interaction) => {
    const errors = [];
    if (interaction.data) {

      if (interaction.data.resolved) {
        if (interaction.data.resolved.messages) {
          try {

            for (const [id, msg] of interaction.data?.resolved?.messages?.entries()) {
              console.log(msg);

              if (!msg.interaction) {
                // TODO cumulative error handling 
                continue;
              }
              
              if (userIsOptedIn(msg.channelId, msg.interaction?.user.id)) {

                const timestamp = snowflakeToTimestamp(id)
                
                insertMessage(
                  id,
                  msg.authorId,
                  msg.channelId,
                  timestamp,
                  msg.content);
                } else {
                  errors.push(`User <@${msg.authorId}> is not monitored, will not add...`);
                }
            }
          } catch (e) {
            console.error(e);
            await Bot.helpers.sendInteractionResponse(
              interaction.id,
              interaction.token,
              {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                  content: `${e}`,
                },
              },
            );
          }
          if (interaction.data.resolved.attachments) {
            // TODO
            console.log(interaction.data.resolved.attachments)
          }
        }
      }
    }

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `Import finished! Errors:\n${errors.join("\n")}`,
        },
      },
    );
  },
});
