import { DB, Interaction, User } from "../../deps.ts";

export const db = new DB("test.db");

const tables = await Deno.readTextFile("database.sql")
db.execute(tables);

export function optoutUser(interaction: Interaction) {
  if (userIsOptedIn(interaction.guildId!, interaction.user.id)) {
    db.query("DELETE FROM users WHERE id = ? and origin = ?", [interaction.user.id, interaction.guildId])
  } else {
    throw new Error("user not opted in");
  }
}

/**
 * Opts the user in for monitoring in the specified guild or chat
 * @param origin 
 * @param user 
*/
export function optinUser(interaction: Interaction) {
  if (!userIsOptedIn(interaction.guildId!, interaction.user.id)) {
    db.query("INSERT INTO users (id, username, origin) VALUES (?, ?, ?)", [interaction.user.id, interaction.user.username, interaction.guildId!])
  } else {
    throw new Error("user already opted in");
  }
}

export function updateMessageId(id: bigint, content: string) {
  db.query("UPDATE messages SET content = ? WHERE id = ?", [content, id]);
}

export function deleteMessageId(id: bigint) {
  db.query("DELETE FROM messages WHERE id = ?", [id]);
}

export function deleteMessageBulk(id: bigint[]) {
  db.query("DELETE FROM messages WHERE id IN (?)", [id.join(",")]);
}

export function addAttachment(id: bigint, data: Uint8Array) {
  db.query("INSERT INTO attachments (id, data) VALUES (?, ?)", [id, data])
}

export function userIsOptedIn(origin: bigint, userid: bigint) {
  const [ex] = db.query("SELECT COUNT(*) AS ex FROM users WHERE id = ? AND origin = ?", [userid, origin]);
  //console.log(`Ex: ${ex}`)
  return Boolean(ex[0]);
}

export function getMessageRecordsForAuthorIdAndChannelId(start: number, end: number, author: bigint, origin: bigint) {
  const msgs = db.query("SELECT username || ': ' || content FROM messages JOIN users ON messages.author = users.id WHERE timestamp > ? AND timestamp < ? AND author = ? AND messages.origin = ? ORDER BY timestamp ASC", [start, end, author, origin]);
  console.log(msgs);
  return msgs.flat() as [string];
}

export function getMessageRecordsForChannelId(start: number, end: number, origin: bigint) {
  const msgs = db.query("SELECT username || ': ' || content FROM messages JOIN users ON messages.author = users.id WHERE timestamp > ? AND timestamp < ? AND messages.origin = ? ORDER BY timestamp ASC", [start, end, origin]);
  console.log(msgs);
  return msgs.flat() as [string];
}