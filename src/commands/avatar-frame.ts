import { Command } from '~/features/bot/models/Command';
import { composeClassicFrame } from '~/features/compose-frame/utils/composeClassicFrame';
import { randomUUID } from 'node:crypto';
import { logger } from '~/libs/logger';
import Queue from 'queue';
import { composeCompactFrame } from '~/features/compose-frame/utils/composeCompactFrame';
import { type SlashCommandSubcommandBuilder } from 'discord.js';

export const queue = new Queue({
  concurrency: 1,
  timeout: 2000,
  autostart: true
});

export const addOptions = (option: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder => (
  option
    .addUserOption(option => (
      option
        .setName('user')
        .setDescription('The user whose avatar is used for frame composition. If omitted, the executor is specified.')
        .setDescriptionLocalization('ja', 'フレーム合成に使用するアバターのユーザー。省略した場合は、実行者が指定されます。')
    ))
    .addStringOption(option => (
      option
        .setName('accent-colors')
        .setDescription('Frame color. Gradient if multiple specifiers are specified with whitespace separator.')
        .setDescriptionLocalization('ja', 'フレームの色。空白区切りで複数指定するとグラデーション。')
    ))
    .addStringOption(option => (
      option
        .setName('bg-colors')
        .setDescription('Background color of the frame. Multiple specifications, separated by whitespace, create a gradient.')
        .setDescriptionLocalization('ja', 'フレームの背景色。空白区切りで複数指定するとグラデーション。')
    ))
    .addBooleanOption(option => (
      option
        .setName('bg-only')
        .setDescription('If this flag is on, only the background color is composited. Off by default.')
        .setDescriptionLocalization('ja', 'このフラグがオンの場合、背景色のみ合成します。デフォルトでオフ。')
    ))
);

export default new Command({
  data: builder => (
    builder
      .setName('avatar-frame')
      .setDescription('This command is used to add frames to icons and other objects.')
      .setDescriptionLocalization('ja', 'アバターなどにフレームを追加するコマンドです。')
      .addSubcommand(option => addOptions(
        option
          .setName('classic')
          .setDescription('Add the classic type of frame to the avatar.')
          .setDescriptionLocalization('ja', '従来のタイプのフレームをアバターに追加します。')
      ))
      .addSubcommand(option => addOptions(
        option
          .setName('compact')
          .setDescription('Add a compact type frame to the avatar.')
          .setDescriptionLocalization('ja', 'コンパクトタイプのフレームをアバターに追加します。')
      ))
  ),
  execute: async interaction => {
    if (!interaction.inGuild()) {
      if (interaction.locale === 'ja') {
        interaction.editReply('このコマンドはギルド内で実行する必要があります');
      } else {
        interaction.editReply('This command must be executed within the guild');
      }

      return;
    }

    const type = interaction.options.getSubcommand() ?? 'compact';
    const user = interaction.options.getUser('user') ?? interaction.user;
    const accentColors = interaction.options.getString('accent-colors') ?? '#fff';
    const bgColors = interaction.options.getString('bg-colors') ?? '#000 #c80000';
    const bgOnly = interaction.options.getBoolean('bg-only') ?? false;
    const avatarUrl = user.displayAvatarURL({
      extension: 'png',
      size: 256
    });

    await interaction.deferReply();

    let timedOut = false;
    const handleTimeout = () => {
      timedOut = true;

      if (interaction.locale === 'ja') {
        interaction.editReply('実行がタイムアウトしました。再度お試しください');
      } else {
        interaction.editReply('Execution timed out. Please try again.');
      }
    };
    const off = () => queue.off('timeout', handleTimeout);

    queue.once('timeout', handleTimeout);

    queue.push(async () => {
      try {
        const composeFrame = type === 'compact' ? composeCompactFrame : composeClassicFrame;
        const image = await composeFrame(avatarUrl, {
          accentColors: accentColors?.split(/\s+/),
          backgroundColors: bgColors?.split(/\s+/),
          backgroundOnly: bgOnly
        });
        const name = randomUUID({ disableEntropyCache: true });

        off();

        if (timedOut) {
          return;
        }

        await interaction.editReply({
          files: [
            {
              attachment: image,
              contentType: 'image/png',
              name: `${name}.png`
            }
          ]
        });
      } catch (err) {
        off();

        if (!(err instanceof Error)) {
          logger.error('Unknown error');

          return;
        }

        if (!err.message.endsWith('could not be parsed as a color.')) {
          logger.error(err.message);

          if (!timedOut) {
            if (interaction.locale === 'ja') {
              interaction.editReply('不明なエラー');
            } else {
              interaction.editReply('Unknown error');
            }
          }

          return;
        }

        if (!timedOut) {
          if (interaction.locale === 'ja') {
            await interaction.editReply('無効な色が含まれています。16進数の場合は色の名前と区別するために#をつけてください');
          } else {
            await interaction.editReply('Contains invalid colors; if hexadecimal, add # to distinguish it from the color name');
          }
        }
      }
    });
  }
});
