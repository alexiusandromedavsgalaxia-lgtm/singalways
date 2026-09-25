export async function onRequestPost({request,env}){const db=env?.DB||env?.SONGSAVE||env?.SongSave||env?.SONGSAVE_DB;
  let body;
  try{body=await request.json()}catch{return Response.json({error:"Invalid JSON"},{status:400})}
  const url=String(body?.url||"").trim();
  if(!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url))return Response.json({error:"Only YouTube URLs are accepted"},{status:400});
  if(!db)return Response.json({error:"SongSave D1 binding is not configured. Bind the SongSave database to DB (or SONGSAVE/SONGSAVE_DB) in Cloudflare Pages."},{status:503});
  if(!env?.YTDLP_API_URL)return Response.json({error:"YouTube audio service not configured"},{status:503});
  const r=await fetch(env.YTDLP_API_URL,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({url})});
  if(!r.ok)return Response.json({error:"Downloader service failed"},{status:502});
  const d=await r.json().catch(()=>({}));
  if(!d.audio_url)return Response.json({error:"Downloader returned no audio URL"},{status:502});
  const duration=Math.max(1,Number(d.duration)||60);
  const length=Math.min(60,Math.max(30,duration));
  const maxStart=Math.max(0,duration-length);
  const start=maxStart?Math.random()*maxStart:0;
  const artist=String(d.artist||"");
  const title=String(d.title||"YouTube song");
  const result=await db.prepare('INSERT INTO "main"."table" (artist,session_id,song_name,song_video,segment_saved) VALUES (?,?,?,?,?)').bind(artist,null,title,url,start).run();
  return Response.json({ok:true,id:result.meta?.last_row_id??null,title,artist,duration,audio_url:d.audio_url,source:"youtube",sourceUrl:url,segment:{start,end:Math.min(duration,start+length)}});
}