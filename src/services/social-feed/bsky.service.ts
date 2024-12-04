import { AtpAgent, RichText } from '@atproto/api';
import { SocialFeedService } from '../../contracts/social-feed.service';

export class BskyService implements SocialFeedService {
  agent: AtpAgent;

  constructor(private readonly config: BskyConfig) {
    this.agent = new AtpAgent({
      service: config.service,
    });
  }

  async post(message: string, coverUrl?: string): Promise<void> {
    await this.agent.login({
      identifier: this.config.username,
      password: this.config.password,
    });

    const richText = new RichText({
      text: message,
    });

    await richText.detectFacets(this.agent);
    await this.agent.post({
      text: richText.text,
      facets: richText.facets,
    });

    console.log(message);
    console.log(coverUrl);
  }
}

interface BskyConfig {
  service: string;
  username: string;
  password: string;
}
