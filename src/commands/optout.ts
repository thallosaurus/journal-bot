import { ApplicationCommandTypes, InteractionResponseTypes, User } from "../../deps.ts";
import { db, optoutUser } from "../database/messages.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "optout",
  description: "Opts yourself out of journalling",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    //    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    // check if user is already opted in

    if (interaction.channelId) {

      try {
        optoutUser(interaction.channelId, interaction.user);
        await Bot.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Optout successful for ${interaction.user.username}`,
            },
          },
        );
      } catch (e) {
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
    } else {
      await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: `Messagetracking is not supported for this channel`,
          },
        },
      );
    }
  },
});
