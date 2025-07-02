const { Events } = require("discord.js");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,

    async execute(oldState, newState) {
        console.log(`joined channel 1385935896980754442`);
    },
};
