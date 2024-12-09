require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { scheduleJob } = require('node-schedule');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Bot token
const TOKEN = process.env.TOKEN;

// Scheduled message times (UTC)
const scheduleTimes = [
    { hour: 11, minute: 50 },
    { hour: 15, minute: 50 },
    { hour: 19, minute: 50 },
    { hour: 21, minute: 50 },
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

let sleepTimeout;

// Function to make the bot sleep (pause activity)
const sleepBot = () => {
    console.log('Bot is idle, sleeping...');
    if (sleepTimeout) clearTimeout(sleepTimeout); // Clear any pending task
    sleepTimeout = setTimeout(() => {
        console.log('Bot is waking up!');
        // This will wake up the bot when it's time to perform tasks.
    }, 1000 * 60 * 60 * 24); // Sleep for 24 hours
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channelId = '1314574900522127423'; // Change to your channel ID

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

    // Make the bot sleep if it is idle for long periods
    sleepBot();
});

client.login(TOKEN);
