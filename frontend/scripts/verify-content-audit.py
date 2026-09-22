"""Rendered content/media checks. Requires beautifulsoup4 (audit tooling only)."""
from bs4 import BeautifulSoup
import urllib.request,json,concurrent.futures,sys
base=sys.argv[1].rstrip('/')
def check(path):
 raw=urllib.request.urlopen(base+path,timeout=45).read();s=BeautifulSoup(raw,'html.parser');g=s.select_one('[data-page-guide]');imgs=s.select('img')
 assert g,(path,'guide missing')
 missing=[i.get('src','') for i in imgs if not(i.get('width') and i.get('height'))]
 assert not missing,(path,missing)
 for a in g.select('[data-guide-answer]'):assert len(a.p.get_text().split())>=40,(path,'short answer')
 faqs=[]
 for script in s.select('script[type="application/ld+json"]'):
  d=json.loads(script.string or script.get_text());nodes=d.get('@graph',[d]);faqs += [n for n in nodes if n.get('@type')=='FAQPage']
 assert len(faqs)==1,(path,'duplicate or missing FAQ graph')
 if not path.endswith(('/contact','/offer')):
  visible=[(a.h3.get_text(),a.p.get_text()) for a in g.select('[data-guide-answer]')]
  schema=[(a['name'],a['acceptedAnswer']['text']) for a in faqs[0]['mainEntity']]
  assert visible==schema,(path,'FAQ schema differs from content')
 if path.endswith('/references'):assert 'Endustriyel Cozum Ortagi' not in s.get_text()
 return {'path':path,'guide_words':len(g.get_text(' ',strip=True).split()),'images':len(imgs),'missing_dimensions':missing,'faq_graphs':len(faqs)}
paths=['/'+l+p for l in ['tr','en'] for p in ['', '/products','/solutions','/references','/gallery','/blog','/about','/contact','/offer']]
r=list(concurrent.futures.ThreadPoolExecutor(4).map(check,paths));print(json.dumps({'origin':base,'passed':True,'pages':r},ensure_ascii=False,indent=2))
