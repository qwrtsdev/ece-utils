const {
    Events,
    MessageFlags
} = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {  
        if (!interaction.isModalSubmit()) return;

        switch (interaction.customId) {
            case 'verification_modal': {
                await interaction.reply({
                    content: 'กำลังตรวจสอบข้อมูลของคุณ...',
                    flags: MessageFlags.Ephemeral
                })
            }

            default: return;
        }
    }
}