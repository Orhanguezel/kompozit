import mysql from 'mysql2/promise';
import { readFileSync, writeFileSync } from 'node:fs';
const patches=JSON.parse(readFileSync(new URL('./blog-refresh-2026-09-22.json',import.meta.url),'utf8'));
const apply=process.argv.includes('--apply');
const db=await mysql.createConnection({host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME});
try {
 await db.beginTransaction();
 const ids=[...new Set(patches.map(p=>p.page_id))];
 const [pages]=await db.query(`SELECT * FROM custom_pages WHERE id IN (${ids.map(()=>'?').join(',')}) FOR UPDATE`,ids);
 if(pages.length!==4 || pages.some(p=>p.module_key!=='kompozit_blog'))throw Error('Unexpected page scope');
 const [rows]=await db.query(`SELECT * FROM custom_pages_i18n WHERE page_id IN (${ids.map(()=>'?').join(',')}) AND locale IN ('tr','en') FOR UPDATE`,ids);
 if(rows.length!==8)throw Error('Expected eight existing translations');
 const [columns]=await db.query('SHOW COLUMNS FROM custom_pages_i18n');
 const html=v=>{if(typeof v==='object')return v.html;try{return JSON.parse(v).html??v}catch{return v}};
 const updates=[];
 for(const p of patches){
  const row=rows.find(r=>r.page_id===p.page_id && r.locale===p.locale);
  if(!row || row.slug!==p.slug)throw Error('Unexpected existing slug');
  if(html(row.content)===p.content && row.title===p.title)continue;
  if(row.title!==p.before_title || html(row.content)!==p.before_content)throw Error('Content changed since inspection: '+p.slug);
  updates.push({row,p});
 }
 if(apply && updates.length){
  const backup=`blog-refresh-backup-${Date.now()}.json`;
  writeFileSync(backup,JSON.stringify({pages,rows},null,2),{flag:'wx',mode:0o600});
  for(const {row,p} of updates){
   let nextContent=p.content;
   try {const original=typeof row.content==='object'?row.content:JSON.parse(row.content);if(original && typeof original==='object')nextContent=JSON.stringify({...original,html:p.content});}catch{}
   const timestamp=columns.some(c=>c.Field==='updated_at')?',updated_at=NOW()':'';
   await db.execute(`UPDATE custom_pages_i18n SET title=?,content=?,summary=?,meta_title=?,meta_description=?${timestamp} WHERE id=?`,[p.title,nextContent,p.summary,p.meta_title,p.meta_description,row.id]);
  }
  await db.query(`UPDATE custom_pages SET updated_at=NOW() WHERE id IN (${ids.map(()=>'?').join(',')})`,ids);
  await db.commit();console.log(JSON.stringify({updated:updates.map(x=>x.p.locale+'/'+x.p.slug),backup}));
 }else{await db.rollback();console.log(JSON.stringify({dryRun:!apply,changes:updates.map(x=>x.p.locale+'/'+x.p.slug),columns:columns.map(c=>c.Field)}));}
}catch(e){await db.rollback();throw e}finally{await db.end()}
