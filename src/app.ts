import DiscordOauth2 from "discord-oauth2";
import { nanoid } from "nanoid";
import express from "express";
import cors from "cors";
import dotenv from "dotenv-flow";
import { init as initDiscord } from "./middleware/Discord";

dotenv.config({
  silent: true
});

require("./utils/debug");

initDiscord();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",  (_request, response) => {
  response
    .status(203)
    .send();
});

app.get("/callback", (_request, response) => {
  response
    .status(200)
    .send("Success!");
});

app.get("/invite", (_request, response) => {
  const oauth = new DiscordOauth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: `https://${process.env.HOST}/callback`
  });

  const url: string = oauth.generateAuthUrl({
    scope: ["identify", "guilds", "bot"],
    state: nanoid(),
    permissions: 223232
  });

  response
    .status(200)
    .send(`
<!DOCTYPE html>
<html>
  <body>
    <a href="${url}">Invite Bot</a>
    <pre>${url.replace(/([&?])([a-z0-9-_.~!*'();:@+$,/?#[\]]+)=/gi, "\n$1 <strong>$2</strong> = ")}</pre>
  </body>
</html>
  `);
});

export default app;
