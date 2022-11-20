import { PermissionFlagsBits, GuildManager } from 'discord.js';
import { logger } from '~/libs/logger';
import { createHash } from 'node:crypto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { timeToEmoji } from 'node-emoji-clock';

dayjs.extend(utc);
dayjs.extend(timezone);

export const guildNameClockRegex = /[🕛🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚]\d{1,2}時/u;

export const rotateGuildNameClock = async (guilds: GuildManager): Promise<void> => {
  const now = dayjs().tz('Asia/Tokyo').minute(0).second(0).millisecond(0);
  const emoji = timeToEmoji(now);

  for (const [, guild] of await guilds.fetch()) {
    const hashed = `sha256-${createHash('sha256').update(guild.id, 'utf8').digest('base64url')}`;

    logger.info(`Server (id ${hashed}) has started to process the guild clock`);

    if (!guild.permissions.has(PermissionFlagsBits.ManageGuild)) {
      logger.info(`Guild clock processing on server (id ${hashed}) has been suspended due to lack of permission`);

      continue;
    }

    if (!guildNameClockRegex.test(guild.name)) {
      logger.info(`Processing of guild clock on server (id ${hashed}) has been aborted because it is not covered`);

      continue;
    }

    const notOauth2 = await guilds.fetch(guild.id);

    await notOauth2.setName(notOauth2.name.replace(guildNameClockRegex, `${emoji}${now.hour()}時`));

    logger.info(`Successfully processed guild clock on server (id ${hashed})`);
  }
};
