const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("ดูรายการคำสั่งทั้งหมดของบอท"),
    async execute(interaction) {
        await interaction.reply({
            content: "ตอนนี้ไม่มีคำสั่งสำหรับผู้ใช้ทั่วไปเลยง่ะ รอก่อนนะเตง",
            flags: MessageFlags.Ephemeral,
        });
    },
};
