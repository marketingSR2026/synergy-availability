"""Fill URL Target, Current Rank and Competitor Rank in data/keyword-master.csv from the spec's ownership rules (spec section 2)
and the 2026-11-02 SERP snapshot. Re-runnable. Run: python3 -I build/map_keywords.py"""
import csv, json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://synergyrehabilitation.ca'
PILLAR = f'{SITE}/worksafe-physiotherapy/'
GUIDE = f'{SITE}/worksafebc-physiotherapy-what-is-covered/'
RTW = f'{SITE}/return-to-work-after-a-workplace-injury/'
locs = json.load(open(ROOT / 'data/worksafe-locations.json'))
# place word -> clinic page (single-clinic places only). Multi-clinic cities (Surrey) belong to the pillar.
place = {}
for x in locs:
    for w in {x['name'].lower(), x['area_label'].split(',')[0].lower().replace("vancouver's west side", 'vancouver')}:
        place[w] = x['url']
place.update({'north delta': next(x['url'] for x in locs if x['page_slug'] == 'delta'), 'new west': next(x['url'] for x in locs if x['page_slug'] == 'new-westminster'),
              'newton': next(x['url'] for x in locs if x['page_slug'] == 'newton-surrey'), 'surrey city centre': next(x['url'] for x in locs if x['page_slug'] == 'central-city-surrey'),
              'east clayton': next(x['url'] for x in locs if x['page_slug'] == 'clayton-corners-surrey')})
place.pop('surrey', None)
ambiguous = {'clayton'}  # two clinics: owner is the pillar Surrey group

def target(k):
    kw = k['Keyword'].lower(); pr = k['Priority']
    if not pr[:1].isdigit():
        return 'None (context or excluded; see Priority)'
    if re.search(r'functional capacity|work hardening|work conditioning|\bfce\b', kw): return 'None (service not verified at Synergy; research/06 s7.3)'
    if re.search(r'return to work|modified dut|gradual return|light dut', kw): return RTW
    if re.search(r'claim|form 6|teleclaim|report|covered|cover|user fee|cost|free physio|pay|referral|extension|pending|denied|reimburs', kw): return GUIDE
    if re.search(r'massage|acupunct', kw): return f'{PILLAR} (section: other WorkSafeBC care; clinic pages only where confirmed)'
    for w in sorted(place, key=len, reverse=True):
        if re.search(rf'\b{re.escape(w)}\b', kw) and w not in ambiguous:
            return place[w]
    if re.search(r'\bsurrey\b|\bclayton\b|guildford|whalley', kw): return f'{PILLAR}#area-surrey'
    if 'near me' in kw: return f'{PILLAR} (finder) + nearest clinic page via local relevance'
    return PILLAR

serp = list(csv.DictReader(open(ROOT / 'data/serp-snapshot.csv')))
def ranks(kw):
    rows = [r for r in serp if r['keyword'].lower() == kw.lower() and r['rank'].isdigit() and 'local_pack' not in r['serp_feature']]
    own = sorted((int(r['rank']), r['url']) for r in rows if 'synergyrehabilitation.ca' in r['domain'])
    comp = sorted((int(r['rank']), r['domain']) for r in rows if 'synergyrehabilitation.ca' not in r['domain'] and 'worksafebc.com' not in r['domain'])
    cur = f"{own[0][0]} ({own[0][1].replace(SITE, '')}; SE Ranking SERP 2026-11-02, {rows[0]['location']})" if own else None
    cmp_ = f"{comp[0][0]} ({comp[0][1]})" if comp else None
    return cur, cmp_, bool(rows)

p = ROOT / 'data/keyword-master.csv'
rows = list(csv.DictReader(open(p))); fields = list(rows[0].keys())
n_t = n_r = 0
for r in rows:
    r['URL Target'] = target(r); n_t += 1
    cur, cmp_, seen = ranks(r['Keyword'])
    if seen:
        r['Current Rank'] = cur or 'Not in organic top 100 of SE Ranking SERP 2026-11-02'
        r['Competitor Rank'] = cmp_ or r['Competitor Rank']; n_r += 1
with open(p, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
print(f'{n_t} URL targets set; {n_r} keywords got SERP ranks')
from collections import Counter
print(Counter(r['URL Target'].split(' ')[0].replace(SITE, '') for r in rows).most_common(30))
