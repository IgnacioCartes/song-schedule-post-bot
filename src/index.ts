import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import { MainController } from './main.controller';
import { SpotifyService } from './services/music-library/spotify.service';
import { BskyService } from './services/social-feed/bsky.service';

dotenv.config();

const controller = new MainController(
  new SpotifyService({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  }),
  new BskyService({
    service: process.env.BSKY_SERVICE!,
    username: process.env.BSKY_USERNAME!,
    password: process.env.BSKY_PASSWORD!,
  })
);

if (process.env.IS_CRON === 'true') {
  const job = new CronJob('0 * * * *', () => controller.execute(), null, true);
  job.start();

  process.on('SIGINT', () => {
    job.stop();
    process.exit(0);
  });
} else {
  controller.execute();
}
