import json,urllib.request,concurrent.futures
from pathlib import Path
from bs4 import BeautifulSoup
out=Path(__file__).parent; patches=json.loads((out/'patches.json').read_text());base='https://www.karbonkompozit.com.tr'
def check(p):
 url=base+'/'+p['locale']+'/blog/'+p['slug']
 post=json.load(urllib.request.urlopen(base+'/api/custom-pages/by-slug/'+p['slug']+'?locale='+p['locale']))
 assert post['title']==p['title'] and post['content']==p['content'],p['slug']+' API mismatch'
 s=BeautifulSoup(urllib.request.urlopen(url).read(),'html.parser')
 assert s.h1.get_text(' ',strip=True)==p['title'],p['slug']+' stale HTML'
 assert s.select_one('link[rel=canonical]')['href']==url
 assert len(s.select('link[hreflang]'))==2
 assert s.select_one('meta[name=description]')['content']==p['meta_description']
 assert BeautifulSoup(p['content'],'html.parser').h2.get_text() in s.get_text()
 assert s.select_one('meta[property="og:image"]')
 old=json.loads((out/('before-'+p['locale']+'.json')).read_text());before=next(x for x in old if x['id']==p['page_id'])
 assert post['created_at']==before['created_at']
 return {'url':url,'title':p['title'],'updated_at':post['updated_at'],'passed':True}
results=list(concurrent.futures.ThreadPoolExecutor(2).map(check,patches))
(out/'live-verification.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print('PASS:',len(results),'localized articles, HTML + API + canonical + hreflang + metadata + dates')
