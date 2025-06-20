const { SlashCommandBuilder, 
    PermissionFlagsBits, 
    InteractionContextType, 
    MessageFlags, 
    EmbedBuilder 
} = require('discord.js');
const { exec } = require('child_process')
const { allowedRoles } = require('../../utils/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('หยุดการทำงานของบอท (อันตราย)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	    .setContexts(InteractionContextType.Guild),
	async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.name))) {
            return interaction.reply({ 
                embeds: '🚫 ไม่มีสิทธิ์ในการใช้คำสั่งนี้', 
                flags: MessageFlags.Ephemeral
            });
        }
        
        await interaction.reply({ 
            content: '🔴 กำลังดำเนินการปิดการทำงานบอท..', 
            flags: MessageFlags.Ephemeral
        });

        const notiChannel = interaction.client.channels.cache.get('1379862671217791069');
        const executor = interaction.user.tag ?? 'server'; 
        const icon = interaction.user.iconURL ?? 'https://media.discordapp.net/attachments/1376182983433781349/1380066711893442610/favicon-512x512.png?ex=684286c8&is=68413548&hm=bac15f1ac366e6b384187b5499d7e6dbe974b2f29340e68c326cb34db2807d31&=&format=webp&quality=lossless&width=576&height=576'
    
        const notiEmbed = new EmbedBuilder()
            .setDescription("## 🔴 **กำลังปิดการทำงานบอท**")
            .setColor("#dc2626")
            .setFooter({
                text: `${executor}`,
                iconURL: `${icon}`,
            })
            .setTimestamp();

        await notiChannel.send({ 
            embeds: [notiEmbed]
        });

        try {
            exec('pm2 stop index', (error) => {
                if (error) {
                    console.error(`Error stopping bot: ${error.message}`);
                    return;
                }
            });
        } catch (error) {
            console.error(`${error.message}`);
        }
	},
};