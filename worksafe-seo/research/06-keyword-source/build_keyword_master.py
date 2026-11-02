import csv, json, re, os, sys
KW = sys.argv[1]  # dir with tsv
OUT = sys.argv[2]
D = "2026-11-02"
rows = {}
def add(k, vol, cpc, kd, comp, intents, trend, endpoint, serp=None):
    k = k.strip().lower()
    r = rows.setdefault(k, dict(kw=k, vol=None, cpc=None, kd=None, comp=None, intents=None, trend=None, endpoints=[], serp=None, nd=False))
    if endpoint not in r['endpoints']: r['endpoints'].append(endpoint)
    if vol == 'ND':
        if r['vol'] is None: r['nd'] = True
        return
    r['nd'] = False
    if r['vol'] is not None and int(vol) != r['vol']:
        r['conflict'] = f"{r['vol']} vs {vol}"
    r['vol'] = int(vol); r['cpc'] = float(cpc); r['kd'] = int(kd); r['comp'] = float(comp)
    r['intents'] = intents; 
    if trend: r['trend'] = trend
    if serp: r['serp'] = serp

M = "SE Ranking DATA_getKeywordsMetrics (source=ca, 2026-11-02)"
for fn in ['ser_b1.tsv','ser_b2.tsv','ser_b4.tsv','ser_b5.tsv']:
    for line in open(os.path.join(KW,fn)):
        if line.startswith('#') or not line.strip(): continue
        p = line.rstrip('\n').split('\t')
        if p[1] == 'ND': add(p[0],'ND',0,0,0,'','',M)
        else: add(p[0],p[1],p[2],p[3],p[4],p[5],p[6] if len(p)>6 else '',M)
# geo batch ND
geos=['surrey','vancouver','burnaby','new westminster','richmond','delta','north delta','nordel','langley','abbotsford','cloverdale','fleetwood','newton','king george','central city','cedar hills','strawberry hill','sullivan heights','clayton','south surrey']
pats=['wcb physiotherapy {}','worksafebc physiotherapy {}','worksafe physiotherapy {}','wcb physio {}','physiotherapy {}','icbc physiotherapy {}']
geo_kw=[p.format(g) for p in pats for g in geos]+['worksafe physio '+g for g in ['surrey','vancouver','burnaby','new westminster','richmond','delta','langley','abbotsford']]
for k in geo_kw:
    if k not in rows: add(k,'ND',0,0,0,'','',M)
for line in open(os.path.join(KW,'ser_disc1.tsv')):
    if line.startswith('#'): continue
    p=line.rstrip('\n').split('\t')
    ep = "SE Ranking DATA_" + p[7].replace('(', ' (seed=').replace(')', ', source=ca, 2026-11-02)')
    add(p[0],p[1],p[2],p[3],p[4],p[5],'',ep,serp=p[6].replace('|',', '))
for line in open(os.path.join(KW,'ser_q1.tsv')):
    if line.startswith('#'): continue
    p=line.rstrip('\n').split('\t')
    ep="SE Ranking DATA_getKeywordQuestions (seed=worksafebc, source=ca, 2026-11-02)"
    serp = p[6].replace('|',', ') if p[6] not in ('-','') else None
    add(p[0],p[1],p[2],p[3],p[4],p[5] if p[5]!='-' else '','',ep,serp=serp)

# ---------- classification ----------
neigh_city = {'newton':'Surrey','fleetwood':'Surrey','cloverdale':'Surrey','king george':'Surrey','central city':'Surrey','cedar hills':'Surrey','strawberry hill':'Surrey','sullivan heights':'Surrey','sullivan':'Surrey','clayton heights':'Surrey','clayton':'Surrey','south surrey':'Surrey','nordel':'Surrey','guildford':'Surrey','whalley':'Surrey','surrey central':'Surrey','north delta':'Delta','ladner':'Delta','tsawwassen':'Delta','walnut grove':'Langley','willowbrook':'Langley','willoughby':'Langley','langley city':'Langley','kitsilano':'Vancouver','dunbar':'Vancouver','point grey':'Vancouver','metrotown':'Burnaby','steveston':'Richmond','new west':'New Westminster'}
clinic_neigh = {'newton':'Newton (Newton 72 Ave clinic)','fleetwood':'Fleetwood','cloverdale':'Cloverdale','king george':'King George','central city':'Central City','cedar hills':'Cedar Hills','strawberry hill':'Strawberry Hill','sullivan heights':'Sullivan Heights','sullivan':'Sullivan Heights','clayton':'Clayton (Clayton Corners + Clayton Heights clinics)','clayton heights':'Clayton Heights','south surrey':'South Surrey','nordel':'Nordel','north delta':'North Delta (Delta clinic area; ASSUMPTION)'}
cities = ['new westminster','vancouver','burnaby','richmond','langley','abbotsford','surrey','delta','white rock','coquitlam','edmonton','calgary','winnipeg']
city_title = {c:c.title() for c in cities}
out_area = {'white rock','coquitlam','edmonton','calgary','winnipeg'}

