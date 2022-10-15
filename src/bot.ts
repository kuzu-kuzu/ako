import { ApplicationCommandOptionType, ChannelType, Client } from 'discord.js';
import { config as configDotenv } from 'dotenv';
import { assertEnv } from '~/util/assertEnv';

configDotenv();

const { DISCORD_BOT_TOKEN } = assertEnv([
  'DISCORD_BOT_TOKEN'
]);

const client = new Client({
  intents: 0
});

client.on('ready', async readiedClient => {
  await readiedClient.application.commands.create({
    description: 'Set the emoji channel.',
    descriptionLocalizations: {
      ja: '絵文字チャンネルを設定します。'
    },
    name: 'set_emoji_channel',
    options: [
      {
        channelTypes: [
          ChannelType.GuildText
        ],
        description: 'Emoji Channel.',
        descriptionLocalizations: {
          ja: '絵文字チャンネル'
        },
        name: 'channel',
        nameLocalizations: {
          ja: 'チャンネル'
        },
        required: false,
        type: ApplicationCommandOptionType.Channel
      }
    ]
  });
});

client.login(DISCORD_BOT_TOKEN);
