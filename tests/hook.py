import re
HOOK_B="window.__T={reloadOrders:reloadOrders,get S(){return S},get O(){return O},set O(v){O=v},openOrder:openOrder,moveOrder:moveOrder,draw:draw};\n})();"
HOOK_S="window.__T={get HIST(){return HIST},addMy:function(c){MYORDERS.unshift(c);save(\"niagize.myorders\",MYORDERS);},get S(){return S},openOrder:openOrder,open:open,top:top,draw:draw,makeCard:makeCard,get PING(){return PING}};\n})();"
def install(ctx,base):
    def h(route,req,hook):
        r=route.fetch(); body=r.text()
        i=body.rfind("})();"); body=body[:i]+hook+body[i+5:]
        route.fulfill(response=r,body=body)
    ctx.route(base+"admin/?demo",lambda rt,rq:h(rt,rq,HOOK_B))
    ctx.route(base+"admin/",lambda rt,rq:h(rt,rq,HOOK_B))
    ctx.route(re.compile(re.escape(base)+r"(\?demo.*)?$"),lambda rt,rq:h(rt,rq,HOOK_S))
