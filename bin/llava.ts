import { llavatest } from "../ollama/llava.ts";

const image = await Deno.readFile("image.png");

const answer = await llavatest([image])
console.log(answer);