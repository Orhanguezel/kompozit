"""Verify rendered audit fixes, against a candidate or production origin."""
import concurrent.futures, json, re, sys, urllib.request
from html.parser import HTMLParser
from urllib.parse import urlsplit
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.title=''; self.in_title=False; self.main=0; self.links=[]; self.meta={}
 def handle_starttag(self, tag, attrs):
  a=dict(attrs)
  if tag=='title': self.in_title=True
  if tag=='main': self.main+=1
  if tag=='a' and self.main: self.links.append(a.get('href',''))
  if tag=='meta': self.meta[a.get('property',a.get('name',''))]=a.get('content','')
 def handle_endtag(self,tag):
  if tag=='title': self.in_title=False
  if tag=='main': self.main-=1
 def handle_data(self,data):
  if self.in_title:self.title+=data
base=sys.argv[1].rstrip('/')
paths=['/'+loc+path for loc in ['tr','en'] for path in ['', '/products','/references','/gallery','/blog','/about','/contact','/offer']]
def fetch(path):
 with urllib.request.urlopen(base+path,timeout=60) as r: return r.read(),r.headers.get('Content-Type','')
def verify(path):
 raw,_=fetch(path); p=Page();p.feed(raw.decode())
 assert 30<=len(p.title)<=60,(path,p.title,len(p.title))
 img=p.meta.get('og:image',''); assert '/share-image?' in img,(path,img)
 assert p.meta.get('og:image:width')=='1200' and p.meta.get('og:image:height')=='630',path
 assert p.meta.get('og:image:alt'),path
 if path in ['/tr','/en']:
  for target in ['products','references','gallery','blog']:assert path+'/'+target in p.links,(path,target)
  assert ('/en' if path=='/tr' else '/tr') in p.links,path
 return {'path':path,'title':p.title,'length':len(p.title),'og_image':img}
rows=list(concurrent.futures.ThreadPoolExecutor(4).map(verify,paths))
assert len({r['og_image'] for r in rows})==16
llms,_=fetch('/llms.txt');links=re.findall(r'\]\((https?://[^)]+)\)',llms.decode());assert len(links)>=16,len(links)
for row in [rows[0],rows[9]]:
 url=urlsplit(row['og_image']);png,kind=fetch(url.path+'?'+url.query);assert png.startswith(b'\x89PNG') and 'image/png' in kind,(row['path'],kind)
print(json.dumps({'origin':base,'pages':rows,'llms_links':len(links),'cards_checked':['tr','en'],'passed':True},ensure_ascii=False,indent=2))
