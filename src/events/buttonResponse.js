const { 
    Events, 
    MessageFlags,
    ChannelType, 
    PermissionsBitField,
    TextDisplayBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder, 
    EmbedBuilder
} = require('discord.js');
const { channels } = require('../utils/config.json')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.user;
        const unixTime = Math.floor(Date.now() / 1000);

        switch (interaction.customId) {
            // handle support ticket
            case 'create_support_ticket': {
                const thread = await channel.threads.create({
                    name: `${interaction.user.username}'s Chat`,
                    type: ChannelType.PrivateThread,
                    reason: interaction.user.id,
                });

                await interaction.reply({
                    content: `✅ <@${interaction.user.id}> สร้างทิคเก็ตสำเร็จ กรุณาอ่านข้อความที่ ${thread.url}`,
                    flags: MessageFlags.Ephemeral
                });

                await thread.members.add(interaction.user.id);
                await thread.setInvitable(false);

                const ticketComponents = [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("- อธิบายปัญหาของคุณให้ชัดเจน ยิ่งละเอียดยิ่งดี!\n- กรุณาแนบรูปภาพ หรือวิดีโอประกอบเพื่อทำให้เข้าใจปัญหาได้ดียิ่งขึ้น\n- ทดลองค้นหาปัญหาใน Google หรือประวัติข้อความในเซิร์ฟเวอร์เพื่อไม่ให้ซ้ำคำถามเก่า\n- หากแก้ปัญหาได้แล้ว กรุณากดปุ่ม \"แก้ไขแล้ว\""),
                        )
                        .addSeparatorComponents(
                            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Primary)
                                        .setLabel("แก้ไขแล้ว")
                                        .setCustomId("close_support_ticket"),
                                ),
                        ),
                ];

                await thread.send({
                    components: ticketComponents,
                    flags: MessageFlags.IsComponentsV2,
                });

                const ticketNotiChannel = interaction.client.channels.cache.get(channels.modlogs);
                const ticketNotiEmbed = new EmbedBuilder()
                    .setDescription(`### 📫 **มีการเปิดทิคเก็ตใหม่โดย <@${interaction.user.id}>**\n🕑 เวลา  : <t:${unixTime}:f>\n📎 ลิงก์ข้อความ : ${thread.url}`)
                    .setColor("#00f556");

                await ticketNotiChannel.send({
                    content: '@everyone',
                    embeds: [ticketNotiEmbed],
                });

                break;
            }
            case 'close_support_ticket': {
                await interaction.reply({
                    content: `🗑️ <@${user.id}> ปิดทิคเก็ตนี้เรียบร้อยแล้ว กำลังจะถูกลบในอีก 3 วินาที`,
                });

                setTimeout(async () => {
                    try {
                        await channel.delete();

                        const ticketNotiChannel = interaction.client.channels.cache.get(channels.modlogs);
                        const ticketNotiEmbed = new EmbedBuilder()
                            .setDescription(`### 🔒 **ทิคเก็ตของ <@${interaction.user.id}> ถูกปิดเรียบร้อยแล้ว**\n🕑 เวลา  : <t:${unixTime}:f>\n👤 ผู้ดำเนินการ : <@${interaction.user.id}>`)
                            .setColor("#f50031");

                        await ticketNotiChannel.send({
                            embeds: [ticketNotiEmbed],
                        });
                    } catch (err) {
                        console.error('Error deleting channel:', err);
                    }
                }, 3000);

                break;
            }

            // handle threads
            case 'thread_problem_solved': {
                const tagID = "1385693579845832824"

                if (!(user.id === interaction.channel.ownerId || interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))) {
                    await interaction.reply({
                        content: `❌ <@${user.id}> ไม่สามารถดำเนินการได้ เนื่องจากคุณไม่ใช่เจ้าของโพสต์`, 
                        flags: MessageFlags.Ephemeral 
                    });
                    return;
                }

                if (channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread) {
                    await interaction.reply({ 
                        content: `✅ <@${user.id}> ทำเครื่องหมายแก้ไขปัญหาแล้วสำเร็จ `, 
                        flags: MessageFlags.Ephemeral 
                    });

                    const existedTags = channel.appliedTags;
                    const updatedTags = [...new Set([...existedTags, tagID])];
                    await channel.setAppliedTags(updatedTags);
                    await channel.setLocked(true);
                }

                break;
            }
            default: {
                return;
            }
        }
    },
};