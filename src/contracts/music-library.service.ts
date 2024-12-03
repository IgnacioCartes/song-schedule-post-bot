export interface MusicLibraryService {
  getRandomTrack(): Promise<TrackInfo>;
}

export interface TrackInfo {
  title: string;
  artist: string;
  year: string;
  link: string;
}
