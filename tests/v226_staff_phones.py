# v2.26: staff WhatsApp numbers (add assistant, set a member's number, my own number, reset → send on WhatsApp)
# and the iPhone bottom-bar guard (bar hides while the keyboard is up). Demo mode.
import sys; sys.path.insert(0,'.')
from playwright.sync_api import sync_playwright
import hook
B="http://localhost:8765/beta/admin/"
R=[]
def ok(n,c,x=""): R.append((n,c)); print(("PASS" if c else "FAIL"),n,("· "+str(x)) if x else "")
def team(pg):
    pg.evaluate("(()=>{const b=[...document.querySelectorAll('[data-act]')].find(x=>x.dataset.act==='me'||x.dataset.act==='profile');b&&b.click()})()"); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('[data-act=team]').click()"); pg.wait_for_timeout(700)
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
    ctx.add_init_script("localStorage.setItem('winga.how','1');localStorage.setItem('niagize.inst','1')")
    hook.install(ctx,"http://localhost:8765/beta/"); pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    wa=[]; pg.expose_function("__wa",lambda n,m: wa.append((n,m)))
    pg.goto(B+"?demo"); pg.wait_for_timeout(2500); pg.evaluate("Winga.openWa=function(n,m){window.__wa(n,m)}")
    # my own number from the profile
    pg.evaluate("(()=>{const b=[...document.querySelectorAll('[data-act]')].find(x=>x.dataset.act==='me'||x.dataset.act==='profile');b&&b.click()})()"); pg.wait_for_timeout(400)
    ok("P1 Profile has 'Namba yangu ya WhatsApp'",pg.locator("[data-act=myPhone]").count()==1)
    pg.click("[data-act=myPhone]"); pg.wait_for_timeout(300); pg.fill("#mp_wa","12"); pg.click("[data-act=saveStaffPhone]"); pg.wait_for_timeout(300)
    ok("P2 a short number is refused",pg.locator("#mp_err").inner_text().strip()!="")
    pg.fill("#mp_wa","712 345 678"); pg.click("[data-act=saveStaffPhone]"); pg.wait_for_timeout(500)
    ok("P3 my number is saved and shown",pg.evaluate("Winga.ls('winga.demoPhone')")=="255712345678" and "+255712345678" in pg.locator("[data-act=myPhone]").inner_text(), pg.evaluate("Winga.ls('winga.demoPhone')"))
    pg.evaluate("document.querySelector('[data-act=team]').click()"); pg.wait_for_timeout(700)
    # add an assistant: number required
    pg.fill("#t_name","Asha Juma"); pg.fill("#t_email","asha@mfano.tz"); pg.fill("#t_pw","siri123"); pg.click("[data-act=addMember]"); pg.wait_for_timeout(400)
    ok("P4 adding an assistant asks for a WhatsApp number",pg.locator("#t_err").inner_text().strip()!="",pg.locator("#t_err").inner_text())
    pg.fill("#t_wa","755 111 222"); pg.click("[data-act=addMember]"); pg.wait_for_timeout(800)
    row=pg.locator(".member",has_text="Asha Juma")
    ok("P5 the new assistant shows @name and number",row.count()==1 and "+255755111222" in row.inner_text() and "@ashajuma" in row.inner_text(),row.inner_text().replace("\n"," | ") if row.count() else "")
    # change a member's number
    row.locator("[data-act=memberPhone]").click(); pg.wait_for_timeout(300); pg.fill("#mp_wa","755 999 000"); pg.click("[data-act=saveStaffPhone]"); pg.wait_for_timeout(500)
    ok("P6 an owner can change an assistant's number","+255755999000" in pg.locator(".member",has_text="Asha Juma").inner_text())
    # reset → send on WhatsApp
    pg.locator(".member",has_text="Asha Juma").locator("[data-act=resetMember]").click(); pg.wait_for_timeout(300); pg.fill("#r_pw","mpya4567"); pg.click("[data-act=saveReset]"); pg.wait_for_timeout(500)
    ok("P7 after a reset, 'Mtumie kwa WhatsApp' appears",pg.locator("[data-act=resetSend]").count()==1)
    pg.click("[data-act=resetSend]"); pg.wait_for_timeout(300)
    ok("P8 the message goes to the assistant's number with the password",bool(wa) and wa[-1][0]=="255755999000" and "mpya4567" in wa[-1][1] and "@ashajuma" in wa[-1][1],wa[-1] if wa else "")
    # bottom bar guard
    pg.evaluate("document.documentElement.classList.add('kb')"); pg.wait_for_timeout(100)
    hid=pg.evaluate("(()=>{const n=document.querySelector('nav.tabs');return !n||getComputedStyle(n).display==='none'})()")
    pg.evaluate("document.documentElement.classList.remove('kb')"); pg.wait_for_timeout(100)
    shown=pg.evaluate("(()=>{const n=document.querySelector('nav.tabs');return !n||getComputedStyle(n).display!=='none'})()")
    ok("P9 the bottom bar hides while the keyboard is up and comes back",hid and shown)
    ok("P10 no page errors",not errs,errs[:2])
    b.close()
n=sum(1 for _,c in R if c); print(f"{n} / {len(R)}")
