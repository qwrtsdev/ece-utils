const {
    Events,
    EmbedBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js')
const { roles, channels } = require('../utils/config.json');

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {  
        if (!interaction.isModalSubmit()) return;

        switch (interaction.customId) {
            case 'verification_modal': {
                try {
                    const replyEmbed = new EmbedBuilder()
                        .setDescription(`✅ <@${interaction.user.id}> ยืนยันตัวตนเสร็จแล้ว!`)
                        .setColor("#33ff70");

                    const response = await interaction.reply({
                        embeds: [replyEmbed],
                    });

                    const joinRole = interaction.guild.roles.cache.find(role => role.id === roles.unauthorized);
                    const verifyRole = interaction.guild.roles.cache.find(role => role.id === roles.member);
                    await interaction.member.roles.remove(joinRole);
                    await interaction.member.roles.add(verifyRole);

                    const dmEmbed = new EmbedBuilder()
                        .setDescription(`# ✅ **ยืนยันตัวตนสำเร็จ**\nยินดีต้อนรับ <@${interaction.user.id}> คุณได้รับการอนุมัติเข้าสู่เซิร์ฟเวอร์คอมมูนิตี้ Electrical Engineering and Computer แล้ว!\n\nคุณสามารถเข้าไปพูดคุย / แชร์เนื้อหาเรียน / เล่นเกม และอื่นๆ ด้วยกันกับทุกคนในเซิร์ฟเวอร์ได้เลย\n\n**แล้วอย่าลืมอ่านกฎของเซิร์ฟเวอร์ด้วยนะ ขอให้สนุก!**`)
                        .setImage("https://i.imgflip.com/1xilhy.jpg")
                        .setColor("#33ff70")
                    const goToChat = new ButtonBuilder()
                        .setLabel('ไปที่ห้องแชท')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/1385682544623616211/1385682545210949840');
                    const dmRow = new ActionRowBuilder()
			            .addComponents(goToChat);

                    await interaction.user.send({
                        embeds: [dmEmbed],
                        components: [dmRow],
                    })

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