export async function onRequestPost({request,env}){const db=env?.video||env?.DB||env?.SONGSAVE||env?.SongSave||env?.SONGSAVE_DB;
  let body;
  try{body=await request.json()}catch{return Response.json({error:"Invalid JSON"},{status:400})}
  const url=String(body?.url||"").trim();
  if(!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url))return Response.json({error:"Only YouTube URLs are accepted"},{status:400});
  if(!db)return Response.json({error:"SongSave D1 binding is not configured. Bind the SongSave database to the binding name video."},{status:503});
  let title="YouTube song",artist="";
  try{const o=await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);if(o.ok){const d=await o.json();title=String(d.title||title);artist=String(d.author_name||"");}}catch{}
  const start=0;
  const result=await db.prepare('INSERT INTO "main"."table" (artist,session_id,song_name,song_video,segment_saved) VALUES (?,?,?,?,?)').bind(artist,null,title,url,start).run();
  return Response.json({ok:true,id:result.meta?.last_row_id??null,title,artist,duration:60,source:"youtube",sourceUrl:url,segment:{start,end:60}});
}