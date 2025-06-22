const {
    Events
} = require('discord.js')

module.exports = {
    name: Events.MessageCreate,
    once: false,

    async execute(message) {  
        if (message.channelId === '1385934660089024633' && !message.author.bot) {
            await message.crosspost()
        }
    }
}