const os = require("os");
const path = require("path");

// Load config and package.json with proper path resolution
let config, pkg;
try {
  config = require(path.join(__dirname, "../../config.json"));
  pkg = require(path.join(__dirname, "../../package.json"));
} catch (err) {
  console.error("Failed to load config:", err);
  config = {
    OWNER: "AMINUL-SORDAR",
    AGE: "18",
    GENDER: "MALE",
    nickNameBot: "𝐀𝐌𝐈𝐍𝐔𝐋-𝐁𝐎𝐓",
    FACEBOOK: "https://www.facebook.com/br4nd.abir.your.next.bf.jan",
    prefix: "#",
    timeZone: "Asia/Dhaka",
    database: { type: "sqlite" },
    autoRestart: { time: 3600000 },
    autoUptime: { enable: true }
  };
  pkg = { version: "N/A" };
}

module.exports = {
  config: {
    name: "up",
    aliases: ["uptime", "upt"],
    version: "1.6",
    author: "𝗔𝗺𝗶𝗻𝘂𝗹 𝗦𝗼𝗿𝗱𝗮𝗿",
    role: 0,
    shortDescription: {
      en: "Show bot uptime and system info"
    },
    longDescription: {
      en: "Displays how long the bot has been running with detailed system info"
    },
    category: "system",
    guide: {
      en: "{p}up"
    }
  },

  onStart: async function ({ message, threadsData }) {
    try {
      // Uptime calculations
      const uptime = os.uptime();
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Date/time formatting
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const time = currentDate.toLocaleTimeString("bn-BD", {
        timeZone: config.timeZone,
        hour12: true
      });

      // System metrics
      const ramUsage = Math.round(process.memoryUsage().rss / (1024 * 1024));
      const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024));
      const freeMemory = Math.round(os.freemem() / (1024 * 1024 * 1024));
      const cpuModel = os.cpus()[0].model;
      const cpuSpeed = os.cpus()[0].speed;

      // Bot data
      const allThreads = await threadsData.getAll();
      const totalThreads = allThreads.length;

      const response = `
╭━━━[ 🛠️ 𝐔𝐏𝐓𝐈𝐌𝐄 - 𝐒𝐓𝐀𝐓𝐔𝐒 🛠️ ]━━━╮
┃
┃ ⏱️ আপটাইম: ${days} দিন, ${hours} ঘন্টা, ${mins} মিনিট, ${seconds} সেকেন্ড
┃━━━━━━━━━━━━━━━━━━━━━━
┃ 👑 𝗢𝗪𝗡𝗘𝗥: ${config.OWNER}
┃ 🎂 বয়স: ${config.AGE}
┃ ♂️ লিঙ্গ: ${config.GENDER}
┃ 🤖 বট নাম: ${config.nickNameBot}
┃ 📦 Version: ${pkg.version}
┃ ⚙️ Prefix: ${config.prefix}
┃
┃ 🖥️ OS: ${os.platform()} ${os.release()}
┃ 🧠 CPU: ${cpuModel} (${os.cpus().length} cores @ ${cpuSpeed}MHz)
┃ 🏗️ Arch: ${os.arch()}
┃
┃ 💾 RAM: ${ramUsage} MB used / ${totalMemory} GB total
┃ 📉 Free RAM: ${freeMemory} GB
┃ 🧵 Active Threads: ${totalThreads}
┃ ⏳ Process Uptime: ${Math.floor(process.uptime())}s
┃
┃ 🔄 Auto Restart: ${config.autoRestart.time ? "✅ Enabled" : "❌ Disabled"}
┃ 🌐 Auto Uptime: ${config.autoUptime.enable ? "✅ Enabled" : "❌ Disabled"}
┃ 💽 Database: ${config.database.type.toUpperCase()}
┃
┃ 🔗 Facebook: ${config.FACEBOOK}
┃ 🕒 তারিখ: ${date}
┃ ⏰ সময়: ${time}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

      // Attachment handling with fallback
      let attachment;
      try {
        attachment = await global.utils.getStreamFromURL(
          "https://i.ibb.co/dJsW5m00/Screenshot-2025-05-06-20-44-41-152-com-android-chrome-edit.jpg"
        );
      } catch (e) {
        console.error("Image load error:", e);
        attachment = null;
      }

      await message.reply({
        body: response,
        attachment: attachment
      });

    } catch (error) {
      console.error("Uptime command error:", error);
      await message.reply("❌ | An error occurred while processing the uptime command.");
    }
  }
};
