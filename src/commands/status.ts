import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { userIsOptedIn } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";


createCommand({
  name: "status",
  description: "show the opt status!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {

    if (interaction.channelId) {
      await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: `Status: Opted ${userIsOptedIn(interaction.channelId, interaction.user.id) ? "**IN**" : "**OUT**"} of journaling for channel <#${interaction.channelId}>`,
          },
        },
      );
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
