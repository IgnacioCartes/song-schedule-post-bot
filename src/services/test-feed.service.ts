import { FeedService } from '../contracts/feed.service';

export class TestFeedService implements FeedService {
  async post(message: string, coverUrl?: string): Promise<void> {
    console.log(message);
    console.log(coverUrl);
  }
}
