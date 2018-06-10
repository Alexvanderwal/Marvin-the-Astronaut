const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
    //Console stuff
    console.log("Marvin gaat er weer voor!");

    //Status
    client.user.setActivity('sick supernovas in space', {type: 'WATCHING'})
});



client.on("message", (message) => {
  if(message.author.bot) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const bericht = message.content.toLowerCase();
  // Exit and stop if it's not there
  if (bericht.includes('ruimte')){
    message.react('🌌')
  }
  if (bericht.includes('hoog')){
    message.react('☁')
  }

  if (!message.content.startsWith(config.prefix)) return;

  // list with commands
  if (command === 'ping') {
    message.channel.send("pong!");
  }

  if (command === "asl") {
    let [age, sex, location] = args;
    message.channel.send(`Hallo ${message.author.username}, Ik zie dat je ${age} jaar oud en een ${sex} bent uit ${location}. Wil je me klapjes geven?`);
  }

  if (command === "avatar"){
    message.reply(message.author.avatarURL);
  }

  if (command === "bestenummer"){
    message.channel.send('https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX?si=UxTPgKJrR9i8kELKmUaaog');
  }

  if (command === "stuurselfie"){
    message.channel.send("Ikke zit gewoon effe lekker te bakken op de maan, ja. Kusjes en een zelfje",
    {"files": ["https://i.pinimg.com/originals/26/cf/26/26cf26b1e1e98ae0eb49bf5e58736cb2.jpg"]});
  }
  if (command === "coolboi"){
    let rng = Math.floor(Math.random() * 101);
    if (rng === 69){
      message.channel.send(`haha seks <:huehuehuehuehuehue:438031814641057792>`);
    } else {
      message.channel.send(`Nou nou, heb jij een leuke command ontdekt die nog geen nuttige functie heeft? Goed bezig hoor, wat mij betreft is jouw coolheidsniveau ongeveer ${rng}. Lekker bezig, Pik! <:huehuehuehuehuehue:438031814641057792>`);
      }
    }
  if (command === "69"){
    message.channel.send('haha, 69 is het seksgetal, ik snap hem. Heel grappig, hoor.')
  }
  if (command === "rook"){
    message.channel.send(`Zo. ${message.author} doet nog wat extra rook in de innerlijke raket. Ga met ook mee op ruimtereis met ${message.author}!`);
  }
  //nutteloos lijstje van hoe high ik ben
  switch (command){
    case "0" :
      message.channel.send(`${message.author} is nog op planneet Aarde en verlangd nu simpelweg naar een reis in het universum.`);
      break;
    case "1" :
      message.channel.send(`${message.author} is net van de grond maar zit nog wel in de atmosfeer van de Aarde, maar de reis is pas net begonnen en wie weet waar het heen zal gaan lopen! `);
      break;
    case "2" :
      message.channel.send(`${message.author} is net uit de atmosfeer betreed nu het heelal, de reis gaat van start maar we zijn er nog lang niet!`);
      break;
    case "3" :
      message.channel.send(`Langzaamaan zwevend door het heelal streeft ${message.author} nu net onze Maan voorbij. Een kleine rook voor ${message.author}, een grote rook voor de mensheid!`);
      break;
    case "4" :
      message.channel.send(`Het gaat al erg lekker, ${message.author} zoeft nu flink door ons zonnestelsel. Net de ringen van Saturnus ontwijkend gaan we verder!`);
      break;
    case "5" :
      message.channel.send(`Wauw! ${message.author} gaat al verder dan de mensheid bereikt heeft. Mokersnel en mokerlekker vliegend al diep de ruimte in, net voorbij de ~~planeet~~ Pluto!`);
      break;
    case "6" : 
      message.channel.send(`Nondeju, wat gaat dit vlug. ${message.author} dendert al door onze intergalaktische buurt heen en racet langs allerlei verschillende zonnestelsels. Die zit nu al echt dik ver in het heelal, netjes!`);
      break;
    case "7" :
      message.channel.send(`Het is op dit punt dat je gaat merken dat tijd echt relatief is. ${message.author} gaat al hard genoeg dat uren minuten lijken en minuten zomaar uren kunnen worden. Een eeuw lijkt lang maar zo diep in het heelal is het maar een kleine hoeveelheid`);
      break;
    case "8" :
      message.channel.send(`Het is op dit punt dat communicatie ook een moeilijke opgave wordt, ${message.author} is namelijk al zo ver weg heen. Racend door het heelal scheurt ${message.author} onze Melkweg uit. Wie had gedacht dat een mens zo hard kon gaan.`);
      break;
    case "9" :
      message.channel.send(`Godnondetering, het gaat nu zo verdomd hard. Onaanspreekbaar, vaag als de neten maar wel vliegensvlug. Dat is ${message.author} in een notendop nu deze voorbij alle superclusters heen ramt. Het universum is nu van jou.`);
      break;
    case "10" :
      message.channel.send(`Tering. Op dit punt reist ${message.author} niet meer door het universum maar is ${message.author} nu het universum. Alles ligt nu binnen handbereik, alles is mogelijk. We komen nu tot de diepste hoeken, de verste planeten en mooiste nebula's. Dit is een met het universum zijn op zijn piek, lekker!`);
      break;
    case "11" :
      message.channel.send(`Oef. ${message.author} ging zo hard dat deze recht in een zwart gat gevlogen is. Het was leuk je gekend te hebben.`);
      break;
  }
  // Admin commands
  // commands for Haan#0420 only
  if(message.author.id !== '189716214795337729') return;

  if(command === "opgedonderd"){
    let member = message.mentions.members.first();
    let reason = args.slice(1).join(" ");
    member.kick(reason);
  }
});

client.login(config.token);