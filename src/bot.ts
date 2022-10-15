import { Base } from '@sqrtox/deta';
import { ApplicationCommandOptionType, ChannelType, Client } from 'discord.js';
import { config as configDotenv } from 'dotenv';
import { assertEnv } from '~/util/assertEnv';

configDotenv();

const {
  DISCORD_BOT_TOKEN,
  DETA_PROJECT_KEY
} = assertEnv([
  'DISCORD_BOT_TOKEN',
  'DETA_PROJECT_KEY'
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
        required: false,
        type: ApplicationCommandOptionType.Channel
      }
    ]
  });
});

type GuildSettings = Readonly<{
  emojiChannelId: string
}>;

const settingsBase = new Base<string, GuildSettings>({
  name: 'settings',
  projectKey: DETA_PROJECT_KEY
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) {
    return;
  }

  await interaction.deferReply();

  if (!interaction.inGuild()) {
    await interaction.editReply('ギルド内で実行してください');

    return;
  }

  const channelOption = interaction.options.get('channel');
  const channel = channelOption?.channel;
  const resolvedChannel = channel ?? interaction.channel;

  if (!resolvedChannel) {
    await interaction.editReply('チャンネルが見つかりませんでした');

    return;
  }

  await settingsBase.put({
    emojiChannelId: resolvedChannel.id,
    key: interaction.guildId
  });

  await interaction.editReply(`絵文字チャンネルを**${resolvedChannel.name}**に設定しました`);
});

client.login(DISCORD_BOT_TOKEN);
