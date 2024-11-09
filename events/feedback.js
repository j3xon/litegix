const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;

    // Handle feedback modal submission
    if (interaction.customId === 'feedbackModal') {
      const feedback = interaction.fields.getTextInputValue('feedbackInput');
      const rating = interaction.fields.getTextInputValue('ratingInput');

      // Ensure rating is a valid number between 1 and 5
      const ratingNumber = parseInt(rating);
      
      // Create the embed for the feedback
      const embed = new EmbedBuilder()
        .setTitle('Feedback')
        .addFields(
          { name: 'Feedback', value: feedback, inline: false },
          { name: 'Rating', value: ratingNumber >= 1 && ratingNumber <= 5 ? `${ratingNumber}/5` : 'Invalid rating', inline: false },
          { name: 'Submitted by', value: interaction.user.tag, inline: false }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setColor(`#2F3136`)
        .setFooter({ 
          text: 'Section Designs',
          iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
      });

      // Send the feedback to the specified channel
      const feedbackChannel = interaction.guild.channels.cache.get('1304484851860246610'); // Your channel ID
      if (feedbackChannel) {
        try {
          const feedbackMessage = await feedbackChannel.send({ embeds: [embed] });

          // Reply to the user who made the feedback submission
          await interaction.reply({ content: 'Thank you for your feedback!', ephemeral: true });
        } catch (error) {
          console.error('Error sending feedback:', error);
          await interaction.reply({ content: 'There was an error processing your feedback.', ephemeral: true });
        }
      } else {
        await interaction.reply({ content: 'Unable to find the feedback channel.', ephemeral: true });
      }
    }
  },
};
