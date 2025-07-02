const { Events } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    once: false,

    async execute(message) {
        if (
            message.channelId === "1385934660089024633" &&
            !message.author.bot
        ) {
            try {
                const msg = await message.channel.send({
                    content: "@everyone",
                });
                setTimeout(async () => {
                    await msg.delete();
                }, 1000);
            } catch (error) {
                console.error("[autoAnnounce] error:", error);
            }
        }
    },
};
