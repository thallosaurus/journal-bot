import { generateJournalEntry } from "../ollama/ollama.ts";
import { llavatest } from "../ollama/llava.ts";
import { getMessageRecordsForAuthorIdAndChannelId } from "../src/database/messages.ts";

const startDate = new Date(Date.now());
startDate.setHours(0);
startDate.setMinutes(0);
startDate.setSeconds(0);

const endDate = new Date(Date.now());
endDate.setHours(0);
endDate.setMinutes(0);
endDate.setSeconds(0);
endDate.setDate(endDate.getDate() + 1);

const records = getMessageRecordsForAuthorIdAndChannelId(startDate.getTime(), endDate.getTime(), BigInt(Deno.args[0]), BigInt(Deno.args[1]))
      
const newEntry = await generateJournalEntry(records)
console.log(newEntry.message.content);