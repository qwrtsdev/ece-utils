const { Events, AttachmentBuilder } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { roles, channels } = require("../utils/config.json");
const fs = require("fs");
const path = require("path");
const { request } = require("undici");

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,

    async execute(member) {
        const unixTime = Math.floor(Date.now() / 1000);

        try {
            // create canvas with size
            const canvas = Canvas.createCanvas(1400, 500);
            const context = canvas.getContext("2d");

            // load bg
            const bgBuffer = fs.readFileSync(
                path.resolve(__dirname, "../assets/images/ece-join-bg.png")
            );
            const background = await Canvas.loadImage(bgBuffer);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            // load user avatar
            const avatarUrl = member.displayAvatarURL({
                extension: "jpg",
                size: 256 * 2,
            });
            const { body } = await request(avatarUrl);
            const avatar = await Canvas.loadImage(await body.arrayBuffer());

            // avatar image + stroke
            const avatarRadius = 135;
            const avatarX = 80;
            const avatarY = Math.round((canvas.height - avatarRadius * 2) / 2);
            context.save();
            context.beginPath();
            context.arc(
                avatarX + avatarRadius,
                avatarY + avatarRadius,
                avatarRadius,
                0,
                Math.PI * 2,
                true
            );
            context.closePath();
            context.clip();
            context.drawImage(
                avatar,
                avatarX,
                avatarY,
                avatarRadius * 2,
                avatarRadius * 2
            );
            context.restore();
            context.save();
            context.beginPath();
            context.arc(
                avatarX + avatarRadius,
                avatarY + avatarRadius,
                avatarRadius + 6,
                0,
                Math.PI * 2,
                true
            );
            context.strokeStyle = "#ea6f24";
            context.lineWidth = 15;
            context.stroke();
            context.restore();

            // custom font
            const customFont = path.resolve(
                __dirname,
                "../assets/fonts/LINESeedSansTH_A_Bd.ttf"
            );
            Canvas.GlobalFonts.registerFromPath(customFont, "customFont");

            // ellipsis text
            function fitTextWithEllipsis(ctx, text, maxWidth) {
                if (ctx.measureText(text).width <= maxWidth) return text;
                while (text.length > 0) {
                    text = text.slice(0, -1);
                    if (ctx.measureText(text + "...").width <= maxWidth) {
                        return text + "...";
                    }
                }
                return "...";
            }

            // text positioning
            const textX = avatarX + avatarRadius * 2 + 72;
            const textY = avatarY + 120;

            // text 1 (text)
            const memberCount = member.guild.memberCount;
            const memberFontSize = 50;
            const memberText = `ลาก่อนนะ...`;
            context.font = `${memberFontSize}px customFont`;
            context.fillText(memberText, textX, textY - 25);

            // text 2 (username)
            const textFontSize = 120;
            const maxTextWidth = canvas.width - textX - 72;
            context.font = `${textFontSize}px customFont`;
            context.fillStyle = "#09090b";
            const helloText = `${member.displayName}`;
            const displayText = fitTextWithEllipsis(
                context,
                helloText,
                maxTextWidth
            );
            context.fillText(displayText, textX, textY + 89);

            // sob image
            const sobImgBuffer = fs.readFileSync(
                path.resolve(__dirname, "../assets/images/sob.png")
            );
            const sobImg = await Canvas.loadImage(sobImgBuffer);
            const sobTargetHeight = 100;
            const sobScale = sobTargetHeight / 160;
            const sobTargetWidth = 160 * sobScale;
            const sobX = avatarX + avatarRadius * 2 - sobTargetWidth + 10;
            const sobY = avatarY + avatarRadius * 2 - sobTargetHeight + 10;
            context.drawImage(
                sobImg,
                sobX,
                sobY,
                sobTargetWidth,
                sobTargetHeight
            );

            const attachment = new AttachmentBuilder(
                await canvas.encode("png"),
                {
                    name: `${member.id}-leave-image.png`,
                }
            );
            const channel = member.guild.channels.cache.get(channels.joinLeave);
            await channel.send({
                content: `😭 <@${member.id}> <t:${unixTime}:f>`,
                files: [attachment],
            });
        } catch (error) {
            console.error("[join log] error :", error);
        }
    },
};
