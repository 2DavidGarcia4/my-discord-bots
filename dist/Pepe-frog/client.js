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
exports.PepeFrogClient = void 0;
const discord_js_1 = require("discord.js");
const db_1 = require("./db");
const fs_1 = require("fs");
class PepeFrogClient extends discord_js_1.Client {
    getGuildById(guildId) {
        return this.guilds.cache.get(guildId);
    }
    getChannelById(channelId) {
        return this.channels.cache.get(channelId);
    }
    constructor() {
        super({ intents: 131071, });
        this.data = db_1.FrogDb;
        this.slashCommands = new discord_js_1.Collection();
        this.contextCommands = new discord_js_1.Collection();
        this.textCommands = new discord_js_1.Collection();
    }
    async start(token) {
        try {
            const isDist = __dirname.includes('src') ? 'src/Pepe-frog' : 'dist/Pepe-frog';
            this.loadEvents(isDist);
            this.loadTextCommands(isDist);
            this.loadSlashCommands(isDist);
            this.loadContextCommands(isDist);
            this.login(token);
            // this.on()
        }
        catch (error) {
            // console.log("🔴 An error occurred while connecting to the database", error)
            console.log("🔴 An error occurred while starting the bot", error);
        }
    }
    loadTextCommands(isDist) {
        (0, fs_1.readdirSync)(`./${isDist}/commands/text/`).forEach(file => {
            const textCommand = new (require(`./commands/text/${file}`).default)();
            this.textCommands.set(textCommand.name, textCommand);
        });
    }
    loadSlashCommands(isDist) {
        (0, fs_1.readdirSync)(`./${isDist}/commands/slash/`).forEach(file => {
            const slashCommand = new (require(`./commands/slash/${file}`).default)();
            this.slashCommands.set(slashCommand.struct.name, slashCommand);
        });
    }
    loadContextCommands(isDist) {
        (0, fs_1.readdirSync)(`./${isDist}/commands/context/`).forEach(file => {
            const contextCommand = new (require(`./commands/context/${file}`).default)();
            this.contextCommands.set(contextCommand.struct.name, contextCommand);
        });
    }
    loadEvents(isDist) {
        (0, fs_1.readdirSync)(`./${isDist}/events/`).forEach(async (file) => {
            const event = await Promise.resolve(`${`./events/${file}`}`).then(s => __importStar(require(s)));
            if (event.once)
                this.once(event.name, async (...args) => await event.execute(...args, this));
            else
                this.on(event.name, async (...args) => await event.execute(...args, this));
        });
    }
}
exports.PepeFrogClient = PepeFrogClient;
