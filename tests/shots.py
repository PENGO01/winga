from playwright.sync_api import sync_playwright
import hook,sys
B="http://localhost:8765/beta/";O="/tmp/claude-0/-home-claude/ff7cced3-8728-5437-8718-ac9192c01cd7/scratchpad/shots/"
with sync_playwright() as p:
    b=p.chromium.launch()
    for scheme in("light","dark"):
        ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,color_scheme=scheme)
        ctx.add_init_script("localStorage.setItem('winga.how','1');localStorage.setItem('niagize.inst','1')")
        hook.install(ctx,B);pg=ctx.new_page();pg.goto(B+"?demo");pg.wait_for_timeout(2500)
        pg.screenshot(path=O+scheme+"_home.png")
        pg.locator("[data-act=open]").first.click();pg.wait_for_timeout(700)
        pg.screenshot(path=O+scheme+"_product.png")
        ctx.close()
    b.close()
