require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js'); 
const { scheduleJob } = require('node-schedule'); 


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Bot token
const TOKEN = process.env.TOKEN;

// Scheduled message times (UTC)
const scheduleTimes = [
    { hour: 12, minute: 50 }, 
    { hour: 15, minute: 50 },
    { hour: 19, minute: 50 }, 
    { hour: 22, minute: 50 }, 
    { hour: 0, minute: 50 },  
];

// Function to send messages
const sendMessage = (channelId, title, message, time) => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        channel.send(`**${title}**\n\n${message}\n\n**Time:** ${time}`);
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channelId = '1314574900522127423';

    // Message details
    const title = 'World Boss Reminder - Find a Party!';
    const message = 'Boss spawning reminder, in 10 minutes we go in!';

    // Schedule jobs for each time
    scheduleTimes.forEach((time) => {
        const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')} UTC`;
        scheduleJob({ hour: time.hour, minute: time.minute }, () => {
            sendMessage(channelId, title, message, formattedTime);
        });
    });
});

client.login(TOKEN);
