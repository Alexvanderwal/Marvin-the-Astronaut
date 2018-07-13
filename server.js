// import { Sequelize } from "./db/database";

const Discord = require("discord.js");
const client = new Discord.Client();
let currentSmokeCircle;
const config = require("./config.json");
const database = require("./db/");
const db = database.database;
const Sequelize = require('sequelize');
const models = database.models;
const timeOut = 30009; // 5s in ms  

client.on("ready", () => {
  //Console stuff
  console.log("Marvin gaat er weer voor!");

  //Status
  client.user.setActivity('sick supernovas in space', { type: 'WATCHING' })
});

/**
 *  Groups by a specific attribute and counts the number of records including this attribute value there are.
 * **/
async function countByAttribute(attributeName, labelName, where = {}) {
  return await models.SmokeCircleParticipation.findAll({
    group: [attributeName],
    attributes: [attributeName, [Sequelize.fn('COUNT', attributeName), labelName]],
    raw: true,
    where: where
  });
}

async function smokeCircle(message, arguments, command) {
  async function clearSmokeCircle() {
    let circleMethodCount = await countByAttribute('smokingMethod', 'smokeCount', { smokecircleId: currentSmokeCircle.id })
    let weedSpecies = await countByAttribute('smokedProduct', 'smokeCount', { smokecircleId: currentSmokeCircle.id })
    let smokerRankings = await countByAttribute('smokerId', 'total', { smokecircleId: currentSmokeCircle.id })

    let winner = smokerRankings.pop();

    message.channel.send(`De rook begint langzaam de kamer te verlaten. Het ziet ernaar uit dat het rook cirkeltje van <@${currentSmokeCircle.starterId}> aardig in rook is opgegaan.
Het volgende is opgerookt/gebruikt tijdens deze sessie \n
**joint, pijp, bong, alles wat je maar kan verzinnen om wiet mee te roken**
${circleMethodCount.map((method, index) => `${method.smokingMethod}: ${method.smokeCount}x \n`).join('')}
**wietjes, hashjes en dat soort spul**
${weedSpecies.map((method, index) => `${method.smokedProduct}: ${method.smokeCount}x \n`).join('')}
Gefeliciteerd <@${winner.smokerId}>! Je hebt het meest gerookt met ${winner.total} wietjes. Sucecs met je ruimte reis!
`);

    currentSmokeCircle = false;
  }

  async function fethOrCreateUser() {
    tempCurrSmoker = await models.Smoker.findOne({ where: { id: message.author.id } })
    if (!tempCurrSmoker) {
      tempCurrSmoker = await models.Smoker.create({ id: message.author.id });
    }
    return tempCurrSmoker;
  }

  function singleLineString(strings, ...values) {
    // Interweave the strings with the
    // substitution vars first.
    let output = '';
    for (let i = 0; i < values.length; i++) {
      output += strings[i] + values[i];
    }
    output += strings[values.length];

    // Split on newlines.
    let lines = output.split(/(?:\r\n|\n|\r)/);

    // Rip out the leading whitespace.
    return lines.map((line) => {
      return line.replace(/^\s+/gm, '');
    }).join(' ').trim();
  }

  let customMessage;
  // covert all array values after smokeMethod and call these 'weedstrain'
  // This has be done to catch cases where you would type "Jack Herrer" or "Amazing Haze"
  // TODO: Prevent people from saying stuff like "TIET" or "WILLEM"... children they are i swear
  let [smokeMethod, ...weedStrain] = arguments;
  weedStrain = weedStrain.join(' ');

  let messages = {
    'circleCreation': singleLineString`Zo. ${message.author} doet nog wat extra ${weedStrain} in zijn ${smokeMethod},
                      en begint hiermee een lekker rookcirkeltje. Ga met ook mee op ruimtereis met ${message.author}!`.trim(),
    'missingInput': singleLineString`Hee wat leuk dat je mee wilt roken in onze rookcirkel! Hoe ga je de wiet roken \
                    en welke soort is het Laat me weten wat dat is door 'rook [rookmethode] [wietsoort]`,
    'noCircleYet': singleLineString`Het blijkt dat er nog helemaal geen rook ronde is joh!`
  }
  // Removes tabs & spaces from the indented string



  if (!smokeMethod && smokeMethod !== 'stats' && !weedStrain) {
    message.channel.send(messages.missingInput);
    return;
  }

  if (smokeMethod === 'stats' && !currentSmokeCircle) {
    message.channel.send(messages.noCircleYet);
    return;
  }

  if (currentSmokeCircle) {
    let allSmokers = await currentSmokeCircle.getSmokers({
      group: ['smokerId'],
      raw: true
    })
    if (smokeMethod === 'stats') {
      let circleMethodCount = await countByAttribute('smokingMethod', 'smokeCount', { smokecircleId: currentSmokeCircle.id })
      let weedSpecies = await countByAttribute('smokedProduct', 'smokeCount', { smokecircleId: currentSmokeCircle.id })
      let smokerRankings = await countByAttribute('smokerId', 'total', { smokecircleId: currentSmokeCircle.id })

      let winner = smokerRankings.pop();

      message.channel.send(` 
      ${allSmokers.length} steeners zitten al lekker in het cirkeltje. Het volgende is al opgerookt/gebruikt tijdens deze sessie \n
**joint, pijp, bong, alles wat je maar kan verzinnen om wiet mee te roken**
${circleMethodCount.map((method, index) => `${method.smokingMethod}: ${method.smokeCount}x \n`).join('')}
**wietjes, hashjes en dat soort spul**
${weedSpecies.map((method, index) => `${method.smokedProduct}: ${method.smokeCount}x \n`).join('')}
`)
      // message.channel.send(customMessage);
      return;
    }
    currentSmoker = await fethOrCreateUser();

    for (smoker of allSmokers) {
      if (smoker.id == message.author.id) {
        // ADD wont allow us to actually create new records for the same user in the same circle
        await models.SmokeCircleParticipation.create({
          smokerId: currentSmoker.id,
          smokecircleId: currentSmokeCircle.id,
          smokingMethod: smokeMethod,
          smokedProduct: weedStrain
        })
        customMessage = `${message.author} is niet te stoppen! Deze jongen gaat gewoon nog een keer met zijn ${smokeMethod} vol gestampt met ${weedStrain}`;
        message.channel.send(customMessage);
        return;
      }
    }

    currentSmokeCircle.addSmokers([currentSmoker], { through: { smokingMethod: smokeMethod, smokedProduct: weedStrain } });
    customMessage = `${message.author} heeft besloten om het rookcirkeltje van ${message.guild.members.get(currentSmokeCircle.starterId)} binnen te sluipen met zijn ${smokeMethod} vol gestampt met ${weedStrain}`

  } else {
    tempCurrSmoker = await fethOrCreateUser();

    currentSmokeCircle = await models.SmokeCircle.create();
    await currentSmokeCircle.addSmokers([tempCurrSmoker], { through: { smokingMethod: smokeMethod, smokedProduct: weedStrain } });
    currentSmokeCircle.setStarter(tempCurrSmoker);

    customMessage = messages.circleCreation;
    setTimeout(clearSmokeCircle, timeOut);
  }
  message.channel.send(customMessage);
}

