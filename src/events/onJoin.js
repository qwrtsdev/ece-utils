const { Events, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { roles, channels } = require('../utils/config.json');
const fs = require('fs');
const path = require('path');
const { request } = require('undici');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute(member) {
        try {
            const unixTime = Math.floor(Date.now() / 1000);

            // join roles
            const joinRole = member.guild.roles.cache.get(roles.unauthorized);
            await member.roles.add(joinRole);

            // canvas
            const canvas = Canvas.createCanvas(1400, 500);
            const context = canvas.getContext('2d');

            const bgBuffer = fs.readFileSync(path.resolve(__dirname, '../assets/images/ece-join-bg.png'));
            const background = await Canvas.loadImage(bgBuffer);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            const avatarUrl = member.user.displayAvatarURL({ extension: 'jpg', size: 256 * 2 });
            const { body } = await request(avatarUrl);
            const avatar = await Canvas.loadImage(await body.arrayBuffer());

            context.save();
            context.beginPath();
            context.arc(125, 125, 100, 0, Math.PI * 2, true);
            context.closePath();
            context.clip();
            context.drawImage(avatar, 25, 25, 200, 200);
            context.restore();

            context.font = '60px sans-serif';
            context.fillStyle = '#fe0000';
            context.fillText(`Hello, ${member.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

            // welcome message
            const channel = member.client.channels.cache.get(channels.joinLeave);
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'join-image.png' });
            await channel.send({ 
                content: `👋🏻 <@${member.id}> <t:${unixTime}:f>`, 
                files: [attachment] 
            });

        } catch (error) {
            console.error('[join log] error :', error);
        }
    }
};
