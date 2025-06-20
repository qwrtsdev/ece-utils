const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    InteractionContextType,
    MessageFlags,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('talk')
    .setDescription('พูดคุยกับสมาชิกแทนตัวเอง')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('ข้อความที่ต้องการส่ง')
            .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName('channel')
            .setDescription('ช่องที่ต้องการส่งข้อความ')
            .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('target')
            .setDescription('ผู้ใช้ที่ต้องการแท็ค')
            .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    
    if (!channel.isTextBased()) {
        return interaction.reply({
            content: '❌ กรุณาเลือกช่องข้อความ (text channel) เท่านั้น',
            flags: MessageFlags.Ephemeral
        });
    }

    const messageText = interaction.options.getString('message');
    const target = interaction.options.getUser('target');
    const mention = target ? `<@${target.id}> ` : '';

    await interaction.reply({
        content: `🔊 กำลังส่งข้อความไปยัง <#${channel.id}>…`,
        flags: MessageFlags.Ephemeral,
    });

    await channel.send({
        content: `${mention}${messageText}`,
    });
  },
};
