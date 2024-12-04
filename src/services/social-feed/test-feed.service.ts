import { SocialFeedService } from '../../contracts/social-feed.service';

export class TestFeedService implements SocialFeedService {
  async post(message: string, link: string, coverUrl?: string): Promise<void> {
    console.log(`${message}\n${link}`);
    console.log(coverUrl);
  }
}
