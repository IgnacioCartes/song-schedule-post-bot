import { FeedService } from '../contracts/feed.service';

export class TestFeedService implements FeedService {
  async post(message: string): Promise<void> {
    console.log(message);
  }
}
