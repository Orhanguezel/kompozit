import mysql from 'mysql2/promise';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const patches = JSON.parse(readFileSync(new URL('./seo-titles-2026-09-22.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const db = await mysql.createConnection({host:process.env.DB_HOST || '127.0.0.1',port:Number(process.env.DB_PORT || 3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME});
try {
 await db.beginTransaction();
 const [rows] = await db.execute("SELECT id, locale, value FROM site_settings WHERE `key`='kompozit__seo_pages' AND locale IN ('tr','en') FOR UPDATE");
 if(rows.length !== 2) throw new Error('Expected exactly two Kompozit SEO settings');
 const originalRows=JSON.stringify(rows,null,2);
 const changes=[];
 for(const row of rows){
  const data=typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  for(const patch of patches.filter(p=>p.locale===row.locale)){
   if(data[patch.page]?.title===patch.after) continue;
   if(data[patch.page]?.title!==patch.before) throw new Error(`SEO title changed since review: ${row.locale}/${patch.page}`);
   data[patch.page].title=patch.after;
   changes.push(`${row.locale}/${patch.page}`);
  }
  row.nextValue=JSON.stringify(data);
 }
 if(apply && changes.length){
  const backup=resolve(`seo-titles-backup-${Date.now()}.json`);
  writeFileSync(backup,originalRows,{flag:'wx',mode:0o600});
  for(const row of rows) await db.execute('UPDATE site_settings SET value=?, updated_at=NOW() WHERE id=?',[row.nextValue,row.id]);
  await db.commit();
  console.log(JSON.stringify({applied:changes,backup}));
 } else {await db.rollback(); console.log(JSON.stringify({dryRun:!apply,changes}));}
} catch(error){await db.rollback(); throw error;} finally {await db.end();}
