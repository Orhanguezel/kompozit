import sys,urllib.request,json,xml.etree.ElementTree as ET,concurrent.futures,io
from bs4 import BeautifulSoup
from PIL import Image
from pathlib import Path
base='https://www.karbonkompozit.com.tr'
target=sys.argv[1].rstrip('/') if len(sys.argv)>1 else base
output=Path(sys.argv[2]) if len(sys.argv)>2 else Path('og-audit.json')
def get(url):
 if url.startswith(base) and (not '/media/' in url and not '/uploads/' in url):url=target+url[len(base):]
 for attempt in range(3):
  try:
   r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Twitterbot/1.0'}),timeout=30);return r.read(),r.headers.get('Content-Type',''),r.geturl()
  except Exception:
   if attempt==2:raise
urls=[e.text for e in ET.fromstring(get(base+'/sitemap.xml')[0]).findall('.//{*}url/{*}loc')]
def page(url):
 try:
  raw,_,final=get(url);s=BeautifulSoup(raw,'html.parser');m={x.get('property',x.get('name','')):x.get('content','') for x in s.select('meta')}; c=s.select_one('link[rel=canonical]')
  return {'url':url,'final':final,'canonical':c.get('href') if c else None,'title':s.title.get_text() if s.title else None, 'meta':{k:v for k,v in m.items() if k.startswith(('og:','twitter:'))},'h1':[h.get_text(' ',strip=True) for h in s.select('h1')]}
 except Exception as e:return {'url':url,'error':str(e)}
pages=list(concurrent.futures.ThreadPoolExecutor(3).map(page,urls))
images=set(v for p in pages for k,v in p.get('meta',{}).items() if k in ['og:image','twitter:image'])
def img(url):
 try:
  raw,kind,final=get(url);im=Image.open(io.BytesIO(raw));return {'url':url,'final':final,'type':kind,'width':im.width,'height':im.height,'bytes':len(raw)}
 except Exception as e:return {'url':url,'error':str(e)}
assets=list(concurrent.futures.ThreadPoolExecutor(3).map(img,images))
failures=[]
by_url={i['url']:i for i in assets}
for p in pages:
 if p.get('error'):failures.append(p);continue
 m=p['meta']
 for key in ['og:title','og:description','og:image','og:image:width','og:image:height','og:image:alt','twitter:image','twitter:image:alt']:
  if not m.get(key):failures.append({'url':p['url'],'missing':key})
 if p['canonical']!=p['url']:failures.append({'url':p['url'],'canonical':p['canonical']})
 asset=by_url.get(m.get('og:image'),{})
 if asset.get('error'):failures.append(asset)
 elif str(asset.get('width'))!=m.get('og:image:width') or str(asset.get('height'))!=m.get('og:image:height'):failures.append({'url':p['url'],'dimensions':'mismatch'})
 if m.get('og:image')!=m.get('twitter:image'):failures.append({'url':p['url'],'images':'mismatch'})
result={'target':target,'pages':pages,'images':assets,'failures':failures,'passed':not failures}
output.write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps({'pages':len(pages),'images':len(assets),'failures':failures,'passed':not failures},ensure_ascii=False))
sys.exit(bool(failures))
