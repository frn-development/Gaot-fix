module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt","up"],
    version: "1.0",
    author: "Aminulsordar",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Check bot uptime."
    },
    longDescription: {
      en: "Displays how long the bot has been running since it was last started."
    },
    category: "Utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const uptimeInMilliseconds = process.uptime() * 1000;

    const uptime = formatDuration(uptimeInMilliseconds);

    return api.sendMessage(`🤖 Bot Uptime:\n⏱ ${uptime}`, event.threadID, event.messageID);
  }
};
function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  let duration = "";
  if (days > 0) duration += `${days}d `;
  if (hours > 0) duration += `${hours}h `;
  if (minutes > 0) duration += `${minutes}m `;
  if (seconds > 0) duration += `${seconds}s`;

  return duration.trim();
}
