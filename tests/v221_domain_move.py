from playwright.sync_api import sync_playwright
import os
ROOT="/home/claude/winga"
def serve(route):
    path=route.request.url.split("pengo01.github.io/winga",1)[1].split("?")[0].split("#")[0]
    if path.endswith("/"): path+="index.html"
    f=ROOT+path
    if os.path.isfile(f): route.fulfill(path=f)
    else: route.fulfill(status=404,body="nf")
with sync_playwright() as p:
    b=p.chromium.launch(); res=[]
    for app in (False,True):
        ctx=b.new_context()
        if app: ctx.add_init_script("Object.defineProperty(navigator,'standalone',{get:()=>true})")
        ctx.route("https://pengo01.github.io/winga/**",serve)
        hits=[]; ctx.route("https://niagize.tz/**",lambda r: (hits.append(r.request.url), r.fulfill(body="moved")))
        ctx.route(lambda u: not u.startswith("https://pengo01.github.io") and not u.startswith("https://niagize.tz"), lambda r: r.abort())
        pg=ctx.new_page()
        for u in ["https://pengo01.github.io/winga/beta/admin/o.html#NK-ABCDE","https://pengo01.github.io/winga/beta/?o=NK-1#o-NK-1","https://pengo01.github.io/winga/admin/"]:
            hits.clear()
            try: pg.goto(u,wait_until="domcontentloaded",timeout=8000); pg.wait_for_timeout(500)
            except Exception as e: pass
            bar=pg.evaluate("[...document.querySelectorAll('a[href^=\"https://niagize.tz\"]')].map(a=>a.href)[0]||''") if app else ""
            print(("APP " if app else "WEB ")+u.split('/winga')[1]," -> ",(hits[0] if hits else bar or "none"))
        ctx.close()
    b.close()
