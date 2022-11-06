import { Command } from '~/features/bot/models/Command';
import { composeAvatarFrame } from '~/features/compose-frame/utils/composeAvatarFrame';
import { randomUUID } from 'node:crypto';
import { logger } from '~/libs/logger';
import Queue from 'queue';

export const queue = new Queue({
  concurrency: 1,
  timeout: 1000,
  autostart: true
});

export default new Command({
  data: builder => (
    builder
      .setName('frame')
      .setDescription('This command is used to add frames to icons and other objects.')
      .setDescriptionLocalization('ja', 'アイコンなどにフレームを追加するコマンドです。')
      .addSubcommand(option => (
        option
          .setName('avatar')
          .setDescription('Add a frame to the avatar.')
          .setDescriptionLocalization('ja', 'アバターにフレームを追加します。')
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
      ))
  ),
  execute: async interaction => {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const accentColors = interaction.options.getString('accent-colors') ?? '#fff';
    const bgColors = interaction.options.getString('bg-colors') ?? '#000 #c80000';
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
        const image = await composeAvatarFrame(avatarUrl, accentColors?.split(/\s+/), bgColors?.split(/\s+/));
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
            await interaction.editReply('無効な色が含まれています');
          } else {
            await interaction.editReply('Contains invalid colors');
          }
        }
      }
    });
  }
});
