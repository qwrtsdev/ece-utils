const { 
    Events,
    AttachmentBuilder
} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { roles, channels } = require('../utils/config.json')
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(interaction) {        
        try {
            const unixTime = Math.floor(Date.now() / 1000);

            // join roles
            const joinRole = interaction.guild.roles.cache.find(role => role.name === roles.unauthorized);
            await interaction.roles.add(joinRole)

            // join notification
            const channel = interaction.client.channels.cache.get(channels.joinLeave);

            const canvas = Canvas.createCanvas(1400, 500);
            const context = canvas.getContext('2d');

            const bgBuffer = fs.readFileSync(path.resolve(__dirname, '../assets/images/ece-join-bg.png'));
            const background = await Canvas.loadImage(bgBuffer);

            const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
            const avatar = await Canvas.loadImage(await body.arrayBuffer());
	        context.drawImage(avatar, 25, 25, 200, 200);

            context.beginPath();
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();

            context.font = '60px sans-serif';
            context.fillStyle = '#ffffff';
            context.fillText(interaction.member.displayName, canvas.width / 2.5, canvas.height / 1.8);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'join-image.png' });
            
            await channel.send({ 
                content: `👋🏻 <@${interaction.user.id}> <t:${unixTime}:f>`,
                files: [attachment] 
            })
        } catch (error) {
            console.error('[join log] error', error);
        }
    }
}