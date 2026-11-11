# v2.25: forgot password (Boss app sign-in link, customer reset in Team, Super Admin resets Boss). Demo mode.
import sys; sys.path.insert(0,'.')
from playwright.sync_api import sync_playwright
import hook
B="http://localhost:8765/beta/admin/"
res=[]
def ok(n,c,x=""): res.append(("PASS" if c else "FAIL")+" "+n+(" · "+str(x) if x else ""))
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=2)
    ctx.add_init_script("localStorage.setItem('winga.how','1');localStorage.setItem('niagize.inst','1')")
    hook.install(ctx,"http://localhost:8765/beta/"); pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e: errs.append(str(e)))
    wa=[]; pg.expose_function("__wa",lambda n,m: wa.append((n,m)))
    pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    pg.evaluate("Winga.openWa=function(n,m){window.__wa(n,m)}")
    # open team
    pg.evaluate("document.querySelector('[data-act=team]')?document.querySelector('[data-act=team]').click():null")
    if not pg.locator("[data-act=rcust]").count():
        pg.evaluate("(()=>{const b=[...document.querySelectorAll('[data-act]')].find(x=>x.dataset.act==='me'||x.dataset.act==='profile');b&&b.click()})()"); pg.wait_for_timeout(400)
        pg.evaluate("document.querySelector('[data-act=team]').click()")
    pg.wait_for_timeout(600)
    ok("F1 Team shows the customer reset row",pg.locator("[data-act=rcust]").count()==1)
    pg.click("[data-act=rcust]"); pg.wait_for_timeout(400)
    pw=pg.input_value("#rc_pw"); ok("F2 new password pre-filled (8 chars)",len(pw)==8,pw)
    pg.click("[data-act=saveRcust]"); pg.wait_for_timeout(300)
    ok("F3 empty name is refused",pg.locator("#rc_err").inner_text().strip()!="",pg.locator("#rc_err").inner_text())
    pg.fill("#rc_login","hakuna"); pg.click("[data-act=saveRcust]"); pg.wait_for_timeout(400)
    ok("F4 unknown customer says not found",pg.locator("#rc_err").inner_text().strip()!="" ,pg.locator("#rc_err").inner_text())
    pg.fill("#rc_login","@juma"); pg.click("[data-act=saveRcust]"); pg.wait_for_timeout(500)
    ok("F5 success shows the new password",pg.locator("[data-act=rcSend]").count()==1 and pw in pg.locator(".sheet, body").first.inner_text())
    pg.screenshot(path="/tmp/rc_done.png")
    pg.click("[data-act=rcSend]"); pg.wait_for_timeout(300)
    ok("F6 WhatsApp message has the password and @username",bool(wa) and pw in wa[-1][1] and "@juma" in wa[-1][1],wa[-1][1][:90] if wa else "")
    # super admin sees reset on the boss row
    pg.evaluate("localStorage.setItem('winga.demoRole','super_admin')"); pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    pg.evaluate("(()=>{const b=[...document.querySelectorAll('[data-act]')].find(x=>x.dataset.act==='me'||x.dataset.act==='profile');b&&b.click()})()"); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('[data-act=team]')&&document.querySelector('[data-act=team]').click()"); pg.wait_for_timeout(700)
    ok("F7 Super Admin can reset the Boss",pg.locator(".member [data-act=resetMember]").count()>=1)
    pg.evaluate("localStorage.setItem('winga.demoRole','boss')"); pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    pg.evaluate("(()=>{const b=[...document.querySelectorAll('[data-act]')].find(x=>x.dataset.act==='me'||x.dataset.act==='profile');b&&b.click()})()"); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelector('[data-act=team]')&&document.querySelector('[data-act=team]').click()"); pg.wait_for_timeout(700)
    ok("F8 Boss cannot reset themselves (no key on own row)",pg.locator(".member [data-act=resetMember]").count()==0)
    # sign-in screen forgot link (signed out)
    ctx2=b.new_context(viewport={'width':390,'height':844}); hook.install(ctx2,"http://localhost:8765/beta/"); p2=ctx2.new_page(); p2.on("pageerror",lambda e: errs.append(str(e)))
    p2.goto(B); p2.wait_for_timeout(3000)
    ok("F9 Boss sign-in shows 'Umesahau neno la siri?'",p2.locator("[data-act=forgotStaff]").count()==1, p2.locator("[data-act=forgotStaff]").inner_text() if p2.locator("[data-act=forgotStaff]").count() else "")
    p2.screenshot(path="/tmp/login_forgot.png")
    ok("F10 no page errors",not errs,errs[:2])
    b.close()
print("\n".join(res)); n=sum(1 for r in res if r.startswith("PASS")); print(f"{n} / {len(res)}")
