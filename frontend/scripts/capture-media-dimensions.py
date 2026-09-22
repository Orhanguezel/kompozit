"""Capture real image dimensions from public HTML; unknown future assets retain fill layout."""
import concurrent.futures, io, json, urllib.request
from html.parser import HTMLParser
from urllib.parse import urlparse,parse_qs,urljoin
from pathlib import Path
from PIL import Image
BASE='https://www.karbonkompozit.com.tr'
class Images(HTMLParser):
 def __init__(self):super().__init__();self.images=[]
 def handle_starttag(self,tag,attrs):
  if tag=='img':self.images.append(dict(attrs).get('src',''))
def read(url):return urllib.request.urlopen(url,timeout=15).read()
urls=set()
for loc in ['tr','en']:
 for path in ['', '/products','/solutions','/references','/gallery','/blog','/about','/contact','/offer']:
  parser=Images()
  try: parser.feed(read(BASE+'/'+loc+path).decode())
  except Exception as e: print(f'Skipped page {loc}{path}: {e}'); continue
  for src in parser.images:
   if src.startswith('/_next/image?'):src=parse_qs(urlparse(src).query).get('url',[''])[0]
   url=urljoin(BASE,src)
   if urlparse(url).hostname in ['www.karbonkompozit.com.tr','karbonkompozit.com.tr']:urls.add(url)
def capture(url):
 try:
  data=read(url);im=Image.open(io.BytesIO(data));return urlparse(url).path,{'width':im.width,'height':im.height}
 except Exception as e:print(f'Skipped {url}: {e}');return None
results=[r for r in concurrent.futures.ThreadPoolExecutor(6).map(capture,sorted(urls)) if r]
path=Path(__file__).resolve().parents[1]/'src/lib/media-dimensions.json'
path.write_text(json.dumps(dict(results),indent=2,ensure_ascii=False)+'\n');print(f'Captured {len(results)} real image dimensions')
