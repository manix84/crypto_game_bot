import Discord from "discord.js";
import { success, info, br } from "../utils/log";

const bot = new Discord.Client();
const CHANNEL = process.env.DISCORD_CHANNEL || false;

interface LevelsProps {
  [index: number]: {
    code: string;
    reply: string;
    color: string;
    id: number;
  }
}

const levelsList: number[] = [1, 2, 3, 4, 5];
const levels: LevelsProps = {};

levelsList.forEach(levelNumber => {
  if (process.env[`LEVEL_${levelNumber}_CODE`] && process.env[`LEVEL_${levelNumber}_REPLY`] && process.env[`LEVEL_${levelNumber}_ID`]) {
    levels[levelNumber] = {
      code: process.env[`LEVEL_${levelNumber}_CODE`] || "",
      reply: process.env[`LEVEL_${levelNumber}_REPLY`] || "",
      color: process.env[`LEVEL_${levelNumber}_COLOR`] || "",
      id: Number(process.env[`LEVEL_${levelNumber}_ID`]) || 0
    };
  }
});

bot.on("ready", () => {
  info(`Logged in as ${bot.user?.tag}!`);
  br();
});

bot.on("message", (message: Discord.Message) => {
  if (message.content.endsWith("!crypto ping!")) {
    info(message.content);
    message.channel.send("pong!");
  }

  if ((message.channel.id === CHANNEL)) {
    message.delete();
    Object.entries(levels).forEach(([levelNumber, level]) => {
      if (message.content === level.code) {
        message.member?.roles.add(level.ID);
        success(`${message.author.username} successfully guessed Level #${levelNumber} code.`);
        const embeddedSetupMessage = new Discord.MessageEmbed()
          .setColor(level.color)
          .setTitle("Kryptische Hinweise")
          .setDescription(level.reply)
          .setThumbnail(`https://${process.env.HOST}/images/logo.png`)
          .setTimestamp()
          .setFooter("Crypto Bot", `https://${process.env.HOST}/images/logo_bordered.png`);

        message.author.send(embeddedSetupMessage);
        // message.channel.send("Check your private messages for setup instructions.");
      }
    });
  }
});

export const init = (): void => {
  bot.login(process.env.DISCORD_TOKEN);
};
