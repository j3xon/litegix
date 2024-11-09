const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user-icon')
    .setDefaultMemberPermissions(0)
    .setDescription('Fetches Roblox user avatar and headshot by user ID')
    .addIntegerOption(option => 
      option.setName('roblox-id')
        .setDescription('The Roblox user ID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const robloxUserId = interaction.options.getInteger('roblox-id');

    if (!robloxUserId) {
      return interaction.reply({ content: 'Please provide a valid Roblox user ID.', ephemeral: true });
    }

    try {
      // Fetch user avatar
      const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${robloxUserId}&size=720x720&format=Png&isCircular=false`, {
        method: 'GET',
        headers: { 'accept': 'application/json' },
      });
      const avatarData = await avatarResponse.json();
      if (!avatarData.data) {
        return interaction.reply({ content: 'Failed to fetch the avatar. Please check if the user ID is correct.', ephemeral: true });
      }

      // Fetch user headshot
      const headshotResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=720x720&format=Png&isCircular=false`, {
        method: 'GET',
        headers: { 'accept': 'application/json' },
      });
      const headshotData = await headshotResponse.json();
      if (!headshotData.data) {
        return interaction.reply({ content: 'Failed to fetch the headshot.', ephemeral: true });
      }

      // Create the embed with the fetched data
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`User Avatar and Headshot for Roblox ID: ${robloxUserId}`)
        .addFields(
          { name: 'Avatar', value: `[Click here for avatar image](${avatarData.data[0].imageUrl})` },
          { name: 'Headshot', value: `[Click here for headshot image](${headshotData.data[0].imageUrl})` }
        )
        .setFooter({ text: 'Requested by ' + interaction.user.username });

      // Send the embed reply
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching the user icon data.', ephemeral: true });
    }
  },
};
