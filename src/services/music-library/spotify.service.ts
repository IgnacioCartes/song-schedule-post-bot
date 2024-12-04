import querystring from 'node:querystring';
import {
  MusicLibraryService,
  TrackInfo,
} from '../../contracts/music-library.service';

interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
}

interface SpotifyToken {
  accessToken: string;
  tokenType: string;
  expiresAt: Date;
}

const genres = [
  'Black Metal',
  'Death Metal',
  'Doom Metal',
  'Folk Metal',
  'Gothic Metal',
  'Groove Metal',
  'Industrial Metal',
  'Jazz Metal',
  'Melodic Death Metal',
  'Neo Classical Metal',
  'Power Metal',
  'Progressive Metal',
  'Speed Metal',
  'Stoner Metal',
  'Symphonic Metal',
  'Thrash Metal',
];

export class SpotifyService implements MusicLibraryService {
  private token: SpotifyToken | null = {
    accessToken:
      'BQAQmYkO6mKcjs1hOak6DOPPyPWLUvH5SezHHryOLN5MapLUdYYQdXUvXop6bEsUVrNtdzLlYJBGX3OzNJ6_lDbHwMVGmD1pDcAYKiOVIFCE2kVZlO4',
    tokenType: 'Bearer',
    expiresAt: new Date('2024-12-04T18:33:26.510Z'),
  };

  constructor(private readonly config: SpotifyConfig) {}

  async getRandomTrack(): Promise<TrackInfo> {
    await this.refreshAccessToken();

    if (!this.token) {
      throw new Error('No token found');
    }

    // TODO: consider randomizing from a list of genres to get a finer selection
    const randomOffset = Math.floor(Math.random() * 1000);
    const genre = genres[Math.floor(Math.random() * genres.length)];

    const query = {
      q: `genre:"${genre}"`,
      type: 'track',
      limit: 50,
      offset: randomOffset,
    };

    const response = await fetch(
      `https://api.spotify.com/v1/search?` + querystring.stringify(query),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!data.tracks) {
      console.log({ query, data });
      throw new Error('No tracks found');
    }

    const allowedTracks = data.tracks.items.filter(
      (track: any) => track.explicit === false
    ) as SpotifyTrack[];

    if (allowedTracks.length === 0) {
      console.log({ query, data });
      throw new Error('No allowed tracks found');
    }

    const randomIndex = Math.floor(Math.random() * allowedTracks.length);
    const track = allowedTracks[randomIndex];

    return {
      title: track.name,
      artist: track.artists[0].name,
      year: track.album.release_date.split('-')[0],
      genre,
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
  explicit: boolean;
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
