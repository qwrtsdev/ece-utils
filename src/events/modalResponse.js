const {
    Events,
    EmbedBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ModalSubmitInteraction,
} = require('discord.js')
const { channels } = require('../utils/config.json');
const eceMembers = require('../models/user.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {  
        const unixTime = Math.floor(Date.now() / 1000);

        if (!interaction.isModalSubmit()) return;

        switch (interaction.customId) {
            case 'verification_modal': {
                try {
                    const requestChannel = interaction.client.channels.cache.get(channels.request);
                    const userNickName = interaction.fields.getTextInputValue('userNickName');
                    const studentIdNumber = interaction.fields.getTextInputValue('studentIdNumber');
                    const departmentName = interaction.fields.getTextInputValue('departmentName');
                    const instagramUsername = interaction.fields.getTextInputValue('instagramUsername');

                    const requestComponents = [
                        new ContainerBuilder()
                            .addSectionComponents(
                                new SectionBuilder()
                                    .setThumbnailAccessory(
                                        new ThumbnailBuilder()
                                            .setURL(interaction.user.displayAvatarURL({ extension: 'png' }))
                                    )
                                    .addTextDisplayComponents(
                                        new TextDisplayBuilder().setContent(`-# 📄 **คำขอเข้าร่วมใหม่**\n# **<@${interaction.user.id}>**\n<t:${unixTime}:f>\n\n1️⃣ ชื่อเล่นของคุณ\n\`\`\`${userNickName}\`\`\`\n2️⃣ รหัสนักศึกษา 13 หลักของคุณ\n\`\`\`${studentIdNumber}\`\`\`\n3️⃣ สาขาวิชาของคุณ\n\`\`\`${departmentName}\`\`\`\n4️⃣ ชื่อผู้ใช้ Instagram ของคุณ\n\`\`\`${instagramUsername}\`\`\``),
                                    ),
                            )
                            .addSeparatorComponents(
                                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Success)
                                            .setLabel("อนุมัติสมาชิก")
                                            .setCustomId(`VERIFY_USER-${interaction.user.id}`),
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Danger)
                                            .setLabel("ปฎิเสธการเข้าร่วม")
                                            .setCustomId(`DENY_USER-${interaction.user.id}`),
                                    ),
                            ),
                    ];

                    const replyEmbed = new EmbedBuilder()
                        .setDescription(`✅ <@${interaction.user.id}> ยืนยันตัวตนเสร็จแล้ว!`)
                        .setColor("#33ff70");

                    const response = await interaction.reply({
                        embeds: [replyEmbed],
                    });

                    await eceMembers.create({
                        userID: interaction.user.id,
                        nickname: userNickName,
                        department: departmentName,
                        instagram: instagramUsername,
                    })

                    await requestChannel.send({
                        components: requestComponents,
                        flags: MessageFlags.IsComponentsV2,
                    });

                    const dmComponents = [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(`-# <t:${unixTime}:f>\n# 🕑 **ส่งคำขอเข้าร่วมสำเร็จแล้ว !**\nคุณทำการส่งคำขอเข้าร่วมเซิร์ฟเวอร์ผ่านการยืนยันตัวตนสำเร็จแล้ว\n\nกรุณารอการอนุมัติจากทีมงาน อาจใช้เวลาในการดำเนินการสักพัก...\nหากคุณได้รับอนุญาติให้เข้าร่วมแล้ว จะได้รับการแจ้งเตือนทันที`),
                            ),
                    ];

                    await interaction.user.send({
                        components: dmComponents,
                        flags: MessageFlags.IsComponentsV2,
                    });

                    setTimeout(async () => { await response.delete(); }, 3000);
                } catch (error) {
                    console.error('[verification] error :', error);

                    const embed = new EmbedBuilder()
                        .setDescription(`❌ เกิดข้อผิดพลาดในการยืนยันตัวตน กรุณาลองใหม่อีกครั้งในภายหลัง`)
                        .setColor("#ff0000");
                    
                    if (!interaction.replied) {
                        await interaction.reply({
                            embeds: [embed],
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                }
                break;
            }

            case 'anonymous': {
                const channel = interaction.client.channels.cache.get(channels.anonymous);
                const logChannel = interaction.client.channels.cache.get(channels.modlogs);
                const anonymousMessage = interaction.fields.getTextInputValue('anonymousMessage');

                const replyEmbed = new EmbedBuilder()
                    .setDescription(`✅ <@${interaction.user.id}> ส่งข้อความสำเร็จแล้ว!`)
                    .setColor("#33ff70");

                const response = await interaction.reply({
                    embeds: [replyEmbed],
                });
                setTimeout(async () => { await response.delete(); }, 10);

                const message = await channel.send({
                    content: `\`\`💬 ใครบางคน :\`\`\n${anonymousMessage}`
                })

                const logEmbed = new EmbedBuilder()
                    .setDescription(`💬 <@${interaction.user.id}> ส่งข้อความลับ ${message.url}`)
                    .setColor("#fafafa");
                await logChannel.send({
                    embeds: [logEmbed],
                })

                break;
            }

            default: 
                return;
        }
    }
}