import { DB, Interaction, User } from "../../deps.ts";

export const db = new DB("test.db");

const tables = await Deno.readTextFile("database.sql")
db.execute(tables);

export function optoutUser(interaction: Interaction) {
  if (userIsOptedIn(interaction.channelId!, interaction.user.id)) {
    db.query("DELETE FROM users WHERE id = ? and channelId = ?", [interaction.user.id, interaction.channelId])
  } else {
    throw new Error("user not opted in");
  }
}

/**
 * Opts the user in for monitoring in the specified channel or chat
 * @param origin 
 * @param user 
*/
export function optinUser(interaction: Interaction) {
  if (!userIsOptedIn(interaction.channelId!, interaction.user.id)) {
    db.query("INSERT INTO users (id, username, channelId) VALUES (?, ?, ?)", [interaction.user.id, interaction.user.username, interaction.channelId!])
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

export function addAttachment(id: bigint, data: Uint8Array, mime: string) {
  db.query("INSERT INTO attachments (id, data, mime) VALUES (?, ?, ?)", [id, data, mime])
}

export function userIsOptedIn(channelId: bigint, userid: bigint) {
  const [ex] = db.query("SELECT COUNT(*) AS ex FROM users WHERE id = ? AND channelId = ?", [userid, channelId]);
  //console.log(`Ex: ${ex}`)
  return Boolean(ex[0]);
}

export function getMonitoredChannelsForUser(userid: bigint) {
  const channels = db.query("SELECT channelId FROM users WHERE id = ?",[userid]);
  console.log(channels);
  return channels.flat() as bigint[];
}

export function getMessageRecordsForAuthorIdAndChannelId(start: number, end: number, author: bigint, channelId: bigint) {
  const msgs = db.query("SELECT username || ': ' || content FROM messages JOIN users ON messages.author = users.id AND users.channelId = ? WHERE timestamp > ? AND timestamp < ? AND author = ? AND messages.origin = ? ORDER BY timestamp ASC", [channelId, start, end, author, channelId]);
  console.log(msgs);
  return msgs.flat() as [string];
}

export function getMessageRecordsForChannelId(start: number, end: number, channelId: bigint) {
  const msgs = db.query("SELECT username || ': ' || content FROM messages JOIN users ON messages.author = users.id AND users.channelId = ? WHERE timestamp > ? AND timestamp < ? AND messages.origin = ? ORDER BY timestamp ASC", [channelId, start, end, channelId]);
  console.log(msgs.flat());
  return msgs.flat() as [string];
}

export function insertMessage(id: bigint, author: bigint, origin: bigint, timestamp: number, content: string) {
  db.query("INSERT INTO messages (id, author, origin, timestamp, content) VALUES (?, ?, ?, ?, ?)", [id, author, origin, timestamp, content]);
}