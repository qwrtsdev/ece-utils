const { 
    Events,
    MessageFlags,
    TextDisplayBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder, 
} = require('discord.js');

module.exports = {
    name: Events.ThreadCreate,
    once: false,
    execute(interaction) {
        const threadChannelID = "1385693239545303070"

        if (interaction.parentId === threadChannelID) {
            const components = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("- อธิบายปัญหาของคุณให้ชัดเจน ยิ่งละเอียดยิ่งดี!\n- กรุณาแนบรูปภาพ หรือวิดีโอประกอบเพื่อทำให้เข้าใจปัญหาได้ดียิ่งขึ้น\n- ทดลองค้นหาปัญหาใน Google หรือประวัติข้อความในเซิร์ฟเวอร์เพื่อไม่ให้ซ้ำคำถามเก่า\n- หากแก้ปัญหาได้แล้ว กรุณากดปุ่ม \`\`แก้ไขปัญหาแล้ว\`\`"),
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setLabel("แก้ไขปัญหาแล้ว")
                                    .setCustomId("thread_problem_solved"),
                            ),
                    ),
            ];

            interaction.send({
                components: components,
                flags: MessageFlags.IsComponentsV2,
            })
                .catch((error) => {
                    console.error('An Error Occoured : ', error);
                });
        }
    },
};