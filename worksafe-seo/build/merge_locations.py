"""Merge verified clinic facts into data/worksafe-locations.json (one source of truth for page builds).
Sources: data/yelp-nap.csv (client-filled NAP), research/02-icbc-location-pages.csv (nearby clinics, ICBC URL),
data/locations-master.csv (Jane ids, GBP data, conflicts), origin/data availability.json (WCB appointment types).
Run: python3 -I build/merge_locations.py <availability.json path>"""
import csv, json, re, sys, collections, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
avail = json.load(open(sys.argv[1]))
yelp = {r['jane_slug']: r for r in csv.DictReader(open(ROOT/'data/yelp-nap.csv')) if r['jane_slug']}
master = {r['jane_slug']: r for r in csv.DictReader(open(ROOT/'data/locations-master.csv'))}
icbc = {r['url'].rstrip('/').split('/')[-1]: r for r in csv.DictReader(open(ROOT/'research/02-icbc-location-pages.csv'))}

# page slug (mirrors /icbc-treatments/<slug>/), display name, Jane slug. Order = west to east.
CLINICS = [
 ('vancouver','Vancouver','vancouver'), ('burnaby','Burnaby','burnaby'), ('new-westminster','New Westminster','new-westminster'),
 ('richmond','Richmond','richmond'), ('delta','Delta','delta'), ('nordel-surrey','Nordel','nordel-88-ave'),
 ('cedar-hills-surrey','Cedar Hills','cedar-hills'), ('central-city-surrey','Central City','central-city'),
 ('king-george-surrey','King George','king-george'), ('strawberry-hill-surrey','Strawberry Hill','strawberry-hill-72nd'),
 ('newton-surrey','Newton','newton-72nd'), ('fleetwood-surrey','Fleetwood','fleetwood'),
 ('sullivan-heights-surrey','Sullivan Heights','sullivan-heights-hwy-10'), ('south-surrey','South Surrey','south-surrey'),
 ('cloverdale-surrey','Cloverdale','cloverdale-hwy-10'), ('clayton-heights-surrey','Clayton Heights','clayton-heights'),
 ('clayton-corners-surrey','Clayton Corners','clayton-corners-188-st'), ('langley','Langley','langley'), ('abbotsford','Abbotsford','abbotsford'),
]
# Eligibility risk notes come from research/05 and research/09 (not new facts).
RISK = {'cedar-hills': 'HIGH: not found on cached WorkSafeBC MSK physio list; Medimap lists private pay only (SYN-16)',
        'clayton-corners-188-st': 'HIGH: not found on any cached WorkSafeBC list',
        'delta': 'MEDIUM: Medimap lists another entity (Salius Rehab Inc.) at this unit; older EAPP row carries King George phone',
        'new-westminster': 'LOW: on cached list but unit 202 vs 405',
        'central-city': 'LOW: cached list names it King George Hub with a different phone',
        'vancouver': 'LOW: cached list phone 236.885.8280 differs'}

def fmt_phone(p):
    d = re.sub(r'\D', '', p)[-10:]
    return f'({d[:3]}) {d[3:6]}-{d[6:]}'

def hours(s):
    out = []
    for part in s.split(';'):
        if ':' in part:
            day, rng = part.strip().split(':', 1)
            out.append({'day': day.strip(), 'hours': rng.strip().replace('AM3PM', 'AM-3PM')})
    return out

wcb = collections.defaultdict(collections.Counter); prac = collections.defaultdict(set); checked = ''
for r in avail:
    types = [(str(r['booking_url'].split('/')[-1]), r['treatment'])] + [(str(a[0]), a[1]) for a in r.get('also', [])]
    for tid, name in types:
        if 'wcb' in name.lower():
            wcb[r['location_slug']][(tid, name)] += 1
            if 'physio' in name.lower(): prac[r['location_slug']].add(r['practitioner'])
    checked = max(checked, r.get('checked_at', ''))

def km_list(txt):
    res = []
    for m in re.finditer(r'0\d (.+?) About ([\d.]+) km', txt or ''):
        res.append({'name': m.group(1).strip(), 'km': float(m.group(2))})
    return res

