require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js'); 
const { scheduleJob } = require('node-schedule'); 


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Bot token
const TOKEN = process.env.TOKEN;

// Scheduled message times (UTC)
const scheduleTimes = [
    { hour: 11, minute: 50 }, // 12:50 UTC+1
    { hour: 14, minute: 50 }, // 15:50 UTC+1
    { hour: 18, minute: 50 }, // 19:50 UTC+1
    { hour: 23, minute: 50 }, // 00:50 UTC+1
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
