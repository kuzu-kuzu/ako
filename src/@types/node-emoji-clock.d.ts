declare module 'node-emoji-clock' {
  import { type Dayjs } from 'dayjs';

  const timeToEmoji: (time: Date | Dayjs) => string;
}
