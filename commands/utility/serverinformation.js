const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinformation')
        .setDefaultMemberPermissions(0)
        .setDescription('Displays the server rules and information'),
    async execute(interaction) {
        // Acknowledge the interaction immediately
        await interaction.deferReply({ ephemeral: true });

        const banner = "https://cdn.discordapp.com/attachments/1261011896950329374/1304520511610421338/1.png?ex=672fb0e6&is=672e5f66&hm=c85d2e00734d7cc1ce62f4e70fc147da88bd940ff7f66a71cc13c4c87f2619b3&"
        const targetChannelId = '1304460998824169512';
        const targetChannel = interaction.client.channels.cache.get(targetChannelId);

        if (!targetChannel) {
            return await interaction.editReply({ content: 'Channel not found!', ephemeral: true });
        }

        // Define each embed with detailed rules
        const embeds = [
            new EmbedBuilder()
                .setTitle('Server Regulations')
                .setColor(`#2F3136`)
                .setDescription(`Listed below are all the regulations of the server. If you have any questions or concerns, please contact the staff team.`),

            new EmbedBuilder()
                .setTitle('Rule 1: Respect Everyone')
                .setColor(`#2F3136`)
                .setDescription(`Respect is the foundation of our community. Every member deserves to be treated with dignity and consideration, regardless of their background or opinions. Harassment, hate speech, or bullying will not be tolerated. We encourage open dialogue and differing viewpoints, but it’s essential to express disagreements respectfully.`),

            new EmbedBuilder()
                .setTitle('Rule 2: Age Requirement')
                .setColor(`#2F3136`)
                .setDescription(`Members must be at least 13 years old to participate in the server. Any member found to be under the age requirement will be banned and may appeal their ban upon reaching the age requirement.`),

            new EmbedBuilder()
                .setTitle('Rule 3: No Spamming')
                .setColor(`#2F3136`)
                .setDescription(`Maintaining a clean and organized communication environment is essential for fostering meaningful interactions. Members are expected to refrain from sending repetitive messages that do not contribute value to the discussion.`),

            new EmbedBuilder()
                .setTitle('Rule 4: No Advertising')
                .setColor(`#2F3136`)
                .setDescription(`To maintain a focused environment, we prohibit all forms of advertising without explicit permission from the staff team. Unsolicited advertising can create distractions and undermine our community.`),

            new EmbedBuilder()
                .setTitle('Rule 5: Privacy Matters')
                .setColor(`#2F3136`)
                .setDescription(`Respecting the privacy of all members is paramount. Safeguard your own privacy and do not share personal information without consent. Report any privacy violations to staff immediately.`),

        ];

        // Create the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('server_information')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Server Website',
                    description: 'The offical Section Design website',
                    value: 'sw',
                },
                {
                    label: 'Server Invite Link',
                    description: 'The offical discord server invite',
                    value: 'sil',
                },
                {
                    label: 'How to get hired.',
                    description: 'How to get hired.',
                    value: 'htgh',
                }
            ]);

        // Create action row for the select menu
        const row = new ActionRowBuilder().addComponents(selectMenu);

        // Send all embeds and the select menu to the target channel
        await targetChannel.send({files: [banner], embeds, components: [row] });

        // Acknowledge the command
        await interaction.editReply({ content: 'Server rules have been sent to the channel.', ephemeral: true });
    },
};
