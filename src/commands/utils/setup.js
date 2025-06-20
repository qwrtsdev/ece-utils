const { 
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    MediaGalleryBuilder, 
    MediaGalleryItemBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder,
    PermissionFlagsBits,
    InteractionContextType,
    MessageFlags
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('เมนูตั้งค่าห้อง (เฉพาะแอดมิน)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const promptComponents = [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### 🔨 **เมนูตั้งค่าห้องเฉพาะแอดมิน**\nกรุณาเลือกข้อความที่ต้องการตั้งค่า"),
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("setup_selection")
                                .setPlaceholder("เลือกหน้าต่าง")
                                .addOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel("หน้าต่างการเปิดทิคเก็ตสนับสนุน")
                                        .setValue("setup_support_ticket"),
                                ),
                        ),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("-# โปรดดำเนินการภายใน 10 วินาทีก่อนหมดอายุ"),
                ),
        ];

        const channel = interaction.client.channels.cache.get(interaction.channel.id);
        const response = await interaction.reply({ 
            components: promptComponents,
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const selection = await response.awaitMessageComponent({ 
                filter: collectorFilter, 
                time: 10_000 
            });

            const selectedValue = selection.values[0];

            switch (selectedValue) {
                case 'setup_support_ticket': {
                    const ticketComponent = [
                        new ContainerBuilder()
                            .addMediaGalleryComponents(
                                new MediaGalleryBuilder()
                                    .addItems(
                                        new MediaGalleryItemBuilder()
                                            .setURL("https://media.discordapp.net/attachments/1376182983433781349/1384638077523202069/component-cover-ticket.png?ex=6853d0f3&is=68527f73&hm=1cdc75a4fe7d2bfcda18153f5aa54ccc1cbddb8d8078e5be264384d19a56c60c&=&format=webp&quality=lossless&width=1440&height=221"),
                                    ),
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent("# **📫 Support Ticket — ติดต่อแอดมิน**\nพื้นที่ช่วยเหลือหากคุณต้องการติดต่อสอบถามปัญหาแอดมินแบบส่วนตัว\nกรุณาใช้พื้นที่ตรงนี้ในการสร้างทิกเก็ต เพื่อติดต่อกับแอดมินโดยตรงแทนการทักข้อความส่วนตัว\nกรุณากดปุ่ม \`ติดต่อแอดมิน\` เพื่อเริ่มต้นการใช้งาน\n\nหลังจากเปิดระบบแล้ว กรุณาแจ้งข้อมูลที่ต้องการอย่างละเอียดครบถ้วน และแนบรูปภาพหรือวิดีโอ (หากมี) โดยทันที ไม่ต้องรอให้แอดมินตอบกลับ แล้วเราจะทำการตอบกลับช่วยเหลือคุณให้ไวที่สุดเท่าที่จะเป็นไปได้\n\n-# การเปิดห้องเพื่อปั่นป่วนโดยไม่มีความจำเป็น จะมีบทลงโทษ หากไม่ได้ตั้งใจกรุณารีบกดปิดห้องโดยทันที"),
                            )
                            .addSeparatorComponents(
                                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Primary)
                                            .setLabel("ติดต่อแอดมิน")
                                            .setCustomId("create_support_ticket"),
                                        new ButtonBuilder()
                                            .setStyle(ButtonStyle.Link)
                                            .setLabel("วิธีติดต่อทีมงานของเกม")
                                            .setURL("https://arenabreakout-infinite.com/how-to-contact-the-customer-support-service/"),
                                    ),
                            )
                    ]

                    await channel.send({ 
                        components: ticketComponent,
                        flags: MessageFlags.IsComponentsV2,
                    });
                    break;
                }
                default: 
                    break;
            }

            const successComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`### ✅ ดำเนินการ \`\`${selectedValue}\`\` สำเร็จแล้ว`),
                    )
            ]

            await interaction.editReply({ 
                components: successComponents, 
            });
            await selection.deferUpdate();

        } catch (error) {
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
    }
}