const { 
    SlashCommandBuilder, 
    MessageFlags 
} = require('discord.js');
const { request } = require('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repo')
		.setDescription('ดู repository ของบอทผ่าน GitHub'),
	async execute(interaction) {
		await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {
            const response = await request(`https://api.github.com/repos/qwrtsdev/ece-utils`, {
                headers: {
                    'User-Agent': 'node.js',
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const body = await response.body.json();

            const component = [

            ]

            await interaction.editReply({
                components: component,
                flags: MessageFlags.IsComponentsV2,
            })
        } catch (error) {
            await interaction.editReply({
                content: '❌ เกิดข้อผิดพลาดในการดึงข้อมูล repository กรุณาลองใหม่อีกครั้งในภายหลัง',
                flags: MessageFlags.Ephemeral
            });
        }
	},
};