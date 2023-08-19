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
const fs_1 = require("fs");
const discord_js_1 = require("discord.js");
class BotClient extends discord_js_1.Client {
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
        (0, fs_1.readdirSync)(`./${rootPath}/commands/${folderName}/`).forEach(file => {
            const command = new (require(`../${rootFolderName}/commands/${folderName}/${file}`).default)();
            commandCollection.set(command.struct.name, command);
        });
    }
    // private loadSlashCommands(isDist: string){
    //   readdirSync(`./${isDist}/commands/slash/`).forEach(file => {
    //     const slashCommand: SlashCommand = new (require(`./commands/slash/${file}`).default)()
    //     this.slashCommands.set(slashCommand.struct.name, slashCommand)
    //   })
    // }
    // private loadContextCommands(isDist: string){
    //   readdirSync(`./${isDist}/commands/context/`).forEach(file => {
    //     const contextCommand: ContextCommand = new (require(`./commands/context/${file}`).default)()
    //     this.contextCommands.set(contextCommand.struct.name, contextCommand)
    //   })
    // }
    // private loadTextCommands(isDist: string): void {
    //   readdirSync(`./${isDist}/commands/text/`).forEach(file=> {
    //     const textCommand: TextCommand = new (require(`./commands/text/${file}`).default)()
    //     this.textCommands.set(textCommand.struct.name, textCommand)
    //   })
    // }
    loadEvents() {
        const { rootPath, rootFolderName } = this;
        (0, fs_1.readdirSync)(`./${rootPath}/events/`).forEach(async (file) => {
            const event = await Promise.resolve(`${`../${rootFolderName}/events/${file}`}`).then(s => __importStar(require(s)));
            if (event.once)
                this.once(event.name, async (...args) => await event.execute(...args, this));
            else
                this.on(event.name, async (...args) => await event.execute(...args, this));
        });
    }
}
exports.BotClient = BotClient;
