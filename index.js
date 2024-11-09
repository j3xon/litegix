require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
client.commandArray = [];

// Ready event to log bot information
client.once('ready', () => {
  // console.log(`${client.user?.username} - (${client.user?.id})`); // Log bot username and ID when ready
});

const handleEvents = async () => {
  const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
  }
};

const handleCommands = async () => {
  const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const clientId = "1304483049995767878"; 
  const guildId = "1304459131083554826"; 
  const rest = new REST({ version: '9' }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: client.commandArray,
    });
    console.log("Slash commands uploaded");
  } catch (error) {
    console.error(error);
  }
};

client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

// Auto-assign role to new members
client.on('guildMemberAdd', async (member) => {
  const roleId = '1304460601866846320'; // Role ID to auto-assign

  try {
    await member.roles.add(roleId);
    console.log(`Assigned role ${roleId} to ${member.user.tag}`);
  } catch (error) {
    console.error(`Failed to assign role to ${member.user.tag}:`, error);
  }
});

(async () => {
  await client.handleEvents();
  await client.handleCommands();
})();

client.login(token);
