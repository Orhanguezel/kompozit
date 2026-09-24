import urllib.request,urllib.parse,json,io,sys
from bs4 import BeautifulSoup
from PIL import Image
base=sys.argv[1]
report=[]
for path in ['/tr','/en','/tr/products/lunapark-oyuncaklari-kabini','/en/products/lunapark-oyuncaklari-kabini']:
 r=urllib.request.urlopen(base+path); s=BeautifulSoup(r.read(),'html.parser')
 icons=[x['href'] for x in s.select('link[rel*=icon]')]
 assert icons and all('neutral' not in x for x in icons),icons
 sizes=[]
 for icon in icons:
  url=urllib.parse.urljoin(base,icon)
  data=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Googlebot-Image/1.0'})).read()
  im=Image.open(io.BytesIO(data)); assert im.width==im.height and im.width>=48; sizes.append(im.size)
 robots=s.select_one('meta[name=robots]')['content']; assert 'max-image-preview:large' in robots.replace(' ',''),robots
 logos=[]
 def walk(x):
  if isinstance(x,dict):
   if 'logo' in x: logos.append(x['logo'])
   for v in x.values():walk(v)
  elif isinstance(x,list):
   for v in x:walk(v)
 for x in s.select('script[type="application/ld+json"]'):walk(json.loads(x.get_text()))
 assert logos and all('/brand/moe-2026-09-09/logo-1-' in l for l in logos),logos
 og=s.select_one('meta[property="og:image"]')['content']
 data=urllib.request.urlopen(urllib.request.Request(og,headers={'User-Agent':'Googlebot-Image/1.0'})).read()
 im=Image.open(io.BytesIO(data)); assert im.width>=1200
 report.append({'page':path,'icons':icons,'icon_sizes':sizes,'logos':logos,'robots':robots,'og':og,'og_size':im.size})
print(json.dumps(report,ensure_ascii=False,indent=2))
