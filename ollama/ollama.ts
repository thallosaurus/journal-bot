import ollama, { Message } from 'ollama';

import ProgressBar from "https://deno.land/x/progressbar@v0.2.0/progressbar.ts";
import {
  percentageWidget,
  amountWidget,
} from "https://deno.land/x/progressbar@v0.2.0/widgets.ts";


const targetModel = 'llama2-uncensored';
//const targetModel = 'tinyllama';
console.log(`Model: ${targetModel}`);

const { models } = await ollama.list();
if (!models.some((model) => model.name === targetModel)) {
  
  console.log(`Model not found. Pulling ${targetModel}...`);
  //const res = await ollama.pull({ model: targetModel, stream: true });
  
  for await (const val of await ollama.pull({ model: targetModel, stream: true})) {
    console.log(val);
  }

  //console.log(`Model pulled.`, res);
}

export async function generateJournalEntry(messages: [string]) {
  const prompt = createPrompt(messages);
  const system: Message = { role: 'system', content: system_prompt };
  const message: Message = { role: 'user', content: prompt };

  return await ollama.chat({
    model: targetModel,
    messages: [system, message],
    stream: false,
  });
}



//console.log(response.message.content);