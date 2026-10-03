"""Read-only local SSR and migration parity checks; no checker changes or leads."""
import concurrent.futures, hashlib, json, re, sys, urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from bs4 import BeautifulSoup

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:3217'
EVIDENCE = Path('/var/lib/megaclaw/workspace/tubro-evidence')
INVENTORY = json.loads(Path('content/blog/_inventory.json').read_text())
KEY_ROUTES = ['/', '/schedule-an-estimate', '/contact', '/careers', '/kitchen-remodeling', '/bathroom-remodeling', '/recent-projects', '/blog', '/blog/kitchen-remodel-cost-washington-state', '/service-area/home-remodeling-maple-valley', '/privacy']

def normalize(text):
    return re.sub(r'\s+', ' ', text).strip()

def inspect(path):
    try:
        response = urllib.request.urlopen(BASE + urllib.parse.quote(path), timeout=30)
        html = response.read().decode(); soup = BeautifulSoup(html, 'html.parser')
        meta = lambda key: (soup.select_one('meta[name="'+key+'"],meta[property="'+key+'"]') or {}).get('content', '')
        schemas = [json.loads(t.get_text()) for t in soup.select('script[type="application/ld+json"]')]
        title = soup.title.get_text() if soup.title else ''
        result = {'path': path, 'status': response.status, 'finalPath': urllib.parse.urlparse(response.url).path, 'h1': len(soup.select('h1')), 'main': len(soup.select('main#main-content')), 'titleLength': len(title), 'descriptionLength': len(meta('description')), 'schemaTypes': [v.get('@type') for v in schemas], 'forms': len(soup.select('form')), 'errors': []}
        errors = result['errors']
        if not result['h1'] or result['main'] != 1: errors.append('Missing h1/main')
        if not soup.select_one('a[href="#main-content"]') or soup.select_one('#main-content').get('tabindex') != '-1': errors.append('Invalid skip target')
        if not 1 <= len(title) <= 70 or not 50 <= len(meta('description')) <= 165: errors.append('SEO lengths')
        for key in ['og:title', 'og:description', 'og:image', 'twitter:card']:
            if not meta(key): errors.append('Missing '+key)
        for form in soup.select('form'):
            if form.get('action') != '/api/lead' or form.get('method') != 'post': errors.append('Form action')
            for key in ['name','email','phone','projectDetails']:
                control = form.select_one('[name="'+key+'"]')
                if not control or not control.has_attr('required'): errors.append('Required '+key)
            for key in ['email','phone']:
                if not form.select_one('[name="'+key+'"]').get('pattern'): errors.append('Pattern '+key)
            if form.select('[type="submit"]'): errors.append('Raw submit control')
        article = soup.select_one('[data-article-body]')
        record = next((p for p in INVENTORY['legacy_url_records'] if p['path'] == path), None)
        if record and record['type'] in ('article', 'compatibility_alias'):
            if result['schemaTypes'].count('BlogPosting') != 1: errors.append('Article schema count')
            text = normalize(' '.join(article.stripped_strings)) if article else ''
            result['bodyHash'] = hashlib.sha256(text.encode()).hexdigest()
            if result['bodyHash'] != record['body_sha256']: errors.append('Article text parity')
            if len(article.select('a')) != record['links']: errors.append('Article link count parity')
            if len(article.select('table')) != record['tables']: errors.append('Article table count parity')
            canonical = soup.select_one('link[rel="canonical"]')['href']
            if canonical != 'https://www.tubroconstruction.com'+record['canonical']: errors.append('Canonical mismatch')
        return result
    except Exception as error:
        return {'path':path,'errors':[str(error)]}

def main():
    sitemap = ET.fromstring(urllib.request.urlopen(BASE + '/sitemap.xml').read())
    sitemap_paths = [urllib.parse.urlparse(e.text).path for e in sitemap.iter() if e.tag.endswith('loc')]
    paths = sorted(set(sitemap_paths + KEY_ROUTES + [p['path'] for p in INVENTORY['legacy_url_records']] + [p['path'] for p in INVENTORY['posts']]))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: results = list(pool.map(inspect, paths))
    EVIDENCE.mkdir(exist_ok=True); (EVIDENCE/'round1-ssr.json').write_text(json.dumps(results,indent=2))
    failures = [r for r in results if r['errors']]
    print(json.dumps({'checked':len(results),'failures':failures},indent=2))
    return bool(failures)

if __name__ == '__main__': sys.exit(main())
