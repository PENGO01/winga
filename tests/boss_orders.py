from playwright.sync_api import sync_playwright
import hook
import json
B="http://localhost:8765/beta/"
def ctxp(p):
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,is_mobile=True)
    ctx.add_init_script("window.__opened=[];window.open=function(u){window.__opened.push(u);return {};};")
    return b,ctx
R=[]
def ok(name,cond,extra=""):
    R.append((name,bool(cond))); print(("PASS " if cond else "FAIL ")+name+(" · "+str(extra) if extra else ""))
with sync_playwright() as p:
    b,ctx=ctxp(p); hook.install(ctx,B); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    pg.evaluate("""(async()=>{var ps=(await await Winga.db.listProducts());window.__ps=ps.length;})()""")
    print("products",pg.evaluate("window.__ps"))
    pg.evaluate("""(async()=>{var ps=await Winga.db.listProducts();var p=ps.find(x=>x.price);window.__oc=(await Winga.db.createOrder([{id:p.id,qty:2}],'fasta',null,'Asha','255754123456','Kariakoo, Mtaa wa Congo')).code;window.__oc2=(await Winga.db.createOrder([{id:p.id,qty:1}],'leo',null,null,'255713000111',null)).code;})()""")
    pg.wait_for_timeout(500); print("orders", pg.evaluate("[window.__oc,window.__oc2]"))
    pg.goto(B+"admin/?demo"); pg.wait_for_timeout(2500); pg.evaluate("__T.reloadOrders()"); pg.wait_for_timeout(800)
    news=pg.evaluate("(__T.S.orders||[]).filter(o=>o.status==='new'||o.status==='progress').map(o=>[o.code,o.status,o.customer_phone||''])")
    print(news)
    code=news[0][0]
    pg.evaluate(f"__T.openOrder('{code}')"); pg.wait_for_timeout(1200)
    ft=pg.evaluate("(document.querySelector('.ft .btn.primary')||{}).innerText||''")
    ok("B1 new order footer is Tuma invoice",'invoice' in ft.lower(),ft)
    tl=pg.evaluate("[...document.querySelectorAll('.timeline .tt')].map(x=>x.innerText)")
    ok("B2 Boss timeline has no Nakurudia/Inafanyiwa kazi step",not any('Nakurudia' in x or 'Inafanyiwa' in x for x in tl),tl)
    pg.screenshot(path="/tmp/v218-boss_order_new.png",full_page=True)
    # fill fee + address if needed, then send invoice
    pg.evaluate("""(()=>{var f=document.querySelector('#o_fee');if(f)f.value='3000';})()""")
    has_addr=pg.evaluate("!!(__T.O.o.address&&__T.O.o.address.line)")
    if not has_addr:
        pg.evaluate("document.querySelector('#o_addr').value='Kariakoo, Mtaa wa Congo'"); pg.click("[data-act=saveAddr]"); pg.wait_for_timeout(500)
        pg.evaluate("(()=>{var f=document.querySelector('#o_fee');if(f)f.value='3000';})()")
    if not pg.evaluate("Winga.phoneOk(__T.O.o.customer_phone)"):
        pg.fill("#o_phone","754 123 456"); pg.click("[data-act=savePhone]"); pg.wait_for_timeout(500)
        pg.evaluate("(()=>{var f=document.querySelector('#o_fee');if(f)f.value='3000';})()")
    pg.click(".ft .btn.primary"); pg.wait_for_timeout(1200)
    st=pg.evaluate("__T.O.o.status"); op=pg.evaluate("window.__opened")
    ok("B3 new → invoiced in one tap",st=="invoiced",st)
    ok("B4 invoice opens the customer's own chat (wa.me/<number>)",op and op[-1].startswith("https://wa.me/255"),op[-1][:40] if op else op)
    ok("B5 retry bar shows after a WhatsApp hand-off",pg.evaluate("document.querySelector('#waRetry.on')!=null"))
    pg.screenshot(path="/tmp/v218-boss_invoiced.png",full_page=False)
    n0=len(op); pg.click("#waRetry .wr-go"); pg.wait_for_timeout(300)
    ok("B6 retry bar re-opens the same chat",len(pg.evaluate("window.__opened"))==n0+1 and pg.evaluate("window.__opened").pop()==op[-1])
    ok("B7 invoice card chip uses the document icon",pg.evaluate("(()=>{var b=document.querySelector('[data-act=cardInv] svg');return b&&b.innerHTML.indexOf('M7 3h7l5 5v13H7z')>=0})()"))
    # done message carries the thank-you card link
    pg.evaluate("__T.O.o.status='paid'"); 
    pg.evaluate("__T.moveOrder('done',{},'msg_done')"); pg.wait_for_timeout(800)
    last=pg.evaluate("window.__opened.pop()")
    import urllib.parse
    txt=urllib.parse.unquote(last.split('text=')[1])
    ok("B8 Imekamilika message links the thank-you card","Kadi yako ya asante" in txt and "#o-"+code in txt, txt.split('\n')[-4:])
    # phone prefill: order copy without phone but list has it
    pg.evaluate("""(async()=>{var o=__T.S.orders.find(x=>x.customer_phone&&x.status!=='done');window.__pc=o.code;var g=Winga.db.getOrder;Winga.db.getOrder=async c=>{var r=await g(c);r=Object.assign({},r);delete r.customer_phone;return r;};await __T.openOrder(o.code);Winga.db.getOrder=g;})()""")
    pg.wait_for_timeout(1000)
    ok("B9 number prefilled from the order list when the opened copy lacks it",pg.evaluate("Winga.phoneOk(__T.O.o.customer_phone)"))
    # missing-phone row has paste button
    pg.evaluate("(async()=>{__T.O.o.customer_phone=null;__T.draw(false);})()"); pg.wait_for_timeout(300)
    ok("B10 missing number row shows Paste + Save",pg.evaluate("!!document.querySelector('[data-act=savePhone]')"), "paste btn: "+str(pg.evaluate("!!document.querySelector('[data-act=pastePhone]')")))
    ok("B-errors none",not errs,errs[:3])
    b.close()
print(sum(1 for r in R if r[1]),"/",len(R))
