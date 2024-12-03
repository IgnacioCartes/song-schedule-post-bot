import type {
  MusicLibraryService,
  TrackInfo,
} from '../contracts/music-library.service';

export class TestMusicService implements MusicLibraryService {
  async getRandomTrack(): Promise<TrackInfo> {
    return {
      title: 'Test Song',
      artist: 'Test Artist',
      year: '2023',
      link: 'https://example.com/test-song',
    };
  }
}
