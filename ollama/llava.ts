import ollama, { Message } from 'ollama';

const targetModel = 'llava';
//const targetModel = 'tinyllama';
console.log(`Model: ${targetModel}`);
//const system_prompt = "Your job is it to create Wiki-like entries that read like blog-entries. The main topic is about the life of those which write the messages. Most of the messages are from my personal discord servers and may contain more than one actors. Write as if you were a human and dont make it too, the entries represent a conversation that contains information but dont tell this the reader. The format of the messages is as follows: [$timestamp] $username: $message_content."

const { models } = await ollama.list();
if (!models.some((model) => model.name === targetModel)) {
  console.log(`Model not found. Pulling...`);
  const res = await ollama.pull({ model: targetModel });
  console.log(`Model pulled.`, res);
}

export async function llavatest(images: Uint8Array[]) {

  //const prompt = createPrompt(messages);

  //console.log(prompt)

  //const system: Message = { role: 'system', content: system_prompt };
  //const message: Message = { role: 'user', content: prompt };
  const message: Message = { role: 'user', images, content: "What do you see in the attachment?" };
  return await ollama.chat({
    model: targetModel,
    messages: [message],
    stream: false,
  });
}