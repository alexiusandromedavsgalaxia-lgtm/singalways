# SingAlways 🎤

Responsive React karaoke app for desktop, tablet and mobile.

## Features
- Import local audio files into R2.
- Store song metadata in Cloudflare D1.
- Random karaoke rounds of 30–60 seconds.
- Browser microphone capture stays local to the device.
- YouTube URL import through a configurable downloader service.
- Responsive UI.

## Cloudflare setup

Create these bindings in the Pages/Workers project:
- D1 binding: `DB`
- R2 binding: `AUDIO`
- Secret: `YTDLP_API_URL` pointing to a downloader service you control and are authorized to use.

Apply `schema.sql` to D1 before importing songs.

The YouTube endpoint uses an external downloader adapter because a normal Cloudflare Pages Function cannot run `yt-dlp` itself. The adapter must accept POST JSON `{"url":"..."}` and return JSON containing `audio_url`, optional `title`, `duration`, and `content_type`.

## Run

```bash
npm install
npm run dev
```

For deployment, use Cloudflare Pages with the Vite build output `dist` and the Functions directory in this repository.
