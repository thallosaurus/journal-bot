import { ai } from "../../configs.ts";
import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { getMessageRecordsForChannelId } from "../database/messages.ts";

import { getMessageRecordsForAuthorIdAndChannelId } from "../database/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "generate",
  description: "Manually create a journalling entry for your messages!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    //const ping = Date.now() - snowflakeToTimestamp(interaction.id);

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Queued Journal Generation, please wait...",
        },
      },
    );

    Bot.helpers.startTyping(interaction.channelId!);
    
    // get messages of this day
    let d = new Date(snowflakeToTimestamp(interaction.id));
    
    const [startDate, endDate] = [new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0), new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0)];
    
    if (interaction.channelId) {
      const records = getMessageRecordsForChannelId(startDate.getTime(), endDate.getTime(), interaction.channelId)
      
      //const newEntry = await generateJournalEntry(records);
      const newEntry = await ai.query(records);
      
      //console.log(newEntry);
      
      await Bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: newEntry,
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
            content: `Journalling not supported over this channel`,
          },
        },
      );
    }
  },
});
