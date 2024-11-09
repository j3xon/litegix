const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Submit your feedback.'),
  async execute(interaction) {
    // Create the feedback modal
    const feedbackModal = new ModalBuilder()
      .setCustomId('feedbackModal') // Custom ID for the feedback modal
      .setTitle('Submit Your Feedback');

    // Input for feedback
    const feedbackInput = new TextInputBuilder()
      .setCustomId('feedbackInput')
      .setLabel('How was our services?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Type your feedback here...')
      .setRequired(true);

    // Input for rating
    const ratingInput = new TextInputBuilder()
      .setCustomId('ratingInput')
      .setLabel('Please rate our service from 1 to 5')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter a number from 1 to 5')
      .setRequired(true);

    const feedbackRow = new ActionRowBuilder().addComponents(feedbackInput);
    const ratingRow = new ActionRowBuilder().addComponents(ratingInput);

    feedbackModal.addComponents(feedbackRow, ratingRow);

    // Show the feedback modal
    await interaction.showModal(feedbackModal);
  },
};
