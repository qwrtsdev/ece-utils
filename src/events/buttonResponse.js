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
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');
const { roles, channels } = require('../utils/config.json');
const eceMembers = require('../models/user.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.user;
        const unixTime = Math.floor(Date.now() / 1000);

        if (!interaction.isButton()) return;

        // verification buttons
        if (interaction.customId.startsWith('VERIFY_USER-')) {
            const userId = interaction.customId.split('-')[1];
            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: `❌ ไม่พบผู้ใช้ <@${userId}> ในเซิร์ฟเวอร์`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const editComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`✅ อนุมัติการเข้าร่วม <@${userId}> แล้ว`),
                    ),
            ]

            await interaction.update({
                components: editComponents,
                flags: MessageFlags.IsComponentsV2,
            })

            const joinRole = interaction.guild.roles.cache.find(role => role.id === roles.unauthorized);
            const verifyRole = interaction.guild.roles.cache.find(role => role.id === roles.member);
            await member.roles.add(verifyRole)
            await member.roles.remove(joinRole)

            const updateDB = await eceMembers.updateOne({ userID: userId }, { isVerified: true });
            console.log('Updated DB :', updateDB);

            const dmComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`-# <t:${unixTime}:f>\n# ✅ **คุณผ่านการอนุมัติ !**\nยินดีด้วย คุณผ่านการคัดเลือกในการเข้าร่วมเซิร์ฟเวอร์เป็นที่เรียบร้อย\nขอต้อนรับเข้าสู่เซิร์ฟเวอร์ของภาควิชา Electrical and Computer Engineering!\n\nคุณสามารถเข้าไปพูดคุย / แชร์เนื้อหาเรียน / เล่นเกม และอื่นๆ ด้วยกันกับทุกคนในเซิร์ฟเวอร์ได้เลย\nแล้วอย่าลืมอ่านกฎของเซิร์ฟเวอร์ด้วยนะ ขอให้สนุก!`),
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ไปที่แชทหลัก")
                                    .setURL("https://discord.com/channels/1385682544623616211/1385682545210949840"),
                            ),
                    ),
            ]

            return member.send({
                components: dmComponents,
                flags: MessageFlags.IsComponentsV2,
            })
        } else if (interaction.customId.startsWith('DENY_USER-')) {
            const userId = interaction.customId.split('-')[1];
            const member = await interaction.guild.members.fetch(userId).catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: `❌ ไม่พบผู้ใช้ <@${userId}> ในเซิร์ฟเวอร์`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const editComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`❌ ปฎิเสธการเข้าร่วม <@${userId}> แล้ว`),
                    ),
            ]

            await interaction.update({
                components: editComponents,
                flags: MessageFlags.IsComponentsV2,
            })

            const dmComponents = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`-# <t:${unixTime}:f>\n# ⚠️ **คุณไม่ผ่านการอนุมัติ !**\nขออภัย ขณะนี้คุณไม่ผ่านการอนุมัติดการเข้าร่วมเซิร์ฟเวอร์ของเรา เนื่องจากอาจมีคุณสมบัติที่ไม่ตรงกับวัตถุประสงค์นัก\n\nหากคิดว่านี่อาจเป็นความผิดพลาด สามารถส่งคำขอผ่านการยืนยันตัวตนเข้ามาใหม่ \nหรือ กรุณาติดต่อทีมงานโดยทันที`),
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ไปลงทะเบียนใหม่")
                                    .setURL("https://discord.com/channels/1385682544623616211/1385686306033762496"),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ติดต่อแอดมิน")
                                    .setURL("https://discordapp.com/users/824442267318222879/"),
                            ),
                    ),

            ]

            return member.send({
                components: dmComponents,
                flags: MessageFlags.IsComponentsV2,
            })
        }

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
                            new TextDisplayBuilder().setContent(`<t:${unixTime}:f>\n\n- อธิบายปัญหาของคุณให้ชัดเจน ยิ่งละเอียดยิ่งดี!\n- กรุณาแนบรูปภาพ หรือวิดีโอประกอบเพื่อทำให้เข้าใจปัญหาได้ดียิ่งขึ้น\n- ทดลองค้นหาปัญหาใน Google หรือประวัติข้อความในเซิร์ฟเวอร์เพื่อไม่ให้ซ้ำคำถามเก่า\n- หากแก้ปัญหาได้แล้ว กรุณากดปุ่ม \"แก้ไขแล้ว\"`),
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

            // handle verification
            case 'open_verification': {
                const modal = new ModalBuilder()
                    .setCustomId('verification_modal')
                    .setTitle('ยืนยันตัวตน')
                    .addComponents(
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('userNickName')
                                .setLabel("ชื่อเล่นของคุณ")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('เกม')
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('studentIdNumber')
                                .setLabel("รหัสนักศึกษา 13 หลักของคุณ")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('680xxxxxxxxxx')
                                .setMaxLength(13)
                                .setMinLength(13)
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('departmentName')
                                .setLabel("สาขาวิชาของคุณ")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('วิศวกรรมคอมพิวเตอร์')
                                .setRequired(true)
                        ),
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setCustomId('instagramUsername')
                                .setLabel("ชื่อผู้ใช้ Instagram ของคุณ")
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder('sillyqwrts')
                        )
                    );

                await interaction.showModal(modal);
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

            // default
            default: return;
        }
    },
};