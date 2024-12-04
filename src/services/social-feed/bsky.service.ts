import { Agent, CredentialSession, RichText } from '@atproto/api';
import type { SocialFeedService } from '../../contracts/social-feed.service';

export class BskyService implements SocialFeedService {
  constructor(private readonly config: BskyConfig) {}

  async post(message: string, coverUrl?: string): Promise<void> {
    const session = new CredentialSession(new URL(this.config.service));
    await session.login({
      identifier: this.config.username,
      password: this.config.password,
    });

    const agent = new Agent(session);
    const richText = new RichText({
      text: message,
    });
    await richText.detectFacets(agent);

    if (coverUrl) {
      const coverImage = await this.fetchCoverImage(coverUrl);

      const { data } = await agent.uploadBlob(coverImage);

      await agent.post({
        text: richText.text,
        facets: richText.facets,
        langs: ['en-US'],
        embed: {
          $type: 'app.bsky.embed.images',
          images: [
            {
              alt: 'Cover art',
              image: data.blob,
            },
          ],
        },
      });
    } else {
      await agent.post({
        text: richText.text,
        facets: richText.facets,
        langs: ['en-US'],
      });
    }

    console.log(message);
    console.log(coverUrl);

    await session.logout();
  }

  private async fetchCoverImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
  }
}

interface BskyConfig {
  service: string;
  username: string;
  password: string;
}
