const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1304485095498977351'; // Channel ID for logging

        // Handle dropdown selection for support tickets and bot purchases
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'supportOptions') {
                const selectedValue = interaction.values[0];

                if (selectedValue === 'st') {
                    const modal = new ModalBuilder()
                        .setCustomId('ticketReasonModal')
                        .setTitle('Ticket Reason');

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('Reason for the ticket')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Type your reason here...')
                        .setRequired(true);

                    const row = new ActionRowBuilder().addComponents(reasonInput);
                    modal.addComponents(row);

                    await interaction.showModal(modal);
                    return;
                }

                if (selectedValue === 'bp') {
                    const modal = new ModalBuilder()
                        .setCustomId('bpModal')
                        .setTitle('Product Purchase');

                    const memberInput = new TextInputBuilder()
                        .setCustomId('memberInput')
                        .setLabel('Needed')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('bots,logos,etc')
                        .setRequired(true);

                    const reasonInput = new TextInputBuilder()
                        .setCustomId('reasonInput')
                        .setLabel('When needed')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('11/8/2024')
                        .setRequired(true);

                    const proofInput = new TextInputBuilder()
                        .setCustomId('proofInput')
                        .setLabel('Notes')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('info etc')
                        .setRequired(false);

                    const row1 = new ActionRowBuilder().addComponents(memberInput);
                    const row2 = new ActionRowBuilder().addComponents(reasonInput);
                    const row3 = new ActionRowBuilder().addComponents(proofInput);
                    
                    modal.addComponents(row1, row2, row3);

                    await interaction.showModal(modal);
                    return;
                }
            }
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'bpModal') {
                const member = interaction.fields.getTextInputValue('memberInput');
                const reason = interaction.fields.getTextInputValue('reasonInput');
                const proof = interaction.fields.getTextInputValue('proofInput');

                await interaction.deferReply({ ephemeral: true });

                const purchaseChannel = await interaction.guild.channels.create({
                    name: `purchase-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1304460559751581800', // Bot Purchase role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const purchaseEmbed = new EmbedBuilder()
                    .setTitle('Product Purchase')
                    .setDescription(`Hello <@${interaction.user.id}>, welcome to your new product purchase ticket. Please wait for a designer to come and claim your ticket.`)
                    .setFields([
                        { name: 'Needed', value: member },
                        { name: 'When Needed', value: reason },
                        { name: 'Notes', value: proof },
                    ])
                    .setColor(`#2F3136`)
                    .setImage("https://cdn.discordapp.com/attachments/1261011896950329374/1304520511069487155/3.png?ex=672fb0e6&is=672e5f66&hm=32033f63d623afc3faec5f47f5b893777b7dce66644b6b10fbc7ac5025c62e23&")
                    .setFooter({ 
                        text: 'Section Designs',
                        iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                    });

                const purchaseCloseButton = new ButtonBuilder()
                    .setCustomId('closePurchaseTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await purchaseChannel.send({ content: `<@${interaction.user.id}>, <@&1304460559751581800>`, embeds: [purchaseEmbed], components: [new ActionRowBuilder().addComponents(purchaseCloseButton)] });

                // Log the ticket opening
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`A new member report ticket has been open by <@${interaction.user.id}> in <#${purchaseChannel.id}>.\n**Member Reporting:** ${member}\n**Reason:** ${reason}`)
                        .setColor(`#2F3136`)
                        .setFooter({ 
                            text: 'Section Designs',
                            iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                        });

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your ticket has been opened at <#' + purchaseChannel.id + '>.', ephemeral: true });
                return;
            }

            if (interaction.customId === 'ticketReasonModal') {
                const reason = interaction.fields.getTextInputValue('reasonInput');

                await interaction.deferReply({ ephemeral: true });

                const supportChannel = await interaction.guild.channels.create({
                    name: `support-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: '1304460386002796564', // Support role
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });

                const supportEmbed = new EmbedBuilder()
                    .setTitle('Support Ticket')
                    .setDescription(`Hello <@${interaction.user.id}>, your support ticket has been opened. Please wait for a staff member to come and claim your ticket.`)
                    .setFields([
                        { name: 'Reason', value: reason },
                    ])
                    .setColor(`#2F3136`)
                    .setImage("https://cdn.discordapp.com/attachments/1261011896950329374/1304520510796726333/2.png?ex=672fb0e6&is=672e5f66&hm=8488cdabc46fde63eb1c55c6a528d522101ae025c1076990313f15a8a5b0e89b&")
                    .setFooter({ 
                        text: 'Section Designs',
                        iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                    });
                const supportCloseButton = new ButtonBuilder()
                    .setCustomId('closeTicket')
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger);

                await supportChannel.send({ content: `<@${interaction.user.id}>`, embeds: [supportEmbed], components: [new ActionRowBuilder().addComponents(supportCloseButton)] });

                // Log the ticket opening
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Opened')
                        .setDescription(`A new support ticket has been opened by <@${interaction.user.id}> in <#${supportChannel.id}>.\n**Reason:** ${reason}`)
                        .setColor(`#2F3136`)
                        .setFooter({ 
                            text: 'Section Designs',
                            iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                        });

                    await logChannel.send({ embeds: [logEmbed] });
                }

                await interaction.editReply({ content: 'Your support ticket has been opened at <#' + supportChannel.id + '>!', ephemeral: true });
                return;
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'closeTicket' || interaction.customId === 'closePurchaseTicket') {
                const confirmationEmbed = new EmbedBuilder()
                    .setTitle('Close Ticket')
                    .setDescription('Are you sure you want to close this ticket? This action cannot be undone.')
                    .setColor(`#2F3136`)
                    .setFooter({ 
                        text: 'Section Designs',
                        iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                    });
                    
                    

                const finalCloseButton = new ButtonBuilder()
                    .setCustomId('confirmClose')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Secondary);

                await interaction.reply({ embeds: [confirmationEmbed], components: [new ActionRowBuilder().addComponents(finalCloseButton)], ephemeral: true });
                return;
            }

            if (interaction.customId === 'confirmClose') {
                // Send the ephemeral embed stating the ticket will close in 5 seconds
                const closingEmbed = new EmbedBuilder()
                    .setDescription('The ticket will close in 5 seconds.')
                    .setColor(`#2F3136`)
                    .setFooter({ 
                        text: 'Section Designs',
                        iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                    });
            
                await interaction.reply({ embeds: [closingEmbed], ephemeral: true });
            
                // Wait for 5 seconds
                await new Promise(resolve => setTimeout(resolve, 5000));
            
                const ticketChannel = interaction.channel;
            
                // Create a transcript of the ticket channel
                const transcriptAttachment = await discordTranscripts.createTranscript(ticketChannel, {
                    limit: 20000000, // Fetch all messages
                    returnType: 'attachment', // Return type can be 'buffer' | 'string' | 'attachment'
                    filename: 'transcript.html', // Name of the attachment
                    saveImages: true, // Set to true to include images
                    saveAudio: true, // Set to true to include audio
                    saveVideos: true, // Set to true to include videos
                    saveFiles: true, // Set to true to include files
                    saveReactions: true, // Set to true to include reactions
                    saveInvites: true, // Set to true to include invites
                    saveStickers: true, // Set to true to include stickers
                    saveEmbeds: true, // Set to true to include embeds
                    poweredBy: false, // Include the "Powered by discord-html-transcripts" footer
                    hydrate: true, // Hydrate the HTML server-side
                    filter: (message) => {
                        console.log(`Message fetched: ${message.content}`); // Debug log for messages
                        return true; // Include all messages
                    }
                });
            
                const ticketOwner = interaction.user;
            
                // Create the embed for the DM
                const closeEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription(`> Hello <@${ticketOwner.id}>, your ticket has been closed. Please find below the information and above the transcript.
                        
                        **Open Time:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
            
            > If you have any further questions, please feel free to open a new ticket.`)
                .setColor('#2F3136')
                .setFooter({ 
                    text: 'Section Designs',
                    iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                });
            
                // Send DM with the transcript
                await ticketOwner.send({ embeds: [closeEmbed], files: [transcriptAttachment] }).catch(err => console.error("Failed to send DM: ", err));
            
                // Delete the ticket channel
                await ticketChannel.send('This ticket has been closed.');
                await ticketChannel.delete();
            
                // Log the ticket closure
                const logChannel = interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setColor('#2F3136')
                        .setTitle('Ticket Closed')
                        .setDescription(`> Ticket has been successfully closed. Please find below the information and above the transcript.`)
                        .setFields([
                            { name: 'Ticket Channel', value: `<#${ticketChannel.id}>` },
                            { name: 'Ticket Owner', value: `<@${ticketOwner.id}>` },
                            { name: 'Open Date', value: `${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}` }
                        ])
                        .setFooter({ 
                            text: 'Section Designs',
                            iconURL: 'https://cdn.discordapp.com/attachments/1261011896950329374/1304516753736470538/SD.png?ex=672fad66&is=672e5be6&hm=5d893f50eb9ee7f8442a52b392361b94d5057edc4c6a45c93bcc0f420a60309a&'
                        });
            
                    await logChannel.send({ embeds: [logEmbed], files: [transcriptAttachment] });
                }
                return;
            }
        }
    }
}            