import {
  MusicLibraryService,
  TrackInfo,
} from '../contracts/music-library.service';

interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
}

interface SpotifyToken {
  accessToken: string;
  tokenType: string;
  expiresAt: Date;
}

export class SpotifyService implements MusicLibraryService {
  private token: SpotifyToken | null = {
    accessToken:
      'BQCOf5SlHs6JcDX-KmQcPaSV2FNyIAxZNvo_yy2l8zHksK8ENFYNoj8vGINvPj1ccbT6fscuRIjphqItjwRddO-Kpn9R5GVKloIZRf8WNwfcDCq53WM',
    tokenType: 'Bearer',
    expiresAt: new Date('2024-12-04T17:29:46.642Z'),
  };

  constructor(private readonly config: SpotifyConfig) {}

  async getRandomTrack(): Promise<TrackInfo> {
    await this.refreshAccessToken();

    const randomOffset = Math.floor(Math.random() * 1000);

    const response = await fetch(
      'https://api.spotify.com/v1/search?q=genre:metal&type=track&limit=50&offset=' +
        randomOffset,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `${this.token?.tokenType} ${this.token?.accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.tracks.items.length === 0) {
      throw new Error('No tracks found');
    }

    const randomIndex = Math.floor(Math.random() * data.tracks.items.length);
    const track = data.tracks.items[randomIndex] as SpotifyTrack;

    console.log(track);

    return {
      title: track.name,
      artist: track.artists[0].name,
      year: track.album.release_date.split('-')[0],
      link: track.external_urls.spotify,
      coverUrl: track.album.images[0].url,
    };
  }

  private async refreshAccessToken(): Promise<SpotifyToken> {
    if (!this.token || this.token.expiresAt < new Date()) {
      this.token = await this.requestAccessToken();
      console.log('NEW TOKEN REQUESTED:');
      console.log(this.token);
    }

    return this.token;
  }

  private async requestAccessToken(): Promise<SpotifyToken> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(
            this.config.clientId + ':' + this.config.clientSecret
          ).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }
}

interface SpotifyTrack {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  album: {
    id: string;
    name: string;
    release_date: string;
    images: {
      url: string;
    }[];
  };
  artists: {
    id: string;
    name: string;
  }[];
}
