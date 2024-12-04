import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import { MainController } from './main.controller';
import { SpotifyService } from './services/music-library/spotify.service';
import { TestFeedService } from './services/test-feed.service';

dotenv.config();

const controller = new MainController(
  new SpotifyService({
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  }),
  new TestFeedService()
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
