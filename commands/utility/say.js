const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Sends a message as the bot.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)),
  async execute(interaction) {
    const adminRoleId = '1304460108977143879'; // Replace with your admin role ID
    const logChannelId = '1304485095498977351'; // Log channel ID

    // Check if the user has the admin role
    if (!interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const messageToSend = interaction.options.getString('message');

    // Send the message to the channel where the command was invoked
    await interaction.channel.send(messageToSend);

    // Log the message to the specified log channel
    const logChannel = await interaction.guild.channels.fetch(logChannelId);
    if (logChannel) {
      logChannel.send(`Message sent by ${interaction.user.tag}: ${messageToSend}
        Channel: <#${interaction.channel.id}>`);
    }

    // Acknowledge the command
    await interaction.reply({ content: 'Message sent successfully!', ephemeral: true });
  },
};
