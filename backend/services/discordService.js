const axios = require('axios');
require('dotenv').config();

const sendDiscordNotification = async (title, fields, actionLink) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log("⚠️ No DISCORD_WEBHOOK_URL found. Skipping notification.");
        console.log(`[Mock Discord] Title: ${title}`);
        return;
    }

    // specific color based on title keyword
    let color = 5814783; // Blue default
    if (title.includes('GitHub')) color = 242424; // GitHub Black/Grey
    if (title.includes('LinkedIn')) color = 28672; // LinkedIn Blue
    if (title.includes('Codolio')) color = 16761095; // Yellow

    const embed = {
        title: `🚀 Portfolio Update: ${title}`,
        color: color,
        fields: Object.entries(fields).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(value).substring(0, 1024), // Discord limit
            inline: false
        })),
        footer: {
            text: "Automated Portfolio Bot"
        }
    };

    if (actionLink) {
        embed.description = `[**👉 Click here to Review & Approve**](${actionLink})`;
    }

    try {
        await axios.post(webhookUrl, {
            username: "Portfolio Bot",
            avatar_url: "https://i.imgur.com/4M34hi2.png",
            embeds: [embed]
        });
        console.log("✅ Discord Notification Sent!");
    } catch (error) {
        console.error("❌ Error sending Discord notification:", error.message);
    }
};

module.exports = { sendDiscordNotification };
