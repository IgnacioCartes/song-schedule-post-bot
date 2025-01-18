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
      'BQCjXBczOsLtL-n6V6C9qzAnqayZZRRGzccIHLXs175frMq0TI6RIbcbaPOKwmmGGuPf1gUOfYW9KxR2CdCKfMmOkxmxAvweHdjVGVVtMrcJPFh6Hf4',
    tokenType: 'Bearer',
    expiresAt: new Date('2024-12-04T19:37:48.355Z'),
  };

  constructor(private readonly config: SpotifyConfig) {}

  async getRandomTrack(): Promise<TrackInfo> {
    await this.refreshAccessToken();

    if (!this.token) {
      throw new Error('No token found');
    }

    const offset = Math.floor(Math.random() * 1000);
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const char = String.fromCharCode(Math.floor(Math.random() * 26) + 97);

    const query = {
      q: `genre:"${genre}" ${char}`,
      type: 'track',
      limit: 1,
      offset,
    };

    const url =
      `https://api.spotify.com/v1/search?` + querystring.stringify(query);

    console.log(`GET ${url}`);

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${this.token.tokenType} ${this.token.accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.tracks) {
      console.error({ query, data });
      throw new Error('No tracks found');
    }

    const allowedTracks = data.tracks.items.filter(
      (track: any) => track.explicit === false
    ) as SpotifyTrack[];

    if (allowedTracks.length === 0) {
      console.error({ query, data });
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
