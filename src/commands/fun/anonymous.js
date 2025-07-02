const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anonymous')
    .setDescription('ส่งข้อความแบบไม่ระบุตัวตน'),

  async execute(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('anonymous')
        .setTitle('ส่งข้อความแบบไม่ระบุตัวตน')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('anonymousMessage')
                    .setLabel("ข้อความที่ต้องการส่ง (ใช้งาน Markdown ได้)")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
            ),
        );
    
        await interaction.showModal(modal);
  },
};
