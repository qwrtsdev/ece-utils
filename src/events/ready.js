const { Events } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`✅ Logged in : ${client.user.tag} (${client.user.id})`);

        await mongoose.connect(process.env.MONGO_URI)

        if (mongoose.connect) {
            console.log('✅ Connected to MongoDB');
        } else {
            console.error('❌ Failed to connect to MongoDB');
        }
	},
};