async function rookStats(message) {
  let methodCount = await countByAttribute('smokingMethod', "methodCount");
  let weedSpecies = await countByAttribute('smokedProduct', "smokeCount");
  let rookCirkelCount = await models.SmokeCircle.count();

  console.log(methodCount);
  message.channel.send(` 
Pfoe, ${rookCirkelCount} rookcirkels alweer.  \n
**joint, pijp, bong, alles wat je maar kan verzinnen om wiet mee te roken**
${methodCount.map((method, index) => `${method.smokingMethod}: ${method.methodCount}x \n`).join('')}
**wietjes, hashjes en dat soort spul**
${weedSpecies.map((weed, index) => `${weed.smokedProduct}: ${weed.smokeCount}x \n`).join('')}
`)
}

client.on("message", async function (message) {
  if (message.author.bot) return;
  let textMessage = message.content.toLowerCase();
  let arguments = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = arguments.shift().toLowerCase();

  //Check message for word to comment on
  const responses = { 'ruimte': '🌌', 'hoog': '☁' }
  const commands = {
    'ping': pingResponse = () => { message.channel.send("pong!") },
  };
  const testCommands = commands + {};
  for (let [trigger, response] of Object.entries(responses)) {
    if (textMessage.includes(trigger)) {
      message.react(response)
    } else {
      continue
    }
  }

  if (!message.content.startsWith(config.prefix)) return;

  if (command === 'ping') {

  }

  if (command === "asl") {
    let [age, sex, ...location] = arguments;
    message.channel.send(`Hallo ${message.author.username}, Ik zie dat je ${age} jaar oud en een ${sex} bent uit ${location}. Wil je me klapjes geven?`);
  }

  if (command === "avatar") {
    message.reply(message.author.avatarURL);
  }

  if (command === "bestenummer") {
    message.channel.send('https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX?si=UxTPgKJrR9i8kELKmUaaog');
  }

  if (command === "stuurselfie") {
    message.channel.send("Ikke zit gewoon effe lekker te bakken op de maan, ja. Kusjes en een zelfje",
      { "files": ["https://i.pinimg.com/originals/26/cf/26/26cf26b1e1e98ae0eb49bf5e58736cb2.jpg"] });
  }
  if (command === "coolboi") {
    let rng = Math.floor(Math.random() * 101);
    if (rng === 69) {
      message.channel.send(`haha seks <:huehuehuehuehuehue:438031814641057792>`);
    } else {
      message.channel.send(`Nou nou, heb jij een leuke command ontdekt die nog geen nuttige functie heeft? Goed bezig hoor, wat mij betreft is jouw coolheidsniveau ongeveer ${rng}. Lekker bezig, Pik! <:huehuehuehuehuehue:438031814641057792>`);
    }
  }
  if (command === "69") {
    message.channel.send('haha, 69 is het seksgetal, ik snap hem. Heel grappig, hoor.')
  }
  if (command === "rook") {
    smokeCircle(message, arguments, command, message);
  }

  if (command === "rookstats") {
    rookStats(message)
  }
  //nutteloos lijstje van hoe high ik ben
  switch (command) {
    case "0":
      message.channel.send(`${message.author} is nog op planneet Aarde en verlangd nu simpelweg naar een reis in het universum.`);
      break;
    case "1":
      message.channel.send(`${message.author} is net van de grond maar zit nog wel in de atmosfeer van de Aarde, maar de reis is pas net begonnen en wie weet waar het heen zal gaan lopen! `);
      break;
    case "2":
      message.channel.send(`${message.author} is net uit de atmosfeer betreed nu het heelal, de reis gaat van start maar we zijn er nog lang niet!`);
      break;
    case "3":
      message.channel.send(`Langzaamaan zwevend door het heelal streeft ${message.author} nu net onze Maan voorbij. Een kleine rook voor ${message.author}, een grote rook voor de mensheid!`);
      break;
    case "4":
      message.channel.send(`Het gaat al erg lekker, ${message.author} zoeft nu flink door ons zonnestelsel. Net de ringen van Saturnus ontwijkend gaan we verder!`);
      break;
    case "5":
      message.channel.send(`Wauw! ${message.author} gaat al verder dan de mensheid bereikt heeft. Mokersnel en mokerlekker vliegend al diep de ruimte in, net voorbij de ~~planeet~~ Pluto!`);
      break;
    case "6":
      message.channel.send(`Nondeju, wat gaat dit vlug. ${message.author} dendert al door onze intergalaktische buurt heen en racet langs allerlei verschillende zonnestelsels. Die zit nu al echt dik ver in het heelal, netjes!`);
      break;
    case "7":
      message.channel.send(`Het is op dit punt dat je gaat merken dat tijd echt relatief is. ${message.author} gaat al hard genoeg dat uren minuten lijken en minuten zomaar uren kunnen worden. Een eeuw lijkt lang maar zo diep in het heelal is het maar een kleine hoeveelheid`);
      break;
    case "8":
      message.channel.send(`Het is op dit punt dat communicatie ook een moeilijke opgave wordt, ${message.author} is namelijk al zo ver weg heen. Racend door het heelal scheurt ${message.author} onze Melkweg uit. Wie had gedacht dat een mens zo hard kon gaan.`);
      break;
    case "9":
      message.channel.send(`Godnondetering, het gaat nu zo verdomd hard. Onaanspreekbaar, vaag als de neten maar wel vliegensvlug. Dat is ${message.author} in een notendop nu deze voorbij alle superclusters heen ramt. Het universum is nu van jou.`);
      break;
    case "10":
      message.channel.send(`Tering. Op dit punt reist ${message.author} niet meer door het universum maar is ${message.author} nu het universum. Alles ligt nu binnen handbereik, alles is mogelijk. We komen nu tot de diepste hoeken, de verste planeten en mooiste nebula's. Dit is een met het universum zijn op zijn piek, lekker!`);
      break;
    case "11":
      message.channel.send(`Oef. ${message.author} ging zo hard dat deze recht in een zwart gat gevlogen is. Het was leuk je gekend te hebben.`);
      break;
  }
  // Admin commands
  // commands for Haan#0420 only
  // if(message.author.id !== '189716214795337729') return;

  if (command === "opgedonderd") {
    let member = message.mentions.members.first();
    let reason = arguments.slice(1).join(" ");
    member.kick(reason);
  }
});

client.login(config.token);