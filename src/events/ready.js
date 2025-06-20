const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`✅ Logged in : ${client.user.tag} (${client.user.id})`);
	},
};