import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "recog",
  description: "Queries the AI for image recognition!",
  type: ApplicationCommandTypes.Message,
  execute: async (Bot, interaction) => {

    console.log(interaction);
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `🏓 Pong! ${ping}ms`,
        },
      },
    );
  },
});
