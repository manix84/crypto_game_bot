import Discord from "discord.js";
import Database from "./Database";
import { success, info, br, error, warn } from "../utils/log";

const db = new Database();
const bot = new Discord.Client();
const GUILD = process.env.DISCORD_GUILD || "";
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
let guild: Discord.Guild;
export const init = (): void => {
  bot.login(process.env.DISCORD_TOKEN).then(() => {
    // guild = bot.guilds.cache.get(GUILD);
    bot.guilds.fetch(GUILD).then((guildData) => {
      guild = guildData;
    });
  });
};

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
  if (message.author.bot) return; // Ignore bot messages.

  if (message.content.endsWith("!crypto ping!")) {
    info(message.content);
    message.channel.send("pong!");
  }

  if (message.channel.type === "dm") {
    const member = new Discord.GuildMember(bot, {user: {id: message.author.id}}, guild);

    let currentUserLevel = -1;
    db.getUserLevel(message.author.id, level => {
      currentUserLevel = level;
      if (!currentUserLevel) {
        currentUserLevel = 0;
        // db.setUserLevel(message.author.id, 0, (result) => {
        //   if (result) {
        //     success(`Setting initial level to 0, for ${message.author.username}.`);
        //   } else {
        //     error(`Something went wrong, and ${message.author.username} didn't save their level.`);
        //   }
        // });
      }
      console.log("getUserLevel:", level);

      info(`${message.author.username} guessed "${message.content}"`);
      Object.entries(levels).forEach(([i, level]) => {
        const levelNumber = Number(i);
        const isCorrectLevelAnswer = (message && message.content.toLowerCase() === level.code.toLowerCase());
        let isInPreviousRole = true;
        if (currentUserLevel === (levelNumber - 1)) {
          isInPreviousRole = true;
        } else {
          isInPreviousRole = false;
        }
        info(`Level #${levelNumber}`);
        info("  - isInPreviousRole", isInPreviousRole);
        info("  - isCorrectLevelAnswer", isCorrectLevelAnswer);
        if (isCorrectLevelAnswer && isInPreviousRole) {
          success(`${message.author.username} successfully guessed Level #${levelNumber} code.`);
          db.setUserLevel(message.author.id, levelNumber, (result) => {
            if (result) {
              success(`${message.author.username}'s level now set to ${levelNumber}.`);
            } else {
              error(`Something went wrong, and ${message.author.username} didn't save their level.`);
            }
          });
          guild?.roles.fetch(level.id)
            .then(newLevelRole => {
              newLevelRole && member.roles?.add(newLevelRole, `Unlocked level #${levelNumber} in Crypto Game.`)
                .then(() => {
                  success(`${message.author.username} added to ${newLevelRole.name}`);
                })
                .catch(error);

              embeddedSetupMessage
                .setColor(newLevelRole?.color || "gold")
                .setDescription(level.reply);

              message.author.send(embeddedSetupMessage);
            })
            .catch(error)
            .finally(() => {
              isInPreviousRole = false;
            });
        }
      });
    });
  }
});
