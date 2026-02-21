require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const badWords = ["amk", "salak", "küfür"];

client.on("ready", () => {
  console.log(`${client.user.tag} aktif!`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (badWords.some(word => message.content.toLowerCase().includes(word))) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, küfür yasak!`);
  }

  if (message.content.length > 6 &&
      message.content === message.content.toUpperCase()) {
    await message.delete().catch(() => {});
    return message.channel.send(`${message.author}, caps kullanma!`);
  }

  if (message.content.startsWith("!mute")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("Yetkin yok!");

    const user = message.mentions.members.first();
    if (!user) return message.reply("Birini etiketle!");

    await user.timeout(10 * 60 * 1000).catch(() => {});
    message.channel.send(`${user.user.tag} susturuldu.`);
  }

  if (message.content.startsWith("!ban")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("Yetkin yok!");

    const user = message.mentions.members.first();
    if (!user) return message.reply("Birini etiketle!");

    await user.ban().catch(() => {});
    message.channel.send(`${user.user.tag} banlandı.`);
  }

  if (message.content === "!ticket") {
    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      permissionOverwrites: [
        { id: message.guild.id, deny: ["ViewChannel"] },
        { id: message.author.id, allow: ["ViewChannel"] }
      ]
    });

    channel.send("Destek ekibi seninle ilgilenecek.");
  }
});

client.login(process.env.TOKEN);
