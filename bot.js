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
    const title = 'World Boss Reminder - Find a Party!';
    const message = 'Boss spawning reminder @Fateweaver, in 10 minutes we go in!';

    scheduleTimes.forEach((time) => {
        const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')} UTC`;
        scheduleJob({ hour: time.hour, minute: time.minute }, () => {
            sendMessage(channelId, title, message, formattedTime);
        });
    });
});

client.login(TOKEN).catch(err => {
    console.error('Error logging in:', err);
});
