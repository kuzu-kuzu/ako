import { Client, type ClientOptions, Collection, Events } from 'discord.js';
import { Command } from '~/features/bot/models/Command';
import { logger } from '~/libs/logger';
import { getCommands } from '~/features/bot/utils/getCommands';

export type BotOptions = Readonly<ClientOptions & {
  token: string,
  commandsDirPath: string
}>;

export class Bot {
  readonly #token: string;
  readonly #commandsDirPath: string;
  readonly #client: Client;
  readonly #commands = new Collection<string, Command>();

  constructor({ token, commandsDirPath, ...clientOptions }: BotOptions) {
    this.#token = token;
    this.#commandsDirPath = commandsDirPath;
    this.#client = new Client(clientOptions);
  }

  async login(): Promise<void> {
    const client = this.#client;
    const commandsDirPath = this.#commandsDirPath;
    const commands = this.#commands;

    client.on(Events.ClientReady, async ({ user, application }) => {
      logger.info(`Successfully logged in as ${user.tag} (${user.id})`);

      for await (const command of getCommands(commandsDirPath)) {
        await application.commands.create(command.data);
        commands.set(command.data.name, command);

        logger.info(`Command "${command.data.name}" was successfully created`);
      }
    });

    client.on(Events.InteractionCreate, interaction => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      command.execute(interaction);
    });

    await client.login(this.#token);
  }
}
