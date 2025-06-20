const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('ทำการออกจากห้องเสียงของคุณ'),
	async execute(interaction) {
		await interaction.reply({ 
            content: 'coming soon', 
            flags: MessageFlags.Ephemeral 
        });
	},
};