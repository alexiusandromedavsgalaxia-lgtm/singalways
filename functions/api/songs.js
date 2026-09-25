export async function onRequestGet({env}){const db=env?.DB||env?.SONGSAVE||env?.SongSave||env?.SONGSAVE_DB;
  if(!db)return Response.json({error:"SongSave D1 binding is not configured. Bind the SongSave database to DB (or SONGSAVE/SONGSAVE_DB) in Cloudflare Pages."},{status:503});
  const r=await db.prepare('SELECT rowid AS id,artist,session_id,song_name,song_video,segment_saved FROM "main"."table" ORDER BY rowid DESC').all();
  const songs=(r.results||[]).map(s=>({id:s.id,title:s.song_name||"Untitled",artist:s.artist||"",source:"youtube",sourceUrl:s.song_video,duration:0,segmentStart:Number(s.segment_saved)||0,sessionId:s.session_id||null}));
  return Response.json({songs});
}