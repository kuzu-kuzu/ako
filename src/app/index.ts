import { Bot } from '~/features/bot/models/Bot';
import { logger } from '~/libs/logger';
import { join as joinPath } from 'node:path';
import { createServer } from 'node:http';
import { config as configDotenv } from 'dotenv';

configDotenv();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  logger.fatal('Environment variable DISCORD_BOT_TOKEN is missing');
  process.exit(1);
}

const bot = new Bot({
  token: DISCORD_BOT_TOKEN,
  intents: 0,
  commandsDirPath: joinPath(__dirname, '../commands/')
});

bot.login();

const server = createServer((_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('ok');
});

server.listen(3000);
