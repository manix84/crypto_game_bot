import Discord from "discord.js";
import { success, info, br } from "../utils/log";

const bot = new Discord.Client();
const SECRET_CODE = process.env.SECRET_CODE || "test";
const SECRET_REPLY = process.env.SECRET_REPLY || "https://www.youtube.com/watch?v=6-HUgzYPm9g";

bot.on("ready", () => {
  info(`Logged in as ${bot.user?.tag}!`);
  br();
});

bot.on("message", (message: Discord.Message) => {
  if (message.content.endsWith("!crypto ping!")) {
    info(message.content);
    message.channel.send("pong!");
  }

  if (message.content === SECRET_CODE) {
    message.delete();
    success(`${message.author.username} successfully guessed the combination.`);
    const embeddedSetupMessage = new Discord.MessageEmbed()
      .setColor("#FFD700")
      .setTitle("Cryptic Clue")
      .setDescription(SECRET_REPLY)
      .setThumbnail(`https://${process.env.HOST}/images/logo.png`)
      .setTimestamp()
      .setFooter("Crypto Bot", `https://${process.env.HOST}/images/logo_bordered.png`);

    message.author.send(embeddedSetupMessage);
    // message.channel.send("Check your private messages for setup instructions.");
  }
});

export const init = (): void => {
  bot.login(process.env.DISCORD_TOKEN);
};
