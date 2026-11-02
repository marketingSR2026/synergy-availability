"""Parse saved SE Ranking advanced SERP JSON files into serp-snapshot.csv and a summary JSON.

Usage: python3 -I parse_serps.py <src_dir> <out_csv> <out_summary_json>
"""
import csv
import glob
import json
import os
import sys
from collections import Counter, defaultdict
from urllib.parse import urlparse

LOC_NAMES = {
    3518: "Surrey BC", 3536: "Vancouver BC", 3245: "Burnaby BC", 3473: "Richmond BC",
    3371: "Langley BC", 3209: "Abbotsford BC", 3413: "New Westminster BC", 3302: "Delta BC",
}
ORGANIC_DEPTH = 10


def dom(url):
    try:
        d = urlparse(url).netloc.lower()
    except Exception:
        return ""
    return d[4:] if d.startswith("www.") else d


def main(src, out_csv, out_json):
    rows = []
    summary = {}
    dom_counter = Counter()          # organic top-10 appearances
    dom_kw = defaultdict(set)        # domain -> set of (kw)
    dom_best = {}                    # domain -> best rank
    dom_urls = defaultdict(set)
    pack_counter = Counter()
    aio_counter = Counter()
    for path in sorted(glob.glob(os.path.join(src, "serp_*.json"))):
        task_id = os.path.basename(path)[5:-5]
        with open(path) as f:
            d = json.load(f)
        md = d.get("request_metadata", {})
        kw = md.get("keyword")
        loc = LOC_NAMES.get(md.get("location_id"), str(md.get("location_id")))
        date = (md.get("crawled_at") or "")[:10]
        source = f"SE Ranking DATA_getSerpTaskAdvancedResults task {task_id} (location_id {md.get('location_id')}, google.ca desktop, en)"
        feats = d.get("summary", {}).get("SERP_features", [])
        s = {"keyword": kw, "location": loc, "task_id": task_id, "crawled_at": md.get("crawled_at"),
             "serp_features": feats, "organic": [], "local_pack": [], "aio_sources": [], "paa": [],
             "aio_text": None, "synergy_organic": [], "synergy_pack": []}
        seen_org = 0
        for it in d.get("items", []):
            t = it.get("type")
            if t == "organic":
                rg = it.get("rank_group")
                if rg is None or rg > ORGANIC_DEPTH:
                    continue
                url = it.get("url")
                dm = dom(url)
                s["organic"].append({"rank": rg, "rank_absolute": it.get("rank_absolute"), "url": url, "domain": dm,
                                     "title": it.get("title"), "description": it.get("description")})
                rows.append([kw, loc, rg, url, dm, "organic", date, source])
                dom_counter[dm] += 1
                dom_kw[dm].add(f"{kw} | {loc}")
                dom_urls[dm].add(url)
                dom_best[dm] = min(dom_best.get(dm, 99), rg)
                if "synergyrehabilitation.ca" in dm:
                    s["synergy_organic"].append(rg)
            elif t == "local_pack":
                for i, l in enumerate(it.get("links", []) or [], 1):
                    url = l.get("url")
                    dm = dom(url) if url else ""
                    title = l.get("title")
                    s["local_pack"].append({"rank": i, "url": url, "domain": dm, "title": title})
                    rows.append([kw, loc, i, url or "", dm, f"local_pack ({title})", date, source])
                    pack_counter[(dm, title)] += 1
                    if "synergy" in (title or "").lower() or "synergyrehabilitation" in dm:
                        s["synergy_pack"].append(i)
            elif t == "ai_overview":
                s["aio_text"] = it.get("overview")
                for i, src_ in enumerate(it.get("sources", []) or [], 1):
                    url = src_.get("url")
                    dm = dom(url) if url else ""
                    s["aio_sources"].append({"rank": i, "url": url, "domain": dm, "title": src_.get("title")})
                    rows.append([kw, loc, i, url or "", dm, "ai_overview_source", date, source])
                    aio_counter[dm] += 1
            elif t == "people_also_ask":
                for q in it.get("searches", []) or []:
                    s["paa"].append(q)
                    rows.append([kw, loc, it.get("rank_absolute"), "", "", f"people_also_ask: {q}", date, source])
            elif t == "related_searches":
                for q in it.get("searches", []) or []:
                    if q in s.setdefault("related", []):
                        continue
                    s["related"].append(q)
                    rows.append([kw, loc, it.get("rank_absolute"), "", "", f"related_search: {q}", date, source])
            else:
                rows.append([kw, loc, it.get("rank_absolute"), it.get("url") or "", dom(it.get("url") or ""), t, date, source])
        summary[f"{kw} | {loc}"] = s
    pending = json.load(open(os.path.join(src, "pending_tasks.json"))) if os.path.exists(os.path.join(src, "pending_tasks.json")) else []
    for pt in pending:
        rows.append([pt["keyword"], LOC_NAMES.get(pt["location_id"], str(pt["location_id"])), "Not Available", "Not Available", "Not Available",
                     "not_collected (SE Ranking task still 'processing' at report time)", pt["added"][:10],
                     f"SE Ranking task {pt['task_id']} (getSerpTaskAdvancedResults returned status processing)"])
    rows.sort(key=lambda r: (r[1], r[0], 0 if r[5].startswith("local_pack") else (1 if r[5] == "organic" else 2), int(r[2]) if str(r[2]).isdigit() else 99))
    with open(out_csv, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["keyword", "location", "rank", "url", "domain", "serp_feature", "date", "source"])
        w.writerows(rows)
    agg = {
        "organic_top10_domain_counts": dom_counter.most_common(),
        "domain_best_rank": dom_best,
        "domain_keywords": {k: sorted(v) for k, v in dom_kw.items()},
        "domain_urls": {k: sorted(v) for k, v in dom_urls.items()},
        "local_pack_counts": [[a, b, c] for (a, b), c in pack_counter.most_common()],
        "aio_source_counts": aio_counter.most_common(),
    }
    with open(out_json, "w") as f:
        json.dump({"serps": summary, "aggregate": agg}, f, indent=1)
    print(f"files parsed: {len(summary)}; csv rows: {len(rows)}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