def geo(k):
    city='None (not geo-modified)'; nb='None'
    found_nb=None
    for n in sorted(neigh_city, key=len, reverse=True):
        if re.search(r'\b'+re.escape(n)+r'\b', k):
            found_nb=n; break
    if found_nb:
        city = neigh_city[found_nb]
        if found_nb=='new west': nb='None'; city='New Westminster'
        else:
            nb = clinic_neigh.get(found_nb, found_nb.title()+' (no Synergy clinic of this name; proximity unverified)')
        k2 = k.replace(found_nb,'')
    else: k2=k
    for c in sorted(cities,key=len,reverse=True):
        if re.search(r'\b'+re.escape(c)+r'\b', k2) and not found_nb:
            city = city_title[c]; break
    if 'near me' in k and city.startswith('None'): city='Near me (implicit local)'
    kb = k.replace('worksafe bc','').replace('work safe bc','')
    if re.search(r'\bbc\b', kb) and city.startswith('None'): city='BC-wide'
    return city, nb

WS = re.compile(r'\b(wcb|worksafe|worksafebc|wsbc|work safe|workers comp|workers compensation)\b')
PHYS = re.compile(r'physio|physical therap')
PROVIDER = re.compile(r'(initial|extension|discharge|progress) report|fee schedule|contract|physiotherapy reports')
def classify(k, r):
    vol=r['vol']
    city, nb = geo(k)
    out = city.lower() in out_area
    ws = bool(WS.search(k)); ph = bool(PHYS.search(k))
    pri='3'; intent='Informational'; svc='Other'
    if 'icbc' in k:
        return 'Commercial local (ICBC, context only)', city, nb, 'ICBC physiotherapy (context)', 'Context (never a WorkSafe target)'
    if k in ('worksafebc','worksafe bc','wcb bc','work safe bc'):
        return 'Navigational (WorkSafeBC brand)', city, nb, 'WorkSafeBC brand navigation', 'Exclude (navigational to worksafebc.com)'
    if 'lawyer' in k:
        return 'Commercial (legal)', city, nb, 'Legal services', 'Exclude (out of scope)'
    if ws and PROVIDER.search(k):
        return 'Provider / B2B (clinician admin)', city, nb, 'Physiotherapy provider admin (reports, fees, contract)', 'Exclude (provider intent, not patient)'
    if ws and ph:
        svc='WorkSafeBC physiotherapy'
        if out: return 'Local transactional (outside Synergy area)', city, nb, svc, 'Exclude (no Synergy clinic; other province or city)'
        if any(q in k for q in ['no referral','coverage','cover','cost','user fee','sessions','direct billing','claim','forms','pay for']):
            return 'Informational (coverage / claim process)', city, nb, svc, '2'
        if 'near me' in k or 'clinic' in k:
            return 'Local transactional', city, nb, svc, '1' if (vol or 0)>0 else '2'
        if city.startswith('None') or city=='BC-wide':
            return 'Commercial / local (head term)', city, nb, svc, '1' if (vol or 0)>0 else '2'
        if nb!='None':
            return 'Local transactional (neighbourhood)', city, nb, svc, '3'
        return 'Local transactional (city)', city, nb, svc, '2'
    if ws and any(s in k for s in ['massage','rmt']):
        return 'Commercial / local', city, nb, 'WorkSafeBC massage therapy (WCB massage subsequent sessions bookable at 9 clinics per locations-master.csv)', '2' if (vol or 0)>0 else '3'
    if ws and 'acupuncture' in k:
        return 'Commercial / local', city, nb, 'WorkSafeBC acupuncture (WCB acupuncture types at Nordel only)', '3'
    if ws and any(s in k for s in ['chiropract']):
        return 'Commercial / local', city, nb, 'WorkSafeBC chiropractic (no WCB chiro type in Jane list; verify)', 'Exclude (service not verified as WorkSafe-bookable)'
    if ws and any(s in k for s in ['kinesiolog','active rehab']):
        return 'Commercial / local', city, nb, 'WorkSafeBC kinesiology / active rehab (no WCB kin type in Jane list; verify)', '3'
    if ws and any(s in k for s in ['counselling','occupational therapy','concussion','doctor']):
        return 'Commercial / informational', city, nb, 'Other WorkSafeBC health service (not a Synergy WorkSafe page target)', 'Exclude (service not verified / not physio)'
    if any(s in k for s in ['form 7','form 8','form 11','online services','account number','clearance','phone number','how long does worksafebc pay','how long does it take for worksafebc to pay','sue worksafebc','fight worksafebc','is worksafebc mandatory','worksafebc ergonomics']):
        return 'Informational / navigational (WorkSafeBC admin, employer or legal)', city, nb, 'Claims & WorkSafeBC admin', 'Exclude (employer, legal or WorkSafeBC account task)'
    if any(s in k for s in ['form 6','claim number','teleclaim','how long does a wcb claim','worksafebc claim','wcb claim','worksafe bc claim','injury report','report injury','report of injury','workplace injury report','how to file','how to make a wcb','how do i claim','how does a worksafebc claim','claim status','check my worksafebc status','claim take','claim denied','claim accepted','claim line','claims call']):
        return 'Informational (claim process)', city, nb, 'Claims & WorkSafeBC admin', '2' if (vol or 0)>0 and 'wcb claim'!=k else '3'
    if any(s in k for s in ['case manager','review division','appeal','wage loss','benefits','what is worksafebc','how does worksafebc work','what does worksafebc cover','what will worksafebc pay','who is eligible','who is not covered','difference between wcb','wcb and worksafebc','vocational rehab','mental health','three forms','workers comp','workers compensation']):
        return 'Informational (WorkSafeBC system)', city, nb, 'Claims & WorkSafeBC admin', '3'
    if any(s in k for s in ['return to work','modified dut','stay at work']):
        return 'Informational (return to work)', city, nb, 'Return-to-work support', '2' if (vol or 0)>0 else '3'
    if any(s in k for s in ['work hardening','work conditioning','functional capacity','occupational rehab','work rehab','functional restoration','or1 program','activity based']):
        return 'Commercial / informational', city, nb, 'Occupational rehab programs (Synergy offering UNKNOWN; verify before targeting)', '3'
    if any(s in k for s in ['ergonom']):
        return 'Informational / commercial', city, nb, 'Ergonomics (Synergy offering UNKNOWN)', '3'
    if any(s in k for s in ['injur','hurt at work','slip and fall at work','workplace physiotherapy','construction','warehouse','nurse','healthcare worker','truck driver','desk job','on the job','at work']) :
        svc='Work-injury education'
        if k=='workplace physiotherapy': return 'Commercial / local (ambiguous: on-site employer physio vs injury care)', city, nb, 'Work-injury physiotherapy', '3'
        if 'physio' in k: return 'Commercial / local (work injury)', city, nb, 'Work-injury physiotherapy', '2' if (vol or 0)>0 else '3'
        if re.search(r'\bbc\b', k.replace('worksafe bc','')) or 'worksafebc' in k or 'wsbc' in k: return 'Informational (work injury, BC)', city, nb, svc, '2' if (vol or 0)>0 else '3'
        return 'Informational (work injury, national)', city, nb, svc, '3'
    if any(s in k for s in ['repetitive strain','rsi ','carpal tunnel','tennis elbow']):
        return 'Informational (injury, often work-related)', city, nb, 'Injury education (work-related conditions)', '3'
    if any(s in k for s in ['back pain','knee','shoulder pain','ankle sprain','concussion physiotherapy','sciatica','rotator cuff','musculoskeletal']):
        return 'Commercial / informational (generic injury physio)', city, nb, 'Injury physiotherapy (generic, context)', 'Context (not WorkSafe-specific)'
    if any(s in k for s in ['active rehab','kinesiolog','occupational therapy']):
        return 'Commercial local (generic)', city, nb, 'Active rehab / kinesiology / OT (generic, context)', 'Context (not WorkSafe-specific)'
    if ph or 'referral' in k:
        return 'Commercial local (generic physio)', city, nb, 'Physiotherapy (generic, context)', 'Context (never a WorkSafe target)'
    return 'Informational', city, nb, 'Other', '3'