name_to_slug = {n: s for s, n, _ in CLINICS}
out = []
for slug, name, jane in CLINICS:
    y, m, i = yelp[jane], master.get(jane, {}), icbc.get(slug, {})
    types = sorted({n for (_, n) in wcb[jane]})
    unit = y['street2'].replace('Ste ', 'Suite ').strip()
    rec = {
      'page_slug': slug, 'url': f'https://synergyrehabilitation.ca/worksafe-physiotherapy/{slug}/',
      'name': name, 'brand_name': f'Synergy Rehab {name}',
      'area_label': re.sub(r'^ICBC Physiotherapy in ', '', i.get('h1', '')).replace('’', "'") or name,
      'address': {'street': y['street1'].strip(), 'unit': unit, 'city': y['city'].strip().replace('Langley Township', 'Langley'),
                  'region': 'BC', 'postal': y['postal'].strip(), 'country': 'CA'},
      'phone': fmt_phone(y['phone']), 'phone_e164': '+1' + re.sub(r'\D', '', y['phone'])[-10:],
      'hours': hours(y['business_hours']),
      'jane': {'slug': jane, 'location_id': m.get('jane_location_id'),
               'book_url': f'https://synergyrehab.janeapp.com/locations/{jane}/book',
               'wcb_initial_url': f'https://synergyrehab.janeapp.com/locations/{jane}/book#/discipline/3/treatment/442'},
      'wcb_services_in_jane': types,
      'wcb_massage_bookable': any('Massage' in t for t in types),
      'wcb_acupuncture_bookable': any('Acupuncture' in t for t in types),
      'wcb_physios_with_openings': len(prac[jane]),
      'wcb_data_checked_at': checked,
      'nearby': [dict(n, slug=name_to_slug.get(n['name'])) for n in km_list(i.get('nearby_clinics_component'))],
      'existing_pages': {'icbc': f'https://synergyrehabilitation.ca/icbc-treatments/{slug}/',
                         'clinic': (m.get('site_general_location_page') or '').split(' ')[0] if (m.get('site_general_location_page') or '').startswith('http') else None},
      'gbp': {'rating': m.get('gbp_rating_avg') if (m.get('gbp_rating_avg') or '')[:1].isdigit() else None,
              'reviews': m.get('gbp_review_count_all_sources') if (m.get('gbp_review_count_all_sources') or '')[:1].isdigit() else None,
              'lat': m.get('lat') if (m.get('lat') or '')[:1].isdigit() else None,
              'lng': m.get('lng') if (m.get('lng') or '')[:1] in '-0123456789' and (m.get('lng') or '')[:2] != 'No' else None},
      'nap_source': 'Client-filled Yelp Location List (Drive 1z3KpbC5G8Gk_157f70Af2a31cniK9JtVaXSRXFnbQzc), pending GBP sign-off',
      'nap_conflicts': m.get('discrepancies', ''),
      'contract_2026': 'UNVERIFIED',  # SYN-01: staff must confirm signed April 1, 2026 agreement per clinic
      'eligibility_risk': RISK.get(jane, 'NORMAL: on cached WorkSafeBC list (pre-April 2026)'),
      'staff_facts': {'getting_here': None, 'parking': None, 'accessibility': None, 'languages': None,
                      'wcb_team_with_consent': None, 'photo_with_consent': None, 'nearby_workplaces': None},
      'publish_gates': {'G1_contract': False, 'G2_nap_signed_off': False, 'G3_distinct_facts': False,
                        'G4_url_plan': True, 'G5_tracking': False},
    }
    out.append(rec)
json.dump(out, open(ROOT/'data/worksafe-locations.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), 'clinics written; WCB data checked', checked)
for r in out: print(r['page_slug'], r['phone'], r['address']['postal'], r['wcb_physios_with_openings'], r['wcb_massage_bookable'], r['wcb_acupuncture_bookable'], len(r['nearby']), r['area_label'])
