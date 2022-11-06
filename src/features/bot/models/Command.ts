import {
  type ChatInputCommandInteraction,
  type SlashCommandSubcommandsOnlyBuilder,
  SlashCommandBuilder
} from 'discord.js';

export type CommandDataBuilder = (builder: SlashCommandBuilder) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
export type CommandExecute = (interaction: ChatInputCommandInteraction) => void;
export type CommandOptions = Readonly<{
  data: CommandDataBuilder | SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder,
  execute: CommandExecute
}>;

export class Command {
  readonly data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  readonly execute: CommandExecute;

  constructor({ data, execute }: CommandOptions) {
    this.data = typeof data === 'function' ? data(new SlashCommandBuilder()) : data;
    this.execute = execute;
  }
}