# current rank evidence from earlier specialists (KNOWN, cited)
CR = {
 'wsbc physiotherapy burnaby':'64 (/worksafe-physiotherapy/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'wsbc physiotherapy new westminster':'47 (/physiotherapy-new-westminster/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'occupational rehabilitation burnaby':'12 (/) and 52 (/occupational-therapy/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'occupational rehabilitation new westminster':'28 (/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'occupational therapy surrey':'20 (/occupational-therapy/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'wcb physiotherapy cloverdale':'GSC avg position 6.0, 1 click / 7 impressions (date range not stated) per SE Ranking PROJECT_getGoogleSearchConsole, research/01-site-inventory.md s5.1',
 'worksafe physiotherapy':'Maps grid only: New Westminster avg 3.36 (25/25 pts), Newton 72 Ave avg 8.64 (25/25 pts), SE Ranking LOCAL_getRankingPositions check 2026-10-30, data/gbp-maps-keyword-positions.csv; organic Not Available',
 'workplace injury physio near me':'86 (/) per SE Ranking DATA_getDomainKeywords ca, research/01-site-inventory.md s5.1',
 'worksafebc':'not in top 100 (SE Ranking project report 2026-09-25, data/historical-rankings.csv)',
 'work injury':'Maps grid only: Newton 72 Ave ranked at 9/25 pts, avg 11.33 (SE Ranking LOCAL, 2026-10-30, data/gbp-maps-keyword-positions.csv); organic Not Available',
}
fields=['Keyword','Intent','City','Neighbourhood','Service','Estimated Volume','Organic Difficulty','Current Rank','Competitor Rank','SERP Type','URL Target','Source','Confidence','Priority']
out=[]
for k,r in rows.items():
    intent, city, nb, svc, pri = classify(k, r)
    if r['vol'] is None:
        vol = 'Not Available (SE Ranking CA: no data for this keyword)'
        kd = 'Not Available (no data)'
        conf = 'UNKNOWN (no tool returned a value; Ahrefs/Semrush/Keyword Planner unavailable)'
    else:
        vol = str(r['vol'])
        if r.get('trend'): vol += f" (12-mo trend: {r['trend']})"
        if r.get('conflict'): vol += f" [endpoints disagree: {r['conflict']}]"
        kd = str(r['kd'])
        flat = (r.get('trend') or '').startswith('flat')
        conf = 'KNOWN (tool value)'
        if r['vol']==0: conf += '; 0 = below SE Ranking reporting threshold, not proof of zero searches'
        elif flat: conf += '; LOW precision: flat 12-month trend suggests bucketed/modelled estimate'
        if k in ('worksafebc physio','worksafe bc physio','wsbc physiotherapy','worksafebc physiotherapy'): conf += '; identical 140 for 4 spellings suggests grouped close variants: do NOT sum'
        if k.startswith('wcb') and r['vol']>0 and 'bc' not in k: conf += '; national CA volume, BC share UNKNOWN (WCB is the name used in AB/SK/MB etc.)'
    sri = f" SE Ranking intent codes: {r['intents']}." if r.get('intents') else ''
    cpc = '' if r['cpc'] is None else f" CPC {r['cpc']:.2f} / paid competition {r['comp']:.2f} (currency not stated by API; paid metric, not organic difficulty)."
    src = '; '.join(r['endpoints']) + '.' + sri + cpc
    serp = r['serp'] + ' (SE Ranking serp_features)' if r.get('serp') else 'Not Available (getKeywordsMetrics returns no SERP features; SERP review owned by rankings agent)'
    out.append({'Keyword':k,'Intent':intent,'City':city,'Neighbourhood':nb,'Service':svc,'Estimated Volume':vol,'Organic Difficulty':kd,
                'Current Rank':CR.get(k,'Not Available'),'Competitor Rank':'Not Available','SERP Type':serp,
                'URL Target':'Not Available (page architecture pending; proposed mapping in research/06-keyword-research.md s7)',
                'Source':src,'Confidence':conf,'Priority':pri})
order={'1':0,'2':1,'3':2}
def sk(x):
    p=x['Priority']; o=order.get(p, 3 if p.startswith('Context') else 4)
    try: v=-int(x['Estimated Volume'].split(' ')[0])
    except: v=1
    return (o, v, x['Keyword'])
out.sort(key=sk)
with open(OUT,'w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(out)
json.dump({k:{kk:vv for kk,vv in r.items()} for k,r in rows.items()}, open(os.path.join(KW,'merged.json'),'w'), indent=1)
from collections import Counter
print(len(out)); print(Counter(x['Priority'] for x in out))
