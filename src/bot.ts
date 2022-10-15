import { Client } from 'discord.js';
import { config as configDotenv } from 'dotenv';
import { assertEnv } from '~/util/assertEnv';

configDotenv();

const { DISCORD_BOT_TOKEN } = assertEnv([
  'DISCORD_BOT_TOKEN'
]);

const client = new Client({
  intents: 0
});

client.login(DISCORD_BOT_TOKEN);
