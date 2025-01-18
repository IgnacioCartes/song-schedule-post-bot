# Song Hourly Bot

NodeJS bot written in typescript that fetches a random song from Spotify and posts it to Bluesky.

## Instructions

To run locally, after cloning this repo and setting up the environment variables, install the dependencies:

```
npm i
```

Then transpile the Typescript code with:

```
npm run build
```

Finally, to run, use:

```
node build/index.js
```

For development purposes, you can use `npm run watch` instead to setup live reloading.

The environment variable `USE_CRON_JOB` will determine if this runs as a cron job, or will be a one-off execution (just get and post one song then quit).

## Demo

You can check the account that is posting hourly random metal songs on Bsky here:

https://bsky.app/profile/metal-song-hourly.bsky.social

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SPOTIFY_CLIENT_ID`

`SPOTIFY_CLIENT_SECRET`

`BSKY_SERVICE`

`BSKY_USERNAME`

`BSKY_PASSWORD`
