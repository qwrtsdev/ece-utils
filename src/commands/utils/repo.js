const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repo')
		.setDescription('ดู source code ของบอทผ่าน GitHub'),
	async execute(interaction) {
		await interaction.reply({ 
            content: 'https://github.com/qwrtsdev/ece-utils', 
            flags: MessageFlags.Ephemeral 
        });
	},
};