import glob, json, os, sys, re
TASKS = {
 ("worksafebc physiotherapy surrey",3518):264762175, ("wcb physio surrey",3518):264764602, ("workplace injury physiotherapy surrey",3518):264764605,
 ("worksafebc physiotherapy vancouver",3536):264766645, ("wcb physio vancouver",3536):264766648, ("workplace injury physiotherapy vancouver",3536):264766651,
 ("worksafebc physiotherapy burnaby",3245):264766996, ("wcb physio burnaby",3245):264766999, ("workplace injury physiotherapy burnaby",3245):264767002,
 ("worksafebc physiotherapy richmond",3473):264767332, ("wcb physio richmond",3473):264767335, ("workplace injury physiotherapy richmond",3473):264767338,
 ("worksafebc physiotherapy langley",3371):264767635, ("wcb physio langley",3371):264767638, ("workplace injury physiotherapy langley",3371):264767641,
 ("worksafebc physiotherapy abbotsford",3209):264767773, ("wcb physio abbotsford",3209):264767776, ("workplace injury physiotherapy abbotsford",3209):264767779,
 ("worksafebc physiotherapy new westminster",3413):264768130, ("wcb physio new westminster",3413):264768133, ("workplace injury physiotherapy new westminster",3413):264768136,
 ("worksafebc physiotherapy delta",3302):264768217, ("wcb physio delta",3302):264768220, ("workplace injury physiotherapy delta",3302):264768223,
 ("worksafebc physiotherapy",3536):264768352, ("wcb physiotherapy near me",3536):264768355,
}
src="/root/.claude/projects/-home-user-synergy-availability/7fb27b37-db08-5b4c-bf1d-e36db1a2ed16/tool-results"
dst="/home/user/synergy-availability/worksafe-seo/research/08-competitor-source"
for p in glob.glob(os.path.join(src,"*")):
    try:
        d=json.load(open(p))
    except Exception:
        continue
    if not isinstance(d,dict) or "request_metadata" not in d: continue
    md=d["request_metadata"]
    tid=TASKS.get((md["keyword"],md["location_id"]))
    if not tid: print("unmapped",md["keyword"],md["location_id"]); continue
    out=os.path.join(dst,f"serp_{tid}.json")
    if not os.path.exists(out):
        json.dump(d,open(out,"w"))
        print("saved",tid,md["keyword"])
have={int(os.path.basename(f)[5:-5]) for f in glob.glob(os.path.join(dst,"serp_*.json"))}
print("missing:",[ (k,v) for k,v in TASKS.items() if v not in have])
