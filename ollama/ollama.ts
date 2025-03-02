import ollama, { Message } from 'ollama';

const targetModel = 'llama2-uncensored';
//const targetModel = 'tinyllama';
console.log(`Model: ${targetModel}`);

const { models } = await ollama.list();
if (!models.some((model) => model.name === targetModel)) {
  console.log(`Model not found. Pulling...`);
  const res = await ollama.pull({ model: targetModel });
  console.log(`Model pulled.`, res);
}

//const textEncoder = new TextEncoder();

export async function generateJournalEntry(messages: [string]) {

  const prompt = createPrompt(messages);

  console.log(prompt)

  const message: Message = { role: 'user', content: prompt };
  return await ollama.chat({
    model: targetModel,
    messages: [message],
    stream: false,
  });
}

function createPrompt(entries: [string]): string {
  //return `In the next paragraph the user has attached all their messages of the day in chronologic ascending order and your job is it to create a journalling entry for this day. Focus on important things and create a good looking entry.
  // The format of the messages is as follows: [$timestamp] $username: $message_content.

  //TODO maybe rather realize this as system prompt?
  return `You are the backbone of journalling here. Your job is it to create Wiki-like entries that read like blog-entries. The main topic is about the life of those which write the messages. Most of the messages are from my personal discord servers and may contain more than one characters. Write them as good as you can and only output the resulting journal entry and nothing else. Also write as if you were a humhan and dont make it too technical and dont write as if they were chat messages, they represent a conversation that contains information. Dont tell this the reader.

You will now receive the list of todays messages:
${entries.map(e => `- ${e}`).join("\n")}`
}

//console.log(response.message.content);