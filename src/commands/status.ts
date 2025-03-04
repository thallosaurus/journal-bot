import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { getMonitoredChannelsForUser, userIsOptedIn } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

function createStatusMessage(channels: bigint[]) {
  return`I am monitoring the following channels for you:\n
${channels.map((id) => { return `<#${id}>` }).join("\n")}

If I should stop to journal your messages, go to the channel and type \`/optout\``;
}

createCommand({
  name: "status",
  description: "show the opt status!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    const data = getMonitoredChannelsForUser(interaction.user.id);

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: createStatusMessage(data)
        },
      },
    );
  },
});
