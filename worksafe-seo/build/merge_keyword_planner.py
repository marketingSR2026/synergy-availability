"""Merge a Google Keyword Planner export into data/keyword-master.csv.
Export from Keyword Planner: Tools > Keyword Planner > "Get search volume and forecasts" (paste data/keyword-planner-seed.txt),
Locations: British Columbia (Canada), Language: English, Network: Google, last 12 months > Download keyword ideas (.csv).
Run: python3 -I build/merge_keyword_planner.py <export.csv>   (UTF-16 tab or UTF-8 comma files both work)
Adds columns: KP Avg Monthly Searches (BC), KP Competition, KP Top Bid Low, KP Top Bid High, KP Source. SE Ranking values are kept."""
import csv, io, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
raw = pathlib.Path(sys.argv[1]).read_bytes()
text = raw.decode('utf-16') if raw[:2] in (b'\xff\xfe', b'\xfe\xff') else raw.decode('utf-8-sig')
lines = text.splitlines()
start = next(i for i, l in enumerate(lines) if l.split('\t')[0].split(',')[0].strip('"') == 'Keyword')
delim = '\t' if '\t' in lines[start] else ','
kp = {r['Keyword'].strip().lower(): r for r in csv.DictReader(io.StringIO('\n'.join(lines[start:])), delimiter=delim) if r.get('Keyword')}
p = ROOT / 'data/keyword-master.csv'
rows = list(csv.DictReader(open(p))); fields = list(rows[0].keys())
new = ['KP Avg Monthly Searches (BC)', 'KP Competition', 'KP Top Bid Low', 'KP Top Bid High', 'KP Source']
fields += [c for c in new if c not in fields]
hit = 0
for r in rows:
    k = kp.get(r['Keyword'].lower())
    if k:
        hit += 1
        r['KP Avg Monthly Searches (BC)'] = k.get('Avg. monthly searches', '')
        r['KP Competition'] = k.get('Competition', '')
        r['KP Top Bid Low'] = next((v for c, v in k.items() if c and c.startswith('Top of page bid (low')), '')
        r['KP Top Bid High'] = next((v for c, v in k.items() if c and c.startswith('Top of page bid (high')), '')
        r['KP Source'] = f'Google Keyword Planner export {pathlib.Path(sys.argv[1]).name} (BC, English)'
    else:
        for c in new: r.setdefault(c, 'Not Available')
extra = sorted(set(kp) - {r['Keyword'].lower() for r in rows})
with open(p, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)
(ROOT / 'data/keyword-planner-new-ideas.csv').write_text('keyword,avg_monthly_searches_bc,competition\n' + ''.join(f'"{k}","{kp[k].get("Avg. monthly searches","")}","{kp[k].get("Competition","")}"\n' for k in extra))
print(f'{hit} of {len(rows)} keywords matched; {len(extra)} new Keyword Planner ideas written to data/keyword-planner-new-ideas.csv')
