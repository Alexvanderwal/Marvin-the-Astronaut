const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
    //Console stuff
    console.log("Marvin wilt mishandeld worden door jou!");

    //Status
    client.user.setActivity('sick supernovas in space', {type: 'WATCHING'})
});



client.on("message", (message) => {
  if(message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix)) return;

  // list with commands
  if (command === 'ping') {
    message.channel.send("pong!");
  }

  if (command === "asl") {
    let age = args[0]; // Remember arrays are 0-based!.
    let sex = args[1];
    let location = args[2];
    message.channel.send(`Hallo ${message.author.username}, Ik zie dat je ${age} jaar oud en een ${sex} bent uit ${location}. Wil je me klapjes geven?`);
  }

  if (command === "avatar"){
    message.reply(message.author.avatarURL);
  }

  if (command === "bestenummer"){
    message.channel.send('Ey swa, gozer. Dat lijkt me nogal wiedes, ea. Is Toto Africa natuurlijk, of nie dan.')
    message.channel.send('https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX?si=UxTPgKJrR9i8kELKmUaaog');
  }

  if (command === "stuurselfie"){
    message.channel.send("Ikke zit gewoon effe lekker te bakken op de maan, ja. Kusjes en een zelfje",
    {"files": ["https://i.pinimg.com/originals/26/cf/26/26cf26b1e1e98ae0eb49bf5e58736cb2.jpg"]});
  }

  if (command === "bak"){
    message.channel.send(`haha, onze beste makker ${message.author} gaat een rookje doen.`);
  }
  //nutteloos lijstje van hoe high ik ben
  if (command === "0"){
    message.channel.send(`Het ziet er naar uit dat ${message.author} nog op planeet Aarde is.`),
    message.channel.send(`Kan iemand wat wiet voor hem regelen?! <:wooooOOOOOOOOOOWWWWWW:432266541778731018>`);
  }

  // Admin commands
  // Commands for Haan#0420 only
  if(message.author.id !== '189716214795337729') return;
});

client.login(config.token);
