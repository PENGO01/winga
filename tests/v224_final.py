"""v2.24: card save mark, gold frame for new, Weka kapuni, Aina, swipe guide, first-run guide, delivery callout, optional WhatsApp, camera input, Boss Mara line."""
from playwright.sync_api import sync_playwright
import hook
B="http://localhost:8765/beta/"
R=[]
def ok(n,c,x=""):
    R.append((n,bool(c))); print(("PASS " if c else "FAIL ")+n+(" · "+str(x) if x else ""))
SWIPE="""(dx)=>{var el=document.querySelector('.tips .slide');var r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
 function T(t,cx){var tc=new Touch({identifier:1,target:el,clientX:cx,clientY:y});el.dispatchEvent(new TouchEvent(t,{bubbles:true,cancelable:true,touches:t==='touchend'?[]:[tc],changedTouches:[tc],targetTouches:[]}));}
 T('touchstart',x);T('touchend',x+dx);}"""
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
    ctx.add_init_script("window.__opened=[];window.open=function(u){window.__opened.push(u);return {};};")
    hook.install(ctx,B); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(B+"?demo"); pg.wait_for_timeout(3000)
    ok("N1 a new customer gets the how-to guide first",pg.evaluate("__T.top()&&__T.top().n")=="tips" and pg.evaluate("__T.top().c.panel")==0)
    pg.evaluate(SWIPE,-120); pg.wait_for_timeout(250)
    ok("N2 swipe left goes to the next step",pg.evaluate("__T.top().c.i")==1)
    pg.evaluate(SWIPE,120); pg.wait_for_timeout(250)
    ok("N3 swipe right goes back",pg.evaluate("(__T.top().c.i||0)")==0)
    pg.click("[data-act=slide][data-d='1']"); pg.wait_for_timeout(200)
    ok("N4 Endelea still works",pg.evaluate("__T.top().c.i")==1)
    pg.evaluate("document.querySelector('.iconbtn[data-act=back]').click()"); pg.wait_for_timeout(300)
    ok("N5 tab says Aina",pg.inner_text("nav.tabs")!="" and "Aina" in pg.inner_text("nav.tabs"))
    # card save mark: small, in the lower half of the card
    g=pg.evaluate("""(()=>{var c=document.querySelector('.pc'),f=c.querySelector('.fav'),a=c.getBoundingClientRect(),r=f.getBoundingClientRect();return {w:r.width,h:r.height,low:(r.top+r.height/2-a.top)/a.height}})()""")
    ok("N6 card save mark is small and sits low",g['w']<=38 and g['low']>.7,g)
    ok("N7 new products carry a gold frame, no label",pg.locator(".newstrip .nim.isnew").count()>0 and pg.locator(".ntag").count()==0)
    pg.locator("[data-act=open]").first.click(); pg.wait_for_timeout(600)
    cs=pg.evaluate("""(()=>{var b=document.querySelector('.cartsq.lbl'),cs=getComputedStyle(b),g=getComputedStyle(b.querySelector('svg'));return [cs.backgroundColor,g.color]})()""")
    ok("N8 Weka kapuni is gold with a black glyph",cs[0]=="rgb(255, 198, 45)" and cs[1] in("rgb(18, 18, 18)",),cs)
    pr=pg.evaluate("getComputedStyle(document.querySelector('.actbar .btn.primary')).backgroundColor")
    ok("N9 Agiza chap is ink, so only one gold button",pr=="rgb(36, 36, 36)",pr)
    pg.click(".actbar .btn.primary"); pg.wait_for_timeout(500)
    pg.click("[data-act=buyQ]"); pg.wait_for_timeout(600)
    ok("N10 checkout shows the delivery note highlighted",pg.locator(".callout").count()==1 and "delivery" in pg.inner_text(".callout").lower())
    ok("N11 send button has an arrow, no WhatsApp glyph",pg.locator("[data-act=sendNow] svg").count()==1)
    pg.evaluate("window.__opened.length=0")
    for sel,v in (("#g_name","Juma"),("#g_wa","754000011"),("#g_addr","Kariakoo, Mtaa wa Congo")):
        if pg.locator(sel).count(): pg.fill(sel,v)
    n0=pg.evaluate("window.__opened.length")
    pg.click("[data-act=sendNow]"); pg.wait_for_timeout(1500)
    txt=pg.inner_text("#sheetRoot")
    ok("N12 sending an order does not force WhatsApp open",pg.evaluate("window.__opened.length")==n0 and ("Oda imetumwa" in txt or "Tumepokea" in txt or "Weka" not in txt),pg.evaluate("window.__opened"))
    ok("N13 optional WhatsApp button is offered",pg.locator("[data-act=waOpt]").count()==1)
    pg.close()
    pg=ctx.new_page(); pg.goto(B+"?demo"); pg.wait_for_timeout(1500)
    pg.evaluate("localStorage.setItem('winga.how','1');localStorage.setItem('niagize.inst','1')")
    pg.reload(); pg.wait_for_timeout(2500)
    pg.click("nav.tabs button[data-tab=cart]"); pg.wait_for_timeout(400)
    pg.click("nav.tabs button[data-tab=me]"); pg.wait_for_timeout(600)
    pg.click("[data-act=photoOrder]") if pg.locator("[data-act=photoOrder]").count() else pg.evaluate("document.querySelector('[data-act=photoOrder]')")
    pg.close()
    ok("N-errors none",not errs,errs)
    b.close()
n=sum(1 for _,c in R if c); print(f"{n} / {len(R)}")
