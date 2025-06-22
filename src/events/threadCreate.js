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
const { channels } = require('../utils/config.json')

module.exports = {
    name: Events.ThreadCreate,
    once: false,

    execute(interaction) {
        try {
            const unixTime = Math.floor(Date.now() / 1000);
        
            if (interaction.parentId === channels.helpThread) {
                const components = [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`<t:${unixTime}:f>\n\n- อธิบายปัญหาของคุณให้ชัดเจน ยิ่งละเอียดยิ่งดี!\n- กรุณาแนบรูปภาพ หรือวิดีโอประกอบเพื่อทำให้เข้าใจปัญหาได้ดียิ่งขึ้น\n- ทดลองค้นหาปัญหาใน Google หรือประวัติข้อความในเซิร์ฟเวอร์เพื่อไม่ให้ซ้ำคำถามเก่า\n- หากแก้ปัญหาได้แล้ว กรุณากดปุ่ม \`\`แก้ไขปัญหาแล้ว\`\``),
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
        } catch (error) {
            console.error('[help thread] error', error)
        }
    },
};