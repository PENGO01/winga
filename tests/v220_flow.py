from playwright.sync_api import sync_playwright
import v218_hook as hook
B="http://localhost:8765/beta/"
R=[]
def ok(name,cond,extra=""):
    R.append((name,bool(cond))); print(("PASS " if cond else "FAIL ")+name+(" · "+str(extra) if extra else ""))
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,has_touch=True,is_mobile=True)
    ctx.add_init_script("window.__opened=[];window.open=function(u){window.__opened.push(u);return {};};")
    hook.install(ctx,B); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    codes=pg.evaluate("""(async()=>{var ps=(await Winga.db.listProducts()).filter(x=>x.price);var out=[];var nm=['Neema','Baraka','Zuhura','Musa'];for(var i=0;i<4;i++){var r=await Winga.db.createOrder([{id:ps[i].id,qty:1}],'fasta',null,nm[i],'2557650000'+(20+i),'Kariakoo');out.push(r.code);__T.addMy(r.code);}localStorage.setItem('niagize.guest',JSON.stringify({wa:'255765000020'}));return out;})()""")
    A,Bc,C,D=codes
    pg.goto(B+"admin/?demo"); pg.wait_for_timeout(2000)
    pg.evaluate(f"""(async()=>{{for(const c of ['{Bc}','{C}','{D}'])await Winga.db.setOrder(c,'invoiced',{{fee:2000}});await Winga.db.setOrder('{D}','paid',{{}});}})()""")
    pg.evaluate("__T.reloadOrders()"); pg.wait_for_timeout(600)
    pg.evaluate("""(()=>{var e=document.createElement('button');e.dataset.tab='orders';document.body.appendChild(e);e.click();})()"""); pg.wait_for_timeout(800)
    tabs=pg.evaluate("[...document.querySelectorAll('.ofchips .chip')].map(x=>x.innerText.replace(/\\n/g,' '))")
    ok("O1 three order tabs: Mpya · Inafanyiwa kazi · Zimekamilika",len(tabs)==3 and tabs[0].startswith("Mpya") and tabs[1].startswith("Inafanyiwa") and tabs[2].startswith("Zimekamilika"),tabs)
    ok("O2 no sub-filter row",not pg.evaluate("!!document.querySelector('.subchips')"))
    pg.evaluate("document.querySelector('[data-act=ofilter][data-f=work]').click()"); pg.wait_for_timeout(400)
    rows=pg.evaluate("[...document.querySelectorAll('.oc')].map(x=>x.dataset.code+' '+x.querySelector('.onx').innerText)")
    ok("O3 Inafanyiwa kazi = invoices sent; paid (Tuma mzigo) ahead of waiting",len(rows)==3 and "Tuma mzigo" in rows[0],rows)
    for _ in range(3):
        if pg.evaluate("!!document.querySelector('.hd [data-act=back]')"): pg.evaluate("[...document.querySelectorAll('.hd [data-act=back]')].pop().click()"); pg.wait_for_timeout(300)
    pg.screenshot(path="/tmp/v220-boss_tabs.png")
    pg.fill("#oq","zuhura"); pg.wait_for_timeout(500)
    r1=pg.evaluate("[...document.querySelectorAll('.oc')].map(x=>x.dataset.code)")
    pg.fill("#oq","0765000020"); pg.wait_for_timeout(500)
    r2=pg.evaluate("[...document.querySelectorAll('.oc')].map(x=>x.dataset.code)")
    ok("O4 search finds by customer name and by phone (0… format)",r1==[C] and r2==[A],(r1,r2))
    pg.fill("#oq",""); 
    # shop side
    pg.goto(B+"?demo"); pg.wait_for_timeout(2500)
    pid=pg.evaluate("(async()=>(await Winga.db.listProducts()).find(x=>x.price).id)()")
    pg.evaluate(f"__T.open('product',{{id:'{pid}'}})"); pg.wait_for_timeout(600)
    lbl=pg.evaluate("document.querySelector('[data-mode=cart]').innerText.trim()")
    ok("P1 product page cart button reads Ongeza",lbl=="Ongeza",lbl)
    pg.screenshot(path="/tmp/v220-shop_product2.png")
    pg.goto(B+"?demo"); pg.wait_for_timeout(2000)
    pg.evaluate(f"__T.openOrder('{Bc}')"); pg.wait_for_timeout(1000)
    order=pg.evaluate("(()=>{var a=document.querySelector('.invrow'),b=document.querySelector('.paycard');return a&&b&&(a.compareDocumentPosition(b)&4)?'inv-first':'no'})()")
    ok("P2 invoice picture sits above the payment card",order=="inv-first")
    ok("P3 payment numbers on one card",pg.evaluate("document.querySelectorAll('.paycard .payrow').length")>=1)
    pg.screenshot(path="/tmp/v220-shop_invoiced.png",full_page=True)
    # Mimi: open orders with actions
    pg.goto(B+"?demo"); pg.wait_for_timeout(1500)
    pg.evaluate("""(()=>{var e=document.createElement('button');e.dataset.tab='me';document.body.appendChild(e);e.click();})()"""); pg.wait_for_timeout(2500)
    mo=pg.evaluate("document.querySelectorAll('.meopen .ol').length")
    btns=pg.evaluate("[...document.querySelectorAll('.meopen .olfoot .btn')].map(x=>x.innerText.trim())")
    ok("P4 Mimi shows open orders with the next step",mo>=3,mo)
    ok("P5 one-tap actions: Lipa sasa and Nimepokea",("Lipa sasa" in btns) and ("Nimepokea" in btns),btns)
    pg.screenshot(path="/tmp/v220-shop_mimi.png",full_page=True)
    ok("errors none",not errs,errs[:3])
    b.close()
print(sum(1 for r in R if r[1]),"/",len(R))
