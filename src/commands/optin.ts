import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { optinUser } from "../database/mod.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "optin",
  description: "Opts yourself in for journalling",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {

    if (interaction.channelId) {
      try {
        optinUser(interaction.channelId, interaction.user);
        await Bot.helpers.sendInteractionResponse(
          interaction.id,
          interaction.token,
          {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Optin successful for ${interaction.user.username}`,
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
              content: `You are already opted in`,
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

