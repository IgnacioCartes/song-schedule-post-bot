import { CronJob } from 'cron';
import * as dotenv from 'dotenv';
import * as process from 'process';
import { MainController } from './main.controller';
import { TestFeedService } from './services/test-feed.service';
import { TestMusicService } from './services/test-music.service';

dotenv.config();

const controller = new MainController(
  new TestMusicService(),
  new TestFeedService()
);

const job = new CronJob(
  process.env.CRON_EXPRESSION,
  () => controller.execute(),
  null,
  true
);
job.start();

process.on('SIGINT', () => {
  job.stop();
  process.exit(0);
});
