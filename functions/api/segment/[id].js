export async function onRequestGet({env,params}){const db=env?.video||env?.DB||env?.SONGSAVE||env?.SongSave||env?.SONGSAVE_DB;
  if(!db)return Response.json({error:"SongSave D1 binding is not configured. Bind the SongSave database to the binding name video."},{status:503});
  const id=Number(params.id); if(!Number.isInteger(id))return Response.json({error:"Invalid id"},{status:400});
  const r=await db.prepare('SELECT rowid AS id,artist,session_id,song_name,song_video,segment_saved FROM "main"."table" WHERE rowid=?').bind(id).first();
  if(!r)return Response.json({error:"Song not found"},{status:404});
  return Response.json({id:r.id,title:r.song_name||"Untitled",artist:r.artist||"",source:"youtube",sourceUrl:r.song_video,segmentStart:Number(r.segment_saved)||0,sessionId:r.session_id||null});
}