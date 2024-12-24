require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { scheduleJob } = require('node-schedule');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;
const RIDDLE_API_URL = 'https://api.api-ninjas.com/v1/riddles';
const RIDDLE_API_KEY = process.env.RIDDLE_API_KEY;

const scheduleTimes = [
    { hour: 11, minute: 50 },
    { hour: 14, minute: 50 },
    { hour: 18, minute: 50 },
    { hour: 20, minute: 50 },
    { hour: 23, minute: 50 },
];

// Fetch a riddle from the API
const fetchRiddle = async () => {
    try {
        const response = await axios.get(RIDDLE_API_URL, {
            headers: { 'X-Api-Key': RIDDLE_API_KEY }
        });
        const riddle = response.data[0];
        return `**Riddle of the Moment:**\n${riddle.question}`;
    } catch (error) {
        console.error('Error fetching riddle:', error);
        return '**Riddle of the Moment:**\nCould not fetch a riddle at this time. Try again later!';
    }
};

// Send the message with title, reminder, and riddle
const sendMessage = async (channelId, title, reminder) => {
    const channel = client.channels.cache.get(channelId);
    const riddle = await fetchRiddle();
    const fullMessage = `**${title}**\n\n${reminder}\n\n${riddle}`;
    if (channel) {
        channel.send(fullMessage);
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Set bot presence
    client.user.setPresence({
        activities: [{ name: 'Which Boss is it? 👺' }],
        status: 'online'
    });

    const channelId = '1314574900522127423';
    const title = 'World Boss Reminder';
    const reminder = 'Good People: World Boss is about to show up!';

    // Schedule messages at specified times
    scheduleTimes.forEach((time) => {
        scheduleJob({ hour: time.hour, minute: time.minute }, () => {
            sendMessage(channelId, title, reminder);
        });
    });
});

// Login to Discord
client.login(TOKEN).catch(err => {
    console.error('Error logging in:', err);
});
