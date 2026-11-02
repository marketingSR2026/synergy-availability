"""Deliverable 3: data/location-matrix.csv, one row per clinic, from machine data + sign-off sheet + keyword map. Run: python3 -I build/location_matrix.py"""
import csv, json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
locs = json.load(open(ROOT / 'data/worksafe-locations.json'))
so = {r['page_slug']: r for r in csv.DictReader(open(ROOT / 'data/clinic-signoff.csv'))}
kw = list(csv.DictReader(open(ROOT / 'data/keyword-master.csv')))
cols = ['clinic', 'official_identity (client-filled list, pending GBP sign-off)', 'phone', 'worksafebc_status', 'evidence', 'eligibility_risk', 'planned_url', 'primary_keyword', 'secondary_keywords',
        'booking_destination', 'wcb_services_in_jane (not proof of contract)', 'planned_differentiation', 'nap_conflicts_to_resolve', 'wave', 'production_status', 'blockers']
out = []
for x in locs:
    s = so[x['page_slug']]
    mine = [k['Keyword'] for k in kw if k['URL Target'].startswith(x['url'])]
    g1 = s.get('contract_2026_confirmed') == 'yes'
    blockers = [b for b, ok in [('G1 contract (ops: signed April 2026 agreement, vendor number)', g1), ('G2 NAP sign-off (manager)', bool(s.get('nap_signed_on'))),
                                ('G3 clinic facts + consented team or photo (manager)', bool(s.get('getting_here'))), ('G4 trim other WorkSafe sections (marketing)', bool(s.get('url_plan_done_on'))),
                                ('G5 tracking (marketing)', bool(s.get('tracking_added_on')))] if not ok]
    out.append({
        'clinic': x['brand_name'],
        'official_identity (client-filled list, pending GBP sign-off)': f"{x['address']['unit'] + ', ' if x['address']['unit'] else ''}{x['address']['street']}, {x['address']['city']}, BC {x['address']['postal']}",
        'phone': x['phone'],
        'worksafebc_status': 'CONFIRMED' if g1 else ('PENDING (high risk)' if x['eligibility_risk'].startswith('HIGH') else 'PENDING'),
        'evidence': 'Jane shows WCB Physio Initial (442) and Subsequent (422) bookable, 2026-11-02 (KNOWN). Cached WorkSafeBC provider lists are pre-April 2026 (LIKELY). Signed 2026 agreement: not confirmed.',
        'eligibility_risk': x['eligibility_risk'],
        'planned_url': x['url'],
        'primary_keyword': f"worksafebc physiotherapy {x['name'].lower()} / wcb physio {x['name'].lower()} (no measurable geo volume; page justified by clinic facts)",
        'secondary_keywords': '; '.join(mine[:6]) or 'near-me terms via local relevance',
        'booking_destination': f"https://synergyrehab.janeapp.com/locations/{x['jane']['slug']}/book#/discipline/3/treatment/{s.get('wcb_initial_treatment_id') or 442}",
        'wcb_services_in_jane (not proof of contract)': '; '.join(x['wcb_services_in_jane']),
        'planned_differentiation': 'Getting here, parking, accessibility, check-in steps, languages, consented WCB team cards and clinic photo, confirmed WCB services, nearest contracted clinics with distances',
        'nap_conflicts_to_resolve': x['nap_conflicts'][:400],
        'wave': s.get('wave'),
        'production_status': 'Template built; preview rendered (pages/dist); not publishable until gates pass',
        'blockers': '; '.join(blockers) or 'none',
    })
with open(ROOT / 'data/location-matrix.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(out)
print(len(out), 'rows')
