const { 
    Events, 
    MessageFlags 
} = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
    once: false,

	async execute(interaction) {
		if (!interaction.isUserContextMenuCommand()) return;

        const target = interaction.targetUser;

        switch (interaction.commandName) {

        }
	},
};