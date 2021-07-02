import Discord from "discord.js";
import { success, info, br, error } from "../utils/log";

const bot = new Discord.Client();
const CHANNEL = process.env.DISCORD_CHANNEL || false;
const MAX_LEVELS = process.env.LEVELS_MAX || 5;
const embeddedSetupMessage = new Discord.MessageEmbed()
  .setTitle("Kryptische Hinweise")
  .setThumbnail(`https://${process.env.HOST}/images/logo.png`)
  .setTimestamp()
  .setFooter("Crypto Bot", `https://${process.env.HOST}/images/logo.png`);

interface LevelsProps {
  [index: number]: {
    code: string;
    reply: string;
    id: string;
  }
}

const levels: LevelsProps = {};

for (let i = 1; i <= MAX_LEVELS; i++) {
  if (process.env[`LEVEL_${i}_CODE`] && process.env[`LEVEL_${i}_REPLY`] && process.env[`LEVEL_${i}_ID`]) {
    levels[i] = {
      code: process.env[`LEVEL_${i}_CODE`] || "",
      reply: process.env[`LEVEL_${i}_REPLY`] || "",
      id: process.env[`LEVEL_${i}_ID`] || "000000000000000000"
    };
  }
}

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
    let previousLevelID: string | null = null;
    let previousLevelRole: Discord.Role | undefined = undefined;
    let isInPreviousRole = false;
    let found = false;
    Object.entries(levels).forEach(([i, level]) => {
      const levelNumber = Number(i);
      if (previousLevelID) {
        previousLevelRole = message.guild?.roles.cache.get(previousLevelID);
        isInPreviousRole = !!previousLevelRole?.members.find(member => member === message.member);
      } else {
        // Forcing first run to be true.
        isInPreviousRole = true;
      }
      if (message && message.content.toLowerCase() === level.code.toLowerCase() && (levelNumber === 1 || isInPreviousRole)) {
        found = true;
        message.guild?.roles.fetch(level.id)
          .then(newLevelRole => {
            info("newLevelRole", newLevelRole);
            info("previousLevelID", previousLevelID);
            newLevelRole && message.member?.roles?.add(newLevelRole, `Unlocked level #${levelNumber} in Crypto Game.`)
              .catch(error);

            embeddedSetupMessage
              .setColor(newLevelRole?.color || "gold")
              .setDescription(level.reply);

            message.author.send(embeddedSetupMessage);
            success(`${message.author.username} successfully guessed Level #${levelNumber} code.`);
          })
          .catch(error)
          .finally(() => {
            message && message.delete();
            found = false;
            isInPreviousRole = false;
          });
      }
      previousLevelID = level.id;
    });
    if (!found && message) {
      message.delete();
    }
  }
});

export const init = (): void => {
  bot.login(process.env.DISCORD_TOKEN);
};
