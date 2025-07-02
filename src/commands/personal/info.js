const { 
    ContextMenuCommandBuilder, 
    ApplicationCommandType,
} = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Info')
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        // ..
    }
}