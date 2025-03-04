import "../configs.ts";
import { BotBackend } from "../ollama/BotBackend.ts";

//console.log(Deno.env)

const bot = BotBackend.make();

console.log(await bot.query([
    "heute war ich mal bei der tanke und hab mir n monster gekauft", 
    "digga die pisse schmeckt reudig af",
    "welcher hurensohn hat sich die scheiße ausgedacht xd"
]));