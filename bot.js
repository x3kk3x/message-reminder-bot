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
    { hour: 11, minute: 50 },
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

    client.user.setPresence({
        activities: [{ name: 'Which Boss is it? 👺' }],
        status: 'online'
    });

    const channelId = '1314574900522127423';
    const title = 'World Boss Reminder';
    const message =
        'THE WORLD BOSS WILL BE SPAWNING SOON!\n \n' +
        'Like brushing off the sleep from your eyes or checking your phone for the hundredth time, the clock is ticking.\n' +
        'The battle is coming — are you prepared?\n \n';

    scheduleTimes.forEach((time) => {
        scheduleJob({ hour: time.hour, minute: time.minute }, () => {
            sendMessage(channelId, title, message);
        });
    });
});

client.login(TOKEN).catch(err => {
    console.error('Error logging in:', err);
});
