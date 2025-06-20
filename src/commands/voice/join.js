const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('ทำให้บอทเข้ามาในห้องเสียงของคุณ'),
	async execute(interaction) {
		await interaction.reply({ 
            content: 'coming soon', 
            flags: MessageFlags.Ephemeral 
        });
	},
};