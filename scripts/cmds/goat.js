const axios = require("axios");
const fs = require("fs");
const path = require("path");

const GoatStor = "https://goatstore2.onrender.com";
const COMMANDS_DIR = path.join(process.cwd(), "scripts", "cmds"); // configurable

module.exports = {
  config: {
    name: "goatstor",
    aliases: ["gs", "market"],
    version: "1.0.0",
    role: 2,
    author: "ArYAN (Refactored by Aminul Sordar)",
    shortDescription: { en: "📌 GoatStor - Your Command Marketplace" },
    longDescription: {
      en: "📌 Browse, search, upload, and manage commands in the GoatStor marketplace."
    },
    category: "market",
    cooldowns: 0
  },

  onStart: async ({ event, args, message }) => {
    const sendMsg = (content) => {
      const header = "╭──『 𝐆𝐨𝐚𝐭𝐒𝐭𝐨𝐫 』──╮\n";
      const footer = "\n╰─────────────╯";
      return message.reply(header + content + footer);
    };

    const formatDateBD = (date) =>
      new Date(date).toLocaleString("en-US", { timeZone: "Asia/Dhaka" });

    // -------- Handlers --------
    const handleHelp = () => sendMsg(`
╭─❯ ${event.body} show <ID>
├ 📦 Get command code
╰ Example: show 1

╭─❯ ${event.body} page <number>
├ 📄 Browse commands
╰ Example: page 1

╭─❯ ${event.body} search <query>
├ 🔍 Search commands
╰ Example: search music

╭─❯ ${event.body} trending
├ 🔥 View trending
╰ Most popular commands

╭─❯ ${event.body} stats
├ 📊 View statistics
╰ Marketplace insights

╭─❯ ${event.body} like <ID>
├ 💝 Like a command
╰ Example: like 1

╭─❯ ${event.body} upload <name>
├ ⬆️ Upload command
╰ Example: upload goatStor

💫 𝗧𝗶𝗽: Use 'help goatstor' for details
    `);

    const handleShow = async (id) => {
      if (isNaN(id)) return sendMsg("\n[⚜️]➜ Please provide a valid ID.");
      const { data: item } = await axios.get(`${GoatStor}/api/item/${id}`);
      sendMsg(`
╭─❯ 👑 Name
╰ ${item.itemName}

╭─❯ 🆔 ID
╰ ${item.itemID}

╭─❯ ⚙️ Type
╰ ${item.type || "Unknown"}

╭─❯ 👨‍💻 Author
╰ ${item.authorName}

╭─❯ 🔗 Code
╰ ${GoatStor}/raw/${item.rawID}

╭─❯ 📅 Added
╰ ${formatDateBD(item.createdAt)}

╭─❯ 👀 Views
╰ ${item.views}

╭─❯ 💝 Likes
╰ ${item.likes}
      `);
    };

    const handlePage = async (page) => {
      page = parseInt(page) || 1;
      const { data } = await axios.get(`${GoatStor}/api/items?page=${page}&limit=5`);
      const totalPages = Math.ceil(data.total / 5);
      if (page <= 0 || page > totalPages) return sendMsg("\n[⚜️]➜ Invalid page number.");
      const itemsList = data.items
        .map((item, i) => `╭─❯ ${i + 1}. 📦 ${item.itemName}
├ 🆔 ID: ${item.itemID}
├ ⚙️ Type: ${item.type}
├ 📝 Desc: ${item.description}
╰ 👨‍💻 Author: ${item.authorName}`)
        .join("\n");
      sendMsg(`\n📄 Page ${page}/${totalPages}\n\n${itemsList}`);
    };

    const handleSearch = async (query) => {
      if (!query) return sendMsg("\n[⚜️]➜ Please provide a search query.");
      const { data } = await axios.get(`${GoatStor}/api/items?search=${encodeURIComponent(query)}`);
      if (!data.items.length) return sendMsg("\n❌ No matching commands found.");
      const results = data.items
        .slice(0, 5)
        .map((item, i) => `╭─❯ ${i + 1}. 📦 ${item.itemName}
├ 🆔 ID: ${item.itemID}
├ ⚙️ Type: ${item.type}
╰ 👨‍💻 Author: ${item.authorName}`)
        .join("\n");
      sendMsg(`\n📝 Query: "${query}"\n\n${results}`);
    };

    const handleTrending = async () => {
      const { data } = await axios.get(`${GoatStor}/api/trending`);
      const list = data
        .slice(0, 5)
        .map((item, i) => `╭─❯ ${i + 1}. 🔥 ${item.itemName}
├ 💝 Likes: ${item.likes}
╰ 👀 Views: ${item.views}`)
        .join("\n");
      sendMsg(`\n${list}`);
    };

    const handleStats = async () => {
      const { data: s } = await axios.get(`${GoatStor}/api/stats`);
      const uptimeStr = `${s.hosting?.uptime?.years}y ${s.hosting?.uptime?.months}m ${s.hosting?.uptime?.days}d ${s.hosting?.uptime?.hours}h ${s.hosting?.uptime?.minutes}m ${s.hosting?.uptime?.seconds}s`;
      sendMsg(`
╭─❯ 📦 Total Commands
╰ ${s.totalCommands}

╭─❯ 💝 Total Likes
╰ ${s.totalLikes}

╭─❯ 👥 Daily Users
╰ ${s.dailyActiveUsers}

╭─❯ 👑 Top Authors
╰ ${s.topAuthors.map((a, i) => `${i + 1}. ${a._id || "Unknown"} (${a.count})`).join("\n")}

╭─❯ 🔥 Top Viewed
╰ ${s.topViewed.map((v, i) => `${i + 1}. ${v.itemName} (ID: ${v.itemID}) - ${v.views} views`).join("\n")}

╭─❯ 🏷️ Popular Tags
╰ ${s.popularTags.map((t, i) => `${i + 1}. ${t._id || "Unknown"} (${t.count})`).join("\n")}

🌐 Hosting Info
╭─❯ ⏰ Uptime
╰ ${uptimeStr}
╭─❯ 💻 System
├ 🔧 ${s.hosting.system.platform} (${s.hosting.system.arch})
├ 📌 Node ${s.hosting.system.nodeVersion}
╰ 🖥️ CPU Cores: ${s.hosting.system.cpuCores}
      `);
    };

    const handleLike = async (id) => {
      if (isNaN(id)) return sendMsg("\n[⚠️]➜ Please provide a valid item ID.");
      const { data } = await axios.post(`${GoatStor}/api/items/${id}/like`);
      if (data.success) {
        sendMsg(`\n╭─❯ ✨ Status\n╰ Liked!\n\n╭─❯ 💝 Total Likes\n╰ ${data.likes}`);
      } else {
        sendMsg("\n[⚜️]➜ Failed to like command.");
      }
    };

    const handleUpload = async (name) => {
      if (!name) return sendMsg("\n[⚜️]➜ Please provide a command name.");
      const filePath = path.join(COMMANDS_DIR, `${name}.js`);
      if (!fs.existsSync(filePath)) return sendMsg(`\n❌ File '${name}.js' not found.`);
      try {
        const code = fs.readFileSync(filePath, "utf8");
        const cmdFile = require(filePath);
        const uploadData = {
          itemName: cmdFile.config?.name || name,
          description: cmdFile.config?.longDescription?.en || cmdFile.config?.shortDescription?.en || "No description",
          type: "GoatBot",
          code,
          authorName: cmdFile.config?.author || event.senderID || "Unknown"
        };
        const res = await axios.post(`${GoatStor}/v1/paste`, uploadData);
        if (res.data.success) {
          sendMsg(`
╭─❯ ✅ Status
╰ Command uploaded!

╭─❯ 👑 Name
╰ ${uploadData.itemName}

╭─❯ 🆔 ID
╰ ${res.data.itemID}

╭─❯ 👨‍💻 Author
╰ ${uploadData.authorName}

╭─❯ 🔗 Code
╰ ${res.data.link}
          `);
        } else {
          sendMsg("\n[⚜️]➜ Failed to upload the command.");
        }
      } catch (err) {
        console.error("Upload error:", err);
        sendMsg("\n[⚜️]➜ An unexpected error occurred during upload.");
      }
    };

    // -------- Command Routing --------
    try {
      const cmd = (args[0] || "").toLowerCase();
      const param = args.slice(1).join(" ");
      switch (cmd) {
        case "show": return handleShow(param);
        case "page": return handlePage(param);
        case "search": return handleSearch(param);
        case "trending": return handleTrending();
        case "stats": return handleStats();
        case "like": return handleLike(param);
        case "upload": return handleUpload(param);
        default: return handleHelp();
      }
    } catch (err) {
      console.error("GoatStor Error:", err);
      sendMsg("\n[⚜️]➜ An unexpected error occurred.");
    }
  }
};
