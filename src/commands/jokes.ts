import { ai } from "../../configs.ts";
import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "joke",
  description: "generates the unfunniest joke of all time!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    const prompt = "Tell me the worst and unfunniest joke known to mankind. It must be so unfunny that my mother will roll in her grave because it is so bad"

    const msg = await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Okay, get ready! I'm thinking...`,
            },
        },
      );

    const answer = await ai.chat(prompt);

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `${answer}`,
        },
      },
    );
  },
});
