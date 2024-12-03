import type { FeedService } from './contracts/feed.service';
import type { MusicLibraryService } from './contracts/music-library.service';

export class MainController {
  constructor(
    private readonly musicLibraryService: MusicLibraryService,
    private readonly feedService: FeedService
  ) {}

  async execute(): Promise<void> {
    const song = await this.musicLibraryService.getRandomTrack();

    await this.feedService.post(
      `🎵 ${song.title} by ${song.artist} (${song.year})\n${song.link}`
    );
  }
}
