const { Client, GatewayIntentBits, Partials, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const prefix = ".";

client.on("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Komut: ban
  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("Ban yetkin yok.");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Bir kullanıcı etiketle.");
    member.ban().then(() => message.reply(`${member.user.tag} banlandı.`));
  }

  // Komut: unban
  else if (command === "unban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("Unban yetkin yok.");
    const userId = args[0];
    if (!userId) return message.reply("Kullanıcı ID gir.");
    message.guild.members.unban(userId)
      .then(() => message.reply(`ID ${userId} unbanlandı.`))
      .catch(() => message.reply("Unban başarısız."));
  }

  // Komut: kick
  else if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("Kick yetkin yok.");
    const member = message.mentions.members.first();
    if (!member) return message.reply("Bir kullanıcı etiketle.");
    member.kick().then(() => message.reply(`${member.user.tag} kicklendi.`));
  }

  // Komut: mute
  else if (command === "mute") {
    message.reply("Mute özelliği ekleniyor..."); // Detaylı mute ekleyeceğiz istersen
  }

  // Komut: unmute
  else if (command === "unmute") {
    message.reply("Unmute özelliği ekleniyor...");
  }

  // Komut: lock
  else if (command === "lock") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
    message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false,
    });
    message.reply("Kanal kilitlendi 🔒");
  }

  // Komut: unlock
  else if (command === "unlock") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
    message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: true,
    });
    message.reply("Kanal açıldı 🔓");
  }

  // Komut: herkesedm
  else if (command === "herkesedm") {
    if (message.guild.ownerId !== message.author.id) return message.reply("Sadece sunucu sahibi kullanabilir.");
    const mesaj = args.join(" ");
    if (!mesaj) return message.reply("Mesajı yazmadın.");
    message.guild.members.fetch().then(members => {
      members.forEach(member => {
        if (!member.user.bot) {
          member.send(mesaj).catch(() => {});
        }
      });
    });
    message.reply("Mesajlar gönderiliyor.");
  }

  // Komut: imha
  else if (command === "imha") {
    if (message.guild.ownerId !== message.author.id) return message.reply("Sadece sunucu sahibi kullanabilir.");
    message.guild.channels.cache.forEach(c => c.delete().catch(() => {}));
    setTimeout(() => {
      message.guild.channels.create({
        name: "🌋-son",
        permissionOverwrites: [{
          id: message.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.SendMessages],
        }],
      });
    }, 3000);
  }
});

// /scriptler (slash komut)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "scriptler") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("OP Farm").setStyle(ButtonStyle.Primary).setCustomId("opfarm"),
      new ButtonBuilder().setLabel("Sahte Mesaj").setStyle(ButtonStyle.Primary).setCustomId("sahtemesaj"),
      new ButtonBuilder().setLabel("Sahte Abuse").setStyle(ButtonStyle.Primary).setCustomId("sahteabuse"),
      new ButtonBuilder().setLabel("Araç Sürme").setStyle(ButtonStyle.Primary).setCustomId("aracsurme"),
      new ButtonBuilder().setLabel("Server Crash TA").setStyle(ButtonStyle.Danger).setCustomId("crash"),
      new ButtonBuilder().setLabel("TPT Eğitim").setStyle(ButtonStyle.Secondary).setCustomId("tpt"),
      new ButtonBuilder().setLabel("Bang Menu").setStyle(ButtonStyle.Success).set
