import { Command } from '~/features/bot/models/Command';
import { readdir } from 'node:fs/promises';
import { parse as parsePath, join as joinPath } from 'node:path';
import { logger } from '~/libs/logger';

export const getCommands = async function* (commandsDirPath: string): AsyncIterableIterator<Command> {
  const commandFiles: readonly string[] = await readdir(commandsDirPath);

  for (const file of commandFiles) {
    const { ext, dir } = parsePath(file);

    if (ext !== '.js' || dir !== '') {
      logger.warn(`"${file}" was ignored because it was not a .js file`);

      continue;
    }

    const filePath = joinPath(commandsDirPath, file);
    const { default: command } = await import(filePath);

    if (!(command instanceof Command)) {
      logger.warn(`"${file}" was ignored because the default export was not a command`);

      continue;
    }

    yield command;
  }
};
