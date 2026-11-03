"""Real-data keyword alignment per page (0-100), weighted by SE Ranking volume (data/seranking-refresh-*.csv).
Points per keyword: title 30, H1 20, any H2/H3 25, first 100 visible words 15, meta description 10.
Matching: case-insensitive close variants (tokens in order, up to 2 words between); 'physio' = 'physiotherapy'; 'worksafe bc' = 'worksafebc'; hyphens = spaces. Run: python3 -I build/keyword_alignment.py"""
import csv, glob, html, json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
src = sorted(glob.glob(str(ROOT / 'data/seranking-refresh-*.csv')))[-1]
vol = lambda r: int(re.match(r'\d+', r.get('volume_2026_11_03') or 'x').group()) if re.match(r'\d+', r.get('volume_2026_11_03') or '') else 0
rows = [r for r in csv.DictReader(open(src)) if vol(r) > 0]
PAGES = {'pillar': '/worksafe-physiotherapy/', 'guide': '/worksafebc-physiotherapy-what-is-covered/', 'rtw': '/return-to-work-after-a-workplace-injury/'}
norm = lambda t: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', t)).lower().replace('-', ' ').replace('physiotherapy', 'physio').replace('worksafe bc', 'worksafebc')).strip()
# close variant: keyword tokens in order, at most 2 other words between neighbours
near = lambda k, txt: re.search(r'(?<!\w)' + r'(?:\W+\w+){0,2}\W+'.join(map(re.escape, k.split())) + r'(?!\w)', txt) is not None
for pid, path in PAGES.items():
    d = ROOT / 'pages/dist' / pid
    meta = json.load(open(d / 'meta.json')); page = open(d / 'preview.html').read()
    body = page[page.index('<div class="sr-ws-page">'):]
    h1 = ' '.join(re.findall(r'<h1[^>]*>(.*?)</h1>', body, re.S)); hs = ' | '.join(re.findall(r'<h[23][^>]*>(.*?)</h[23]>', body, re.S))
    first = ' '.join(norm(body).split()[:100])
    fields = {'title': (norm(meta['title']), 30), 'h1': (norm(h1), 20), 'h2h3': (norm(hs), 25), 'first100': (first, 15), 'meta': (norm(meta['description']), 10)}
    mine = [r for r in rows if r['url_target'].replace('https://synergyrehabilitation.ca', '').split(' ')[0].split('#')[0] == path]
    tot = sum(vol(r) for r in mine) or 1
    score = 0; detail = []
    for r in sorted(mine, key=lambda r: -vol(r)):
        k = norm(r['keyword']); v = vol(r)
        pts = sum(w for (txt, w) in fields.values() if near(k, txt))
        score += v * pts / 100; detail.append(f"{r['keyword']} ({v}): {pts}")
    print(f"{pid}: alignment {round(100 * score / tot)}/100 over {len(mine)} keywords, {tot}/mo (SE Ranking CA)")
    for x in detail[:6]: print('   ', x)
