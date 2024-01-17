"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const node_fs_1 = require("node:fs");
const discord_js_1 = require("discord.js");
class BotClient extends discord_js_1.Client {
    getGuildById(guildId) {
        return this.guilds.cache.get(guildId);
    }
    getChannelById(channelId) {
        return this.channels.cache.get(channelId);
    }
    constructor(rootFolderName) {
        super({
            intents: 131071
        });
        this.slashCommands = new discord_js_1.Collection();
        this.contextCommands = new discord_js_1.Collection();
        this.textCommands = new discord_js_1.Collection();
        this.rootPath = '';
        this.rootFolderName = '';
        this.rootFolderName = rootFolderName;
    }
    async start(token) {
        const { rootFolderName } = this;
        try {
            const rootPath = __dirname.includes('src') ? `src/${rootFolderName}` : `dist/${rootFolderName}`;
            this.rootPath = rootPath;
            this.loadEvents();
            this.loadCommands('slash', this.slashCommands);
            this.loadCommands('context', this.contextCommands);
            this.loadCommands('text', this.textCommands);
            this.login(token);
            // this.on()
        }
        catch (error) {
            // console.log("🔴 An error occurred while connecting to the database", error)
            console.log(`❌ An error occurred while starting the bot ${rootFolderName}`, error);
        }
    }
    loadCommands(folderName, commandCollection) {
        const { rootPath, rootFolderName } = this;
        if ((0, node_fs_1.existsSync)(`./${rootPath}/commands/${folderName}/`)) {
            (0, node_fs_1.readdirSync)(`./${rootPath}/commands/${folderName}/`).forEach(file => {
                const command = new (require(`../${rootFolderName}/commands/${folderName}/${file}`).default)();
                commandCollection.set(command.struct.name, command);
            });
        }
    }
    loadEvents() {
        const { rootPath, rootFolderName } = this;
        (0, node_fs_1.readdirSync)(`./${rootPath}/events/`).forEach(async (file) => {
            const event = new (await Promise.resolve(`${`../${rootFolderName}/events/${file}`}`).then(s => __importStar(require(s)))).default();
            if (event.isOnce)
                this.once(event.name, async (...args) => await event.execute(...args, this));
            else
                this.on(event.name, async (...args) => await event.execute(...args, this));
        });
    }
}
exports.BotClient = BotClient;
