import {readFileSync} from 'node:fs';
const patches=JSON.parse(readFileSync(new URL('./blog-refresh-2026-09-22.json',import.meta.url),'utf8'));
if(!process.env.TANITIO_CONTENT_API_KEY)throw Error('Missing content API configuration');
for(const locale of ['tr','en']){
 const res=await fetch(`https://www.karbonkompozit.com.tr/api/integrations/tanitio/articles?locale=${locale}`,{headers:{Authorization:`Bearer ${process.env.TANITIO_CONTENT_API_KEY}`}});
 if(!res.ok)throw Error('Content API status '+res.status);
 const data=await res.json();
 for(const p of patches.filter(x=>x.locale===locale)){
  const item=data.items.find(i=>i.id===p.page_id);
  if(!item || item.title!==p.title || item.contentHtml!==p.content || item.excerpt!==p.summary)throw Error('Stale Tanitio source: '+p.slug);
 }
 console.log(JSON.stringify({locale,passed:true,articles:data.items.length}));
}
