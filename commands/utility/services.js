const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('service')
        .setDefaultMemberPermissions(0)
        .setDescription('Display the services'),
    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });

        const targetChannelId = '1304461959726633061';
        const banner = "https://cdn.discordapp.com/attachments/1261011896950329374/1304527995137953862/SD.png?ex=672fb7de&is=672e665e&hm=bb39108c4eb8db8f49feff14ded7965246f9cdf7905b52e336a22c3e0803f438&"
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        // Define each embed with detailed rules
       const embed = new EmbedBuilder()
            .setTitle('Services')
            .setColor(`#2F3136`)
            .setDescription(`Welcome to the Section Designs service section. This is where you can check all the information like pricing for **discord services**,**clothing pricing** etc. Ensure you have read the terms and conditions before making an order. We hope you find our services useful and enjoyable. If you have any questions or concerns, please don't hesitate to reach out to us.`);

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('service')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Terms and Conditions',
                    description: 'Terms and Conditions for ordering',
                    value: 'tc',
                },
                {
                    label: 'Discord Pricing',
                    description: 'Discord pricing',
                    value: 'dp',
                },
                {
                    label: 'Clothing Pricing',
                    description: 'Clothing pricing',
                    value: 'cp',
                },
                {
                    label: 'Livery Pricing',
                    description: 'Pricing for liveries',
                    value: 'lp',
                },
                {
                    label: 'Graphics Pricing',
                    description: 'Prices for graphics',
                    value: 'gp',
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send all embeds and the select menu to the target channel
        await targetChannel.send({files: [banner], embeds: [embed], components: [row] });

        // Acknowledge the command
        await interaction.editReply({ content: 'Server rules have been sent to the channel.', ephemeral: true });
    },
};
