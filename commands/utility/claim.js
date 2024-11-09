const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim a ticket for handling.')
        .setDefaultMemberPermissions(0), // No default permissions, handled below
    async execute(interaction) {
        // Check if the user has one of the specified roles
        const memberRoles = interaction.member.roles.cache.map(role => role.id);
        const allowedRoles = ['1304460386002796564', '1304460559751581800'];

        if (!allowedRoles.some(role => memberRoles.includes(role))) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Defer the reply to avoid timeout issues
        await interaction.deferReply();

        // Logic for claiming the ticket
        const ticketChannel = interaction.channel;

        if (!ticketChannel.name.startsWith('support-') && !ticketChannel.name.startsWith('purchase-')) {
            return interaction.editReply({ content: 'This command can only be used in a ticket channel.', ephemeral: true });
        }

        // Rename the channel to indicate it has been claimed
        await ticketChannel.setName(`${ticketChannel.name}-claimed`);

        // Create the embed message
        const claimEmbed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle('Ticket Claimed')
            .setDescription(`The ticket **${ticketChannel.name}** has been successfully claimed by <@${interaction.user.id}>.`)
            .setFooter({ text: `Claimed by: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        // Send the embed message as the final response
        await interaction.editReply({ embeds: [claimEmbed] });
    },
};
