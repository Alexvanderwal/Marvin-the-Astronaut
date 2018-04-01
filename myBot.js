const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix || message.author.bot)) return;

  if (command === 'ping') {
    message.channel.send("pong!");
  }
  if (command === "asl") {
    let age = args[0]; // Remember arrays are 0-based!.
    let sex = args[1];
    let location = args[2];
    message.reply(`Hallo ${message.author.username}, Ik zie dat je ${age} jaar oud en een ${sex} bent uit ${location}. Wil je me klapjes geven?`);
  }
  if (command === "avatar"){
    message.reply(message.author.avatarURL);
  }
  // Commands for Haan#0420 only
  if(message.author.id !== config.ownerID) return;
});

client.login(config.token);