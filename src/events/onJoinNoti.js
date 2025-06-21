const { 
    Events,
    TextDisplayBuilder,
    MediaGalleryBuilder, 
    MediaGalleryItemBuilder, 
    SeparatorBuilder, 
    SeparatorSpacingSize, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder,
    MessageFlags,
    AttachmentBuilder
} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { channels } = require('../utils/config.json')
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(interaction) {
        
        try {
            const channel = interaction.client.channels.cache.get(channels.joinLeave);

            const canvas = Canvas.createCanvas(1400, 500);
            const context = canvas.getContext('2d');

            const bgBuffer = fs.readFileSync(path.resolve(__dirname, '../assets/images/ece-join-bg.png'));
            const background = await Canvas.loadImage(bgBuffer);

            context.drawImage(background, 0, 0, canvas.width, canvas.height);
            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'join-image.png' });
            
            await channel.send({ 
                content: `<@${interaction.user.id}>`,
                files: [attachment] 
            })
        } catch (error) {
            console.error('[join log] error', error);
        }
    }
}