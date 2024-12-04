import type { MusicLibraryService } from './contracts/music-library.service';
import type { SocialFeedService } from './contracts/social-feed.service';

export class MainController {
  constructor(
    private readonly musicLibraryService: MusicLibraryService,
    private readonly socialFeedService: SocialFeedService
  ) {}

  async execute(): Promise<void> {
    const song = await this.musicLibraryService.getRandomTrack();

    await this.socialFeedService.post(
      `🎵 ${song.title} by ${song.artist} (${song.year})\n${song.link}`,
      song.coverUrl
    );
  }
}
