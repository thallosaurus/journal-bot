import ollama, { Message, ModelResponse } from 'ollama';
import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from "../deps.ts";
import { encodeBase64 } from "jsr:@std/encoding/base64";

interface ImageRequest {
    mimetype: string;
    data: Uint8Array;
}

export abstract class BotBackend {
    abstract init(): void;
    abstract query(entries: [string]): Promise<string>;
    abstract query_image(request: ImageRequest): Promise<string>;
    abstract chat(prompt: string): Promise<string>;

    readonly system_prompt = "Your job is it to create Wiki-like entries that read like blog-entries. The main topic is about the life of those which write the messages. Most of the messages are from my personal discord servers and may contain more than one actors. Write as if you were a human and dont make it too, the entries represent a conversation that contains information but dont tell this the reader. The format of the messages is as follows: [$timestamp] $username: $message_content."
    readonly image_prompt = "What is in this image?"

    static async make() {
        const make_backend = () => {
            switch (Deno.env.get("BOT_BACKEND")) {
                case "gemini":
                    return new GeminiBackend();

                case "ollama":
                default:
                    return new OllamaBackend();
            };
        }
        const backend = make_backend();
        await backend.init();
        return backend;
    }
}

class GeminiBackend extends BotBackend {
    override chat(prompt: string): Promise<string> {
        return this.model.generateContent(prompt).then((result: any) => {
            return result.response.text();
        });
    }
    override query_image(request: ImageRequest): Promise<string> {
        const text_part = {
            text: this.image_prompt
        };

        const image_part = {
            fileData: {
                mimeType: request.mimetype,
                fileUri: encodeBase64(request.data)
            }
        }
        return this.model.generateContent({
            contents: [{
                role: "user", parts: [text_part, image_part]
            }]
        }).then(res => {
            return res.response.text();
        })
    }
    private model!: GenerativeModel;
    override init() {
        return new Promise((res) => {
            const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") ?? "");
            this.model = genAI.getGenerativeModel({ model: Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash", systemInstruction: this.system_prompt });
            res(null);
        })
    }
    override query(entries: string[]): Promise<string> {
        const prompt = createPrompt(entries);
        return this.model.generateContent(prompt).then((result: any) => {
            return result.response.text();
        });
    }
}

class OllamaBackend extends BotBackend {
    override chat(prompt: string): Promise<string> {
        const message: Message = { role: 'user', content: prompt };

        return ollama.chat({
            model: this.targetModel,
            messages: [message],
            stream: false,
        }).then(result => {
            return result.message.content;
        });
    }
    override query_image(request: ImageRequest): Promise<string> {

        const message: Message = { role: 'user', images: [request.data], content: "What do you see in the attachment?" };
        return ollama.chat({
            model: this.targetVisionModel,
            messages: [message],
            stream: false,
        }).then(e => {
            return e.message.content;
        });
    }
    readonly targetModel = Deno.env.get("OLLAMA_MODEL") ?? "llama2-uncensored:latest";
    readonly targetVisionModel = Deno.env.get("OLLAMA_VISION_MODEL") ?? "llava:latest";

    override init() {
        ollama.list().then(({ models }) => {
            return Promise.allSettled([
                this.checkAndPullModel(models, this.targetModel),
                this.checkAndPullModel(models, this.targetVisionModel)
            ]);
        });
    }

    private checkAndPullModel(models: ModelResponse[], modelName: string) {
        if (!models.some((model) => model.name === modelName)) {

            console.log(`Model not found. Pulling ${modelName}...`);
            //const res = await ollama.pull({ model: targetModel, stream: true });

            return ollama.pull({ model: modelName }).then(() => {
                console.log(`Finished pull of ${modelName}`)
            })
        } else {
            console.log(`${modelName} already downloaded`)
            return;
        }
    }

    override query(entries: string[]): Promise<string> {
        const prompt = createPrompt(entries);
        const system: Message = { role: 'system', content: this.system_prompt };
        const message: Message = { role: 'user', content: prompt };

        return ollama.chat({
            model: this.targetModel,
            messages: [system, message],
            stream: false,
        }).then(result => {
            return result.message.content;
        });
    }
}

function createPrompt(entries: string[]): string {
    //return `In the next paragraph the user has attached all their messages of the day in chronologic ascending order and your job is it to create a journalling entry for this day. Focus on important things and create a good looking entry.
    return entries.map(e => `- ${e}`).join("\n")
}
