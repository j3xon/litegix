const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Log the bot's username and ID when ready
        console.log(`${client.user?.username} - (${client.user?.id})`); 
        
        // Set the activity and status
        setBotStatus(client, 'online'); // Change to 'dnd', 'idle', or 'invisible' as needed
    },
};

function setBotStatus(client, status) {
    // Define the activity
    const activity = { name: 'SectionDesigns', type: ActivityType.Watching };

    // Set the activity without chaining .then()
    client.user.setActivity(activity);
    console.log(`Status set to: Playing ${activity.name}`); // Log confirmation

    // Set the bot's status based on the provided argument
    switch (status) {
        case 'dnd':
            client.user.setStatus('dnd'); // Do Not Disturb
            break;
        case 'idle':
            client.user.setStatus('idle'); // Idle
            break;
        case 'invisible':
            client.user.setStatus('invisible'); // Invisible
            break;
        default:
            client.user.setStatus('online'); // Online
    }
}
