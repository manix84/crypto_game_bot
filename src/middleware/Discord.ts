import Discord from "discord.js";
import { success, info, br, error } from "../utils/log";

const bot = new Discord.Client();
const CHANNEL = process.env.DISCORD_CHANNEL || false;

interface LevelsProps {
  [index: number]: {
    code: string;
    reply: string;
    id: string;
  }
}

const levelsList: number[] = [1, 2, 3, 4, 5];
const levels: LevelsProps = {};

levelsList.forEach(levelNumber => {
  if (process.env[`LEVEL_${levelNumber}_CODE`] && process.env[`LEVEL_${levelNumber}_REPLY`] && process.env[`LEVEL_${levelNumber}_ID`]) {
    levels[levelNumber] = {
      code: process.env[`LEVEL_${levelNumber}_CODE`] || "",
      reply: process.env[`LEVEL_${levelNumber}_REPLY`] || "",
      id: process.env[`LEVEL_${levelNumber}_ID`] || "000000000000000000"
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

  if (!CHANNEL || message.channel.id === CHANNEL) {
    Object.entries(levels).forEach(([levelNumber, level]) => {
      if (message.content.toLowerCase() === level.code.toLowerCase()) {
        message.guild?.roles.fetch(level.id)
          .then(role => {
            role && message.member?.roles?.add(role, `Unlocked level #${levelNumber} in Crypto Game.`);

            const embeddedSetupMessage = new Discord.MessageEmbed()
              .setColor(role?.color || "gold")
              .setTitle("Kryptische Hinweise")
              .setDescription(level.reply)
              .setThumbnail(`https://${process.env.HOST}/images/logo.png`)
              .setTimestamp()
              .setFooter("Crypto Bot", `https://${process.env.HOST}/images/logo.png`);

            message.author.send(embeddedSetupMessage);
            success(`${message.author.username} successfully guessed Level #${levelNumber} code.`);
          }).catch(error);
      }
    });
  }
});

export const init = (): void => {
  bot.login(process.env.DISCORD_TOKEN);
};
