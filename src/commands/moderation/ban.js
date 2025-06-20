const { 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    InteractionContextType, 
    MessageFlags,
    ThumbnailBuilder, 
    SectionBuilder,
    TextDisplayBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder 
} = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('แบนผู้ใช้ออกจากเซิร์ฟเวอร์')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('เลือกผู้ใช้ที่ต้องการแบน')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('อธิบายเหตุผลเพิ่มเติม')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        try {
            const target = interaction.options.getMember('target');
            const reason = interaction.options.getString('reason') ?? '-';
            const unixTime = Math.floor(Date.now() / 1000);

            if (!target) {
                return await interaction.reply({
                    content: '🚫 ไม่พบผู้ใช้ที่ระบุในเซิร์ฟเวอร์นี้',
                    flags: MessageFlags.Ephemeral
                });
            }

            if (target.id === interaction.user.id) {
                return await interaction.reply({
                    content: '🚫 ไม่สามารถแบนตัวเองออกจากเซิร์ฟเวอร์ได้',
                    flags: MessageFlags.Ephemeral
                });
            }

            if (!target.kickable) {
                return await interaction.reply({
                    content: '🚫 ไม่สามารถแบนผู้ใช้นี้ออกได้ (บทบาทสูงกว่าหรือเป็นเจ้าของเซิร์ฟเวอร์)',
                    flags: MessageFlags.Ephemeral
                });
            }

            const promptComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("# ❓ **คุณมั่นใจหรือไม่**"),
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`หากดำเนินการแล้ว จะไม่สามารถดำเนินการได้อีก\n\n👤 ชื่อผู้ใช้งาน : <@${target.user.id}> (${target.user.id})\n🔨 ผู้ดำเนินการ :  <@${interaction.user.id}> (${interaction.user.id})\n🕑 เวลา :  <t:${unixTime}:f>\n📄 เหตุผล :  ${reason}\n\n-# โปรดดำเนินการภายใน 10 วินาทีก่อนหมดอายุ`),
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                                    .setLabel("ยืนยันการแบน")
                                    .setEmoji({
                                        name: "✅",
                                    })
                                    .setCustomId("confirm_ban"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("ยกเลิก")
                                    .setCustomId("cancel_ban"),
                            ),
                    ),
            ];

            const response = await interaction.reply({ 
                components: promptComponents,
                flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ 
                    filter: collectorFilter, 
                    time: 10_000 
                });

                if (confirmation.customId === 'confirm_ban') {
                    const processingComponents = [ 
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(`### **⌛ กำลังดำเนินการแบน <@${target.user.id}>**\n-# อาจใช้เวลาดำเนินการ กรุณารอสักครู่..`),
                            )
                    ]

                    await confirmation.update({ 
                        components: processingComponents
                    });

                    try {
                        const dmComponents = [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent("# **🚫 คุณถูกแบนออกจากเซิร์ฟเวอร์**"),
                                )
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(`👤 ชื่อผู้ใช้งาน : <@${target.user.id}>\n🕑 เวลา : <t:${unixTime}:f>\n📄 เหตุผล :  ${reason}\n\n-# เนื่องจากนี่เป็นการแบน คุณจะไม่สามารถเข้าร่วมเซิร์ฟเวอร์ได้อีก\n-# กรุณายื่นอุทรณ์หากต้องการปลดแบน`),
                                )
                                .addSeparatorComponents(
                                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                                )
                                .addActionRowComponents(
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setStyle(ButtonStyle.Link)
                                                .setLabel("ยื่นอุทรณ์")
                                                .setEmoji({
                                                    name: "📎",
                                                })
                                                .setURL("https://google.com")
                                                .setDisabled(true)
                                        ),
                                ),
                        ];

                        await target.send({ 
                            components: dmComponents,
                            flags: MessageFlags.IsComponentsV2
                        });
                    } catch (error) {
                        console.error('[kick] direct message error :', error);
                    }

                    try {
                        await target.kick(reason);

                        try {
                            const publicNotiChannel = interaction.client.channels.cache.get('1385692246413676766');

                            const notiComponents = [
                                new ContainerBuilder()
                                    .addTextDisplayComponents(
                                        new TextDisplayBuilder().setContent("# **🚫 ผู้ใช้ถูกแบนอกจากเซิร์ฟเวอร์**"),
                                    )
                                    .addTextDisplayComponents(
                                        new TextDisplayBuilder().setContent(`👤 ชื่อผู้ใช้งาน : <@${target.user.id}> (${target.user.tag})\n🔨 ผู้ดำเนินการ : <@${interaction.user.id}>\n🕑 เวลา : <t:${unixTime}:f>\n📄 เหตุผล : ${reason}\n\n-# เนื่องจากนี่เป็นการแบน ผู้ใช้งานนี้จะไม่สามารถเข้าร่วมเซิร์ฟเวอร์ได้อีก`),
                                    )
                            ];

                            if (publicNotiChannel) {
                                const publicMessage = await publicNotiChannel.send({ 
                                    components: notiComponents,
                                    flags: MessageFlags.IsComponentsV2
                                });
                                await publicMessage.react('👋🏻');
                            }
                        } catch (error) {
                            console.error('[kick] notification error :', error);
                        }

                        const successComponents = [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(`### ✅ **การดำเนินการสำเร็จ**\n-# <@${target.user.id}> ถูกเตะออกจากเซิร์ฟเวอร์แล้ว`),
                                )
                        ]

                        await confirmation.editReply({
                            components: successComponents,
                        });

                    } catch (error) {
                        console.error('[kick] kick error :', error);

                        const errorComponents = [
                            new ContainerBuilder()
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(`### ❌ **เกิดข้อผิดพลาดในการเตะ**\n-# กรุณาลองใหม่อีกครั้ง หรือติดต่อ <@824442267318222879>`),
                                )
                        ]

                        await confirmation.editReply({
                            components: errorComponents,
                        });
                    }

                } else if (confirmation.customId === 'cancel_kick') {
                    const cancelComponents = [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(`### ❌ **การดำเนินการถูกยกเลิก**\n-# คุณสามารถใช้คำสั่งใหม่หากต้องการดำเนินการต่อ`),
                            )
                    ]

                    await confirmation.update({
                        components: cancelComponents,
                    });
                }
                
            } catch (error) {
                console.error('[kick] interaction timeout :', error);

                const timeoutComponents = [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`### ⌛ **การดำเนินการนี้หมดเวลาแล้ว**\n-# กรุณาใช้คำสั่งใหม่อีกครั้งหากต้องการดำเนินการต่อ`),
                        )
                ]

                await interaction.editReply({
                    components: timeoutComponents,
                });
            }

        } catch (error) {
            console.error('[kick] command execution error :', error);
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ 
                    content: '❌ เกิดข้อผิดพลาดระหว่างดำเนินการคำสั่ง', 
                    flags: MessageFlags.Ephemeral 
                });
            } else {
                await interaction.reply({ 
                    content: '❌ เกิดข้อผิดพลาดระหว่างดำเนินการคำสั่ง', 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    }
}