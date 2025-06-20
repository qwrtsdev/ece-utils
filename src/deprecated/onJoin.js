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
    MessageFlags
} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { content } = require('../utils/config.json')

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        const joinPath = content.join
        const filePath = path.join(__dirname, joinPath.messagePath);
        const messageData = fs.readFileSync(filePath, 'utf-8');
        const buttonsRow = joinPath.buttons

        const getButtonStyle = (type) => {
            switch(type) {
                case 'Link': return ButtonStyle.Link;
                case 'Primary': return ButtonStyle.Primary;
                case 'Secondary': return ButtonStyle.Secondary;
                case 'Success': return ButtonStyle.Success;
                case 'Danger': return ButtonStyle.Danger;
                default: return ButtonStyle.Link;
            }
        };

        const actionRows = buttonsRow.map(bttn => {
            const button = new ButtonBuilder()
                .setStyle(getButtonStyle(bttn.type))
                .setLabel(bttn.name);
            
            bttn.url && bttn.type === 'Link' && button.setURL(bttn.url);
            bttn.isDisabled && button.setDisabled(true);
            bttn.customID && button.setCustomId(bttn.customID);
            
            return new ActionRowBuilder()
                .addComponents(button);
        });

        const components = [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(messageData),
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(joinPath.imageUrl),
                        ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
                )
                .addActionRowComponents(...actionRows),
        ];

        try {
            await member.user.send({
                components: components,
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (err) {
            console.error(`❌ [onJoin] Cannot send DM to ${member.user.tag}: ${err.message}`);
        }
    },
};
