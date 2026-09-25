# SingAlways 🎤

Responsive React karaoke app for desktop, tablet and mobile.

## Features
- Import local audio files into the current browser.
- Save YouTube karaoke entries in the existing Cloudflare D1 database **SongSave**.
- Store the YouTube source in `song_video`, the song title/artist, and the assigned segment start in `segment_saved`.
- Random karaoke rounds of 30–60 seconds.
- Resolve the saved YouTube audio through the configured downloader when a saved song is played.
- Browser microphone capture stays local to the device.
- Responsive UI.

## SongSave D1

SingAlways expects the existing SongSave D1 binding to be exposed to the Pages/Workers Function as `DB`.

The current SongSave table used by the app is:

```sql
CREATE TABLE "main"."table" (
  "artist" TEXT,
  "session_id" BLOB,
  "song_name" TEXT,
  "song_video" INTEGER,
  "segment_saved" REAL
);
```

No R2 binding is required for YouTube entries.

## YouTube audio service

Set `YTDLP_API_URL` to a downloader service you control and are authorized to use. It must accept:

```json
{"url":"https://www.youtube.com/..."}
```

and return JSON containing `audio_url`, with optional `title`, `artist`, and `duration`.

The audio itself is not stored as a binary blob in SongSave; SongSave stores the song metadata, source URL and saved segment position.

## Run

```bash
npm install
npm run dev
```

For deployment, use Cloudflare Pages with the Vite build output `dist` and the Functions directory in this repository.
