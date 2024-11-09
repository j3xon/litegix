const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsupport')
    .setDescription('Open a ticket support dropdown.'),
  async execute(interaction) {
    // Check if the user has admin permissions
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const banner = "https://cdn.discordapp.com/attachments/1261011896950329374/1304520511325343815/4.png?ex=672fb0e6&is=672e5f66&hm=9d61b076bec5868a268c021169a46e6e5fe2da26dba4abbe7c2e09e2de27a461&"

    // Acknowledge the interaction immediately
    await interaction.deferReply(); 

    // Create the embed message
    const embed = new EmbedBuilder()
      .setColor(`#2F3136`)
      .setTitle('Ticket Creation')
      .setDescription('> Please select the appropriate option for the ticket you wish to open. Opening a ticket for the wrong reason or for trolling purposes will lead to necessary consequences. We appreciate your patience, as our staff may be attending to multiple inquiries at once.')
      .setFooter({ 
        text: 'Section Designs',
        iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
    });

    // Create the dropdown menu
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('supportOptions')
          .setPlaceholder('Select an option')
          .addOptions([
            {
              label: 'Support Ticket',
              description: `Open a support ticket`,
              value: 'st',
            },
            {
              label: 'Product purchase',
              description: 'Purchase a product',
              value: 'bp',
            },
          ])
      );

    // Send the embed with the dropdown to the specified channel
    const supportChannel = interaction.guild.channels.cache.get('1304462890627104778');
    if (supportChannel) {
      await supportChannel.send({ files: [banner], embeds: [embed], components: [row] });
      await interaction.followUp({ content: 'The support ticket options have been sent.', ephemeral: true });
    } else {
      await interaction.followUp({ content: 'Unable to find the support channel.', ephemeral: true });
    }
  },
};
