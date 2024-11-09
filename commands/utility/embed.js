const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendembed')
        .setDescription('Send an embed message to the current channel.'),
    async execute(interaction) {
        // Check if the user has admin permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('embedModal')
            .setTitle('Send Embed');

        // Create title input

        // Create description input
        const descriptionInput = new TextInputBuilder()
            .setCustomId('embedDescription')
            .setLabel('Embed Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

            const titleInput = new TextInputBuilder()
            .setCustomId('embedTitle')
            .setLabel('Embed Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        // Create action rows for the inputs
        const row1 = new ActionRowBuilder().addComponents(descriptionInput);
        const row2 = new ActionRowBuilder().addComponents(titleInput);

        // Add the inputs to the modal
        modal.addComponents(row1, row2);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
