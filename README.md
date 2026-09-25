# SingAlways 🎤

Responsive React karaoke app for desktop, tablet and mobile.

## Features
- Import local audio files into the current browser.
- Save YouTube karaoke entries in the existing Cloudflare D1 database **SongSave**.
- Store the YouTube source in `song_video`, the song title/artist, and the saved segment start in `segment_saved`.
- YouTube songs play through the official YouTube embedded player; no yt-dlp service or `YTDLP_API_URL` is required.
- Karaoke rounds use a 30–60 second window. YouTube entries currently use the first 60 seconds because the app does not need a downloader to obtain the audio duration.
- Browser microphone capture stays local to the device.
- Responsive UI.

## SongSave D1

SingAlways expects the existing SongSave D1 binding to be exposed to the Pages/Workers Function as `video` (the code also accepts legacy binding names).

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

No R2 binding is required.

## Run

```bash
npm install
npm run dev
```

For deployment, use Cloudflare Pages with the Vite build output `dist` and the Functions directory in this repository.
