require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { scheduleJob } = require('node-schedule');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;

const scheduleTimes = [
    { hour: 10, minute: 50 },
    { hour: 14, minute: 50 },
    { hour: 18, minute: 50 },
    { hour: 20, minute: 50 },
    { hour: 23, minute: 50 },
];

const sendMessage = (channelId, title, message) => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        channel.send(`**${title}**\n\n${message}`);
    } else {
        console.error(`Channel with ID ${channelId} not found.`);
    }
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channelId = '1314574900522127423';
    const title = 'World Boss Reminder';
    const message =
        'The world boss will be spawning soon!' +
        'Like brushing off the sleep from your eyes or checking your phone for the hundredth time, the clock is ticking. The battle is coming—are you prepared? The world outside hums with its distractions, but soon, your focus will narrow. Gather your thoughts, sharpen your resolve, and face what’s to come.';

    scheduleTimes.forEach((time) => {
        scheduleJob({ hour: time.hour, minute: time.minute }, () => {
            sendMessage(channelId, title, message);
        });
    });
});

client.login(TOKEN).catch(err => {
    console.error('Error logging in:', err);
});