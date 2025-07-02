const {
    SlashCommandBuilder,
    MessageFlags,
    TextDisplayBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
} = require("discord.js");
const { request } = require("undici");
const { repoURL } = require("../../utils/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("repo")
        .setDescription("ดู source code ของบอทผ่าน GitHub"),
    async execute(interaction) {
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });

        try {
            const response = await request(repoURL, {
                headers: {
                    "User-Agent": "node.js",
                    Accept: "application/vnd.github.v3+json",
                },
            });
            const body = await response.body.json();
            const unixTime = Math.floor(
                new Date(body.updated_at).getTime() / 1000
            );

            const component = [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `-# 📆 <t:${unixTime}:f>\n# **${body.full_name}**\n\n${body.description}\n\n⭐ **${body.stargazers_count}**ᅠ⚠️ **${body.open_issues_count}**ᅠ🍴 **${body.forks_count}**`
                        )
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder().addItems(
                            new MediaGalleryItemBuilder().setURL(
                                `https://opengraph.githubassets.com/random/${body.owner.login}/${body.name}`
                            )
                        )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                            .setDivider(true)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("ไปที่หน้า Repository")
                                .setURL(`${body.html_url}`)
                        )
                    ),
            ];

            await interaction.editReply({
                components: component,
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.log("[repo] error :", error);
            await interaction.editReply({
                content:
                    "❌ เกิดข้อผิดพลาดในการดึงข้อมูล repository กรุณาลองใหม่อีกครั้งในภายหลังn\n||GitHub อนุญาตให้ fetch api แบบ un-authenticate ได้วันละไม่เกิน 60 รอบ เพราะงั้นพรุ่งนี้ค่อยลองใหม่ละกันนะ||",
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
