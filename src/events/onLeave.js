const {
    Events,
    AttachmentBuilder
} = require('discord.js')
const Canvas = require('@napi-rs/canvas');
const { roles, channels } = require('../utils/config.json')
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(interaction) {  
        try {
            const unixTime = Math.floor(Date.now() / 1000);

            // join notification
            const channel = interaction.client.channels.cache.get(channels.joinLeave);

            await channel.send({ 
                content: `😭 <@${interaction.user.id}> <t:${unixTime}:f>`,
                files: [attachment] 
            })
        } catch (error) {
            console.error('[join log] error', error);
        }
    }
}