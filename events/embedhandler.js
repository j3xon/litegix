const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isModalSubmit() && interaction.customId === 'embedModal') {
            const title = interaction.fields.getTextInputValue('embedTitle');
            const description = interaction.fields.getTextInputValue('embedDescription');

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor('#2F3136')
                .setDescription(description)
                .setFooter({ 
                    text: 'Section Designs',
                    iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                });

            // Set title only if provided
            if (title) {
                embed.setTitle(title);
            }

            // Send the embed to the channel where the command was used
            await interaction.channel.send({ embeds: [embed] });

            // Reply to the interaction
            await interaction.reply({ content: 'Embed sent successfully!', ephemeral: true });
        }
    },
};
