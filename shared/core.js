/* Niagize Kariakoo core: words, helpers, theme, photos, and the data layer.
   Live mode uses Supabase (window.supabase from the CDN + window.WINGA_CONFIG).
   Example mode keeps everything in this browser so the apps can be tried before the database exists. */
(function () {
"use strict";
var W = window.Winga = {};
W.VERSION = "1.1.0";
W.UPDATED = { sw: "Okt 2026", en: "Oct 2026" };

/* ---------------- words ----------------
   One row per text: [key, screen, Kiswahili, English].
   Style: short, M-Pesa / Selcom tone. The same table feeds the translation Excel. */
W.STRINGS = [
 // common
 ["loading","Common","Inapakia…","Loading…"],
 ["save","Common","Hifadhi","Save"],
 ["cancel","Common","Ghairi","Cancel"],
 ["close","Common","Funga","Close"],
 ["back","Common","Rudi","Back"],
 ["del","Common","Futa","Delete"],
 ["yesDel","Common","Ndiyo, futa","Yes, delete"],
 ["no","Common","Hapana","No"],
 ["copied","Common","Imenakiliwa","Copied"],
 ["saved","Common","Imehifadhiwa","Saved"],
 ["share","Common","Shiriki","Share"],
 ["copy","Common","Nakili","Copy"],
 ["error","Common","Imeshindikana. Jaribu tena.","Failed. Try again."],
 ["pull","Common","Vuta kusasisha","Pull to refresh"],
 ["release","Common","Achia kusasisha","Release to refresh"],
 ["refreshing","Common","Inasasisha…","Refreshing…"],
 ["example","Common","MFANO","EXAMPLE"],
 ["offline","Common","Hakuna mtandao. Unaona bidhaa za mwisho.","Offline. Showing the last products."],
 ["place","Common","Kariakoo, Dar es Salaam","Kariakoo, Dar es Salaam"],
 ["count","Common","Bidhaa {n}","{n} products"],
 ["askPrice","Common","Uliza bei","Ask price"],
 ["soldout","Common","Imeisha","Sold out"],
 ["isNew","Common","Mpya","New"],
 ["added","Common","Imewekwa {a}","Added {a}"],
 ["agoToday","Common","leo","today"],
 ["agoYday","Common","jana","yesterday"],
 ["agoDays","Common","siku {n} zilizopita","{n} days ago"],
 ["all","Common","Zote","All"],
 ["category","Common","Aina","Category"],
 ["cat_viatu","Categories","Viatu","Shoes"],
 ["cat_nguo","Categories","Nguo","Clothes"],
 ["cat_electronics","Categories","Simu & Elektroniki","Phones & Electronics"],
 ["cat_urembo","Categories","Urembo","Beauty"],
 ["cat_nyumbani","Categories","Nyumbani","Home"],
 ["cat_begi","Categories","Mabegi","Bags"],
 ["cat_watoto","Categories","Watoto","Kids"],
 ["cat_nyingine","Categories","Nyingine","Other"],
 // customer shop
 ["searchPh","Shop","Tafuta bidhaa upendayo","Search products you like"],
 ["emptyShop","Shop","Bidhaa mpya zinakuja.","New products coming."],
 ["noMatch","Shop","Hakuna bidhaa hiyo. Jaribu neno jingine.","No match. Try another word."],
 ["exampleBanner","Shop","Duka la mfano.","Example shop."],
 ["notReady","Shop","Duka linaandaliwa. Oda zitafunguliwa hivi punde.","Shop being set up. Orders open soon."],
 ["details","Product","Maelezo","Details"],
 ["addCart","Product","Weka kwenye kapu","Add to basket"],
 ["updateCart","Product","Badili maelezo","Update note"],
 ["inCart","Product","Iko kwenye kapu","In your basket"],
 ["removeCart","Product","Ondoa","Remove"],
 ["notePh","Product","Saizi, rangi au swali lako","Size, colour or your question"],
 ["how_title","How to order","Jinsi ya kuagiza","How to order"],
 ["how1","How to order","Chagua bidhaa upendayo","Pick what you like"],
 ["how2","How to order","Bonyeza Tuma oda","Tap Send order"],
 ["how3","How to order","Tutahakiki oda yako","We confirm your order"],
 ["how4","How to order","Lipia, tukuletee mlangoni","Pay, we deliver to your door"],
 ["how_ok","How to order","Sawa","OK"],
 ["cart_title","Basket","Kapu lako","Your basket"],
 ["cart_n","Basket","Kapu · {n}","Basket · {n}"],
 ["cart_send","Basket","Tuma oda","Send order"],
 ["cart_total","Basket","Jumla","Total"],
 ["cart_plus","Basket","+ bei za kuuliza","+ prices to confirm"],
 ["cart_empty","Basket","Kapu ni tupu.","Your basket is empty."],
 ["cart_clear","Basket","Safisha kapu","Clear basket"],
 ["cart_sent","Basket","Umetuma? Safisha kapu","Sent? Clear basket"],
 ["wa_hello","Basket (WhatsApp)","Habari! Naomba oda hii:","Hello! I'd like to order:"],
 ["wa_note","Basket (WhatsApp)","Maelezo","Note"],
 ["wa_end","Basket (WhatsApp)","Naomba uthibitishe bei na upatikanaji.","Please confirm price and availability."],
 ["wa_one","Product share","Angalia hii Niagize Kariakoo:","Look at this on Niagize Kariakoo:"],
 // boss: sign in
 ["login","Boss · Sign in","Ingia","Sign in"],
 ["email","Boss · Sign in","Barua pepe","Email"],
 ["password","Boss · Sign in","Neno la siri","Password"],
 ["showPw","Boss · Sign in","Onyesha","Show"],
 ["hidePw","Boss · Sign in","Ficha","Hide"],
 ["wrongLogin","Boss · Sign in","Barua pepe au neno la siri si sahihi.","Wrong email or password."],
 ["accountHint","Boss · Sign in","Akaunti hutolewa na Super Admin.","Accounts come from the Super Admin."],
 ["notAdmin","Boss · Sign in","Akaunti hii haina ruhusa ya duka. Wasiliana na Super Admin.","This account can't manage the shop. Contact the Super Admin."],
 ["signOut","Boss · Settings","Toka","Log out"],
 // boss: navigation
 ["home","Boss · Menu","Nyumbani","Home"],
 ["addPhotos","Boss · Menu","Ongeza picha","Add photos"],
 ["products","Boss · Menu","Bidhaa","Products"],
 // boss: home
 ["haveN","Boss · Home","Una bidhaa","You have"],
 ["inShopN","Boss · Home","dukani","in the shop"],
 ["t_ending","Boss · Home","Zinaisha karibu","Ending soon"],
 ["t_hidden","Boss · Home","Zimefichwa","Hidden"],
 ["t_asked","Boss · Home","Zimeulizwa","Asked"],
 ["st_live","Boss · Home","Hai","Live"],
 ["st_pilot","Boss · Home","Majaribio","Pilot"],
 ["st_down","Boss · Home","Haipatikani","Down"],
 ["link_title","Boss · Home","Niagize Kariakoo link","Niagize Kariakoo link"],
 ["check_shop","Boss · Home","Cheki duka lako","See your shop"],
 ["shareText","Boss · Home","Bidhaa za Kariakoo, mlangoni kwako. Chagua hapa:","Kariakoo products, to your door. Pick here:"],
 ["boss_app","Boss · Sign in","Niagize Boss","Niagize Boss"],
 ["stillHere","Boss · Home","Bado ipo","Still here"],
 ["markSold","Boss · Home","Imeisha","Sold out"],
 ["mostAsked","Boss · Home","Zinazoulizwa zaidi","Most asked"],
 ["emptyHome","Boss · Home","Anza kwa kuongeza picha.","Start by adding photos."],
 ["steps_title","Boss · Discover","Hatua 3 za kufungua duka","3 steps to open the shop"],
 ["step1","Boss · Discover","Weka namba ya WhatsApp","Add WhatsApp number"],
 ["step1s","Boss · Discover","Oda zitakufikia hapa.","Orders reach you here."],
 ["step2","Boss · Discover","Weka bidhaa 3","Add 3 products"],
 ["step2s","Boss · Discover","WhatsApp: shika picha → Save, kisha Ongeza picha.","WhatsApp: hold a photo → Save, then Add photos."],
 ["step3","Boss · Discover","Shiriki link ya duka","Share the shop link"],
 ["step3s","Boss · Discover","Status ya WhatsApp au Instagram.","WhatsApp status or Instagram."],
 ["stepsDone","Boss · Discover","Duka liko tayari.","The shop is ready."],
 ["go","Boss · Discover","Anza","Start"],
 // boss: add product
 ["add_title","Boss · Add product","Ongeza bidhaa","Add product"],
 ["add_saved","Boss · Add product","{n} zimehifadhiwa","{n} saved"],
 ["photo_add","Boss · Add product","Picha","Photo"],
 ["photos_max","Boss · Add product","Hadi picha 3","Up to 3 photos"],
 ["name_ph","Boss · Add product","Jina la bidhaa","Product name"],
 ["price_ph","Boss · Add product","Bei","Price"],
 ["price_hint","Boss · Add product","Acha wazi kwa 'Uliza bei'","Leave empty for 'Ask price'"],
 ["desc_ph","Boss · Add product","Maelezo: saizi, rangi, ubora…","Details: size, colour, quality…"],
 ["add_more","Boss · Add product","Bidhaa nyingine","Another product"],
 ["add_done","Boss · Add product","Hifadhi, Maliza","Save & finish"],
 ["need_photo","Boss · Add product","Weka picha angalau moja.","Add at least one photo."],
 ["need_name","Boss · Add product","Weka jina la bidhaa.","Add a product name."],
 ["uploading","Boss · Add product","Inapakia {i}/{n}","Uploading {i}/{n}"],
 ["upload_fail","Boss · Add product","Imeshindwa kupakia: {x}","Upload failed: {x}"],
 ["savedN","Boss · Add product","Bidhaa {n} zimeingia dukani","{n} products are live"],
 // boss: product list
 ["list_title","Boss · Products","Bidhaa zilizopo","Your products"],
 ["f_hidden","Boss · Products","Zilizofichwa","Hidden"],
 ["filter_title","Boss · Products","Chuja kwa aina","Filter by category"],
 ["select","Boss · Products","Chagua","Select"],
 ["selectedN","Boss · Products","{n} zimechaguliwa","{n} selected"],
 ["edit_sel","Boss · Products","Badili","Edit"],
 ["daysLeft","Boss · Products","Siku {n}","{n} days"],
 ["lastDay","Boss · Products","Mwisho leo","Last day"],
 ["expired","Boss · Products","Muda umeisha","Expired"],
 ["hidden","Boss · Products","Imefichwa","Hidden"],
 ["asks","Boss · Products","Maombi {n}","{n} asks"],
 ["noProducts","Boss · Products","Hakuna bidhaa hapa.","No products here."],
 // boss: edit
 ["edit_title","Boss · Edit","Badili taarifa za bidhaa","Edit product details"],
 ["bulk_title","Boss · Edit","Badili bidhaa {n}","Edit {n} products"],
 ["col_item","Boss · Edit","Bidhaa","Product"],
 ["col_price","Boss · Edit","Bei","Price"],
 ["col_hide","Boss · Edit","Ficha","Hide"],
 ["confirmDel1","Boss · Edit","Futa bidhaa {n}?","Delete {n} products?"],
 ["confirmDel2","Boss · Edit","Una uhakika? Haiwezi kurudishwa.","Are you sure? This can't be undone."],
 ["refreshed","Boss · Edit","Itaonekana siku 24 zaidi","Shown 24 more days"],
 ["show","Boss · Edit","Onyesha","Show"],
 ["hide","Boss · Edit","Ficha","Hide"],
 // boss: settings
 ["set_title","Boss · Settings","Mipangilio","Settings"],
 ["role_super_admin","Boss · Settings","Super Admin","Super Admin"],
 ["role_boss","Boss · Settings","Boss","Boss"],
 ["lang","Boss · Settings","Lugha","Language"],
 ["theme","Boss · Settings","Mwonekano","Appearance"],
 ["th_device","Boss · Settings","Kifaa","Device"],
 ["th_light","Boss · Settings","Mwanga","Light"],
 ["th_dark","Boss · Settings","Giza","Dark"],
 ["wa_label","Boss · Settings","Namba ya WhatsApp","WhatsApp number"],
 ["pay_title","Boss · Settings","Namba za malipo","Payment numbers"],
 ["pay_add","Boss · Settings","Ongeza namba","Add number"],
 ["pay_num","Boss · Settings","Namba","Number"],
 ["pay_name","Boss · Settings","Jina la akaunti","Account name"],
 ["waFirst","Boss · Settings","Weka namba ya WhatsApp kwanza.","Add the WhatsApp number first."],
 ["system","Boss · Settings","Mfumo","System"],
 ["version","Boss · Settings","Toleo","Version"],
 ["updated","Boss · Settings","Imesasishwa","Updated"],
 ["status","Boss · Settings","Hali","Status"],
 ["reset_demo","Boss · Settings","Rudisha mifano","Reset examples"]
];
var STR = { sw: {}, en: {} };
W.STRINGS.forEach(function (r) { STR.sw[r[0]] = r[2]; STR.en[r[0]] = r[3]; });
W.CATS = ["viatu","nguo","electronics","urembo","nyumbani","begi","watoto","nyingine"];
W.PROVIDERS = ["M-PESA","AIRTEL MONEY","HALOPESA","MIXX BY YAS","CRDB","NMB","SELCOM"];
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
W.ls = ls;
W.lang = ls("winga.lang") || "sw";
W.setLang = function (l) { W.lang = l; ls("winga.lang", l); document.documentElement.lang = l; };
W.t = function (k, v) { var s = (STR[W.lang] || STR.sw)[k]; if (s == null) s = STR.sw[k] || k; if (v) for (var p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
document.documentElement.lang = W.lang;

/* ---------------- theme: device / light / dark ---------------- */
W.theme = ls("winga.theme") || "device";
W.applyTheme = function (th) {
  W.theme = th; ls("winga.theme", th);
  if (th === "device") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", th);
};
W.applyTheme(W.theme);

/* ---------------- helpers ---------------- */
W.$ = function (s, r) { return (r || document).querySelector(s); };
W.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
W.money = function (n) { return Math.round(+n || 0).toLocaleString("en-US"); };
W.parseMoney = function (v) { if (v == null || v === "") return null; var s = String(v).toLowerCase().replace(/tsh|tzs|sh/g, "").trim(); var k = /k$/.test(s); s = s.replace(/[^0-9.]/g, ""); if (!s) return null; var n = parseFloat(s); return Math.round(k ? n * 1000 : n); };
W.waPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };
W.DAY = 864e5; W.SHOW_DAYS = 24;
W.daysLeft = function (p) { return W.SHOW_DAYS - Math.floor((Date.now() - new Date(p.refreshed_at).getTime()) / W.DAY); };
W.ago = function (iso) { var d = Math.floor((Date.now() - new Date(iso).getTime()) / W.DAY); return d <= 0 ? W.t("agoToday") : d === 1 ? W.t("agoYday") : W.t("agoDays", { n: d }); };
W.isNew = function (p) { return Date.now() - new Date(p.created_at).getTime() < W.DAY; };
W.toast = function (m) { var r = document.getElementById("toastRoot"); if (!r) return; r.innerHTML = '<div class="toast" role="status">' + W.esc(m) + "</div>"; clearTimeout(W.toast._t); W.toast._t = setTimeout(function () { r.innerHTML = ""; }, 2400); };
W.copy = function (text, fallbackEl) { return navigator.clipboard.writeText(text).then(function(){ W.toast(W.t("copied")); }, function(){ if (fallbackEl) { var r = document.createRange(); r.selectNodeContents(fallbackEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } }); };
W.uid = function () { return (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); };
W.standalone = function () { try { return navigator.standalone === true || matchMedia("(display-mode: standalone)").matches; } catch (e) { return false; } };

/* pull to refresh: drag down at the top of the page, release to run onRefresh() */
W.pullToRefresh = function (indicator, onRefresh) {
  var startY = null, dist = 0, busy = false;
  function label(txt, spin) { indicator.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/></svg>' + W.esc(txt); indicator.classList.toggle("spin", !!spin); }
  addEventListener("touchstart", function (e) { if (busy || window.scrollY > 0 || document.querySelector(".scrim")) { startY = null; return; } startY = e.touches[0].clientY; dist = 0; }, { passive: true });
  addEventListener("touchmove", function (e) { if (startY == null) return; dist = e.touches[0].clientY - startY; if (dist > 12) { indicator.classList.add("on"); label(dist > 70 ? W.t("release") : W.t("pull")); } }, { passive: true });
  addEventListener("touchend", async function () { if (startY == null) return; startY = null; if (dist > 70) { busy = true; label(W.t("refreshing"), true); try { await onRefresh(); } catch (e) {} busy = false; } indicator.classList.remove("on", "spin"); dist = 0; });
};

/* ---------------- photos ---------------- */
W.MAX_PHOTOS = 3;
W.shrink = function (file, max, q) {
  return new Promise(function (res, rej) {
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () {
      var sc = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
      var c = document.createElement("canvas"); c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(function (b) { b ? res(b) : rej(new Error("encode")); }, "image/jpeg", q || 0.78);
    };
    im.onerror = function () { URL.revokeObjectURL(url); rej(new Error("decode")); };
    im.src = url;
  });
};
W.blobToData = function (b) { return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.readAsDataURL(b); }); };
W.prepPhotos = async function (files) { var out = []; for (var i = 0; i < files.length; i++) out.push({ full: await W.shrink(files[i], 1080, .8), thumb: await W.shrink(files[i], 400, .72) }); return out; };

/* ---------------- data layer ---------------- */
var C = window.WINGA_CONFIG || {};
var live = !!(C.url && C.anonKey && window.supabase && window.supabase.createClient);
var sb = live ? window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, storageKey: "winga.auth" } }) : null;
W.mode = live ? "live" : "demo";
W.stage = C.stage || "pilot";   // "production" shows green, "pilot" yellow
function pub(path) { if (!path) return ""; if (/^data:|^https?:/.test(path)) return path; return C.url + "/storage/v1/object/public/products/" + path; }
function decorate(p) {
  p.thumbUrl = pub((p.thumbs && p.thumbs[0]) || (p.images && p.images[0]));
  p.imageUrls = (p.images || []).map(pub);
  p.thumbUrls = (p.thumbs && p.thumbs.length ? p.thumbs : p.images || []).map(pub);
  if (p.product_private) delete p.product_private;
  return p;
}
function cacheSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cacheGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }

/* --- example mode store --- */
var DEMO_KEY = "winga.demo.v2";
function demoLoad() { var d = cacheGet(DEMO_KEY); if (d && d.products) return d; d = demoSeed(); demoSave(d); return d; }
function demoSave(d) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch (e) { W._demoMem = d; } }
function demoGet() { return W._demoMem || demoLoad(); }
function sample(label, bg, fg, shape) {
  var c = document.createElement("canvas"); c.width = c.height = 600; var x = c.getContext("2d");
  x.fillStyle = bg; x.fillRect(0, 0, 600, 600); x.fillStyle = fg;
  if (shape === "shoe") { x.beginPath(); x.moveTo(90,380); x.quadraticCurveTo(100,265,210,250); x.lineTo(310,312); x.quadraticCurveTo(460,325,510,400); x.lineTo(510,440); x.lineTo(90,440); x.closePath(); x.fill(); x.fillStyle="rgba(0,0,0,.25)"; x.fillRect(90,428,420,16); }
  else if (shape === "phone") { x.beginPath(); x.roundRect ? x.roundRect(200,100,200,380,30) : x.rect(200,100,200,380); x.fill(); x.fillStyle="rgba(255,255,255,.35)"; x.fillRect(220,135,160,300); }
  else if (shape === "cloth") { for (var i=0;i<7;i++){ x.fillStyle = i%2?fg:"rgba(255,255,255,.55)"; x.fillRect(100,100+i*52,400,52);} x.fillStyle="rgba(0,0,0,.18)"; for (var j=0;j<6;j++){ x.beginPath(); x.arc(160+j*56,126+j*52,15,0,7); x.fill(); } }
  else if (shape === "bag") { x.beginPath(); x.roundRect ? x.roundRect(140,220,320,250,30) : x.rect(140,220,320,250); x.fill(); x.strokeStyle=fg; x.lineWidth=20; x.beginPath(); x.arc(300,225,86,Math.PI,0); x.stroke(); }
  else if (shape === "bottle") { x.beginPath(); x.roundRect ? x.roundRect(240,180,120,300,26) : x.rect(240,180,120,300); x.fill(); x.fillRect(270,120,60,70); }
  else { x.beginPath(); x.arc(300,290,140,0,7); x.fill(); }
  x.fillStyle = "rgba(18,40,60,.82)"; x.fillRect(0, 520, 600, 80); x.fillStyle = "#fff"; x.font = "600 30px 'IBM Plex Sans', sans-serif"; x.fillText(label, 24, 570);
  x.fillStyle = "#F6B41C"; x.font = "600 18px 'IBM Plex Mono', monospace"; x.fillText(W.t("example"), 480, 570);
  return c.toDataURL("image/jpeg", 0.8);
}
function demoSeed() {
  var now = Date.now(), D = W.DAY;
  var defs = [
    ["Raba brown, Air style", "viatu", 35000, "Ngozi laini, soli imara. Saizi 40–44.", now - 2*36e5, "#C9A27E", "#6B3E1E", "shoe"],
    ["Sandals za kike", "viatu", 18000, "Nyeusi na beige. Saizi 37–40.", now - D, "#E9D7C5", "#2B2B2B", "shoe"],
    ["Tecno Spark 20, 128GB", "electronics", null, "Mpya kwenye boksi.", now - 2*D, "#D3DEE8", "#1C3A54", "phone"],
    ["Chaja Type-C 33W", "electronics", 12000, "Inachaji haraka.", now - 3*36e5, "#E7ECEF", "#3B4A57", "phone"],
    ["Kitenge cha Kongo, doti 1", "nguo", 22000, "Pamba halisi.", now - 3*D, "#F6C85F", "#1F6F5C", "cloth"],
    ["Begi la mgongoni", "begi", 27000, "Laptop ya 15\" inaingia.", now - 21*D, "#B9C9B0", "#2F4B32", "bag"],
    ["Mafuta ya nywele, 250ml", "urembo", 9500, "", now - 10*D, "#F2D7E0", "#8A2E4E", "bottle"],
    ["Shati la kitambaa", "nguo", 25000, "M, L, XL.", now - 6*D, "#E4EEF7", "#1F5C8F", "cloth"]
  ];
  return { shop: { name: "Niagize Kariakoo", tagline: "Bidhaa za Kariakoo, mlangoni kwako", whatsapp: "255700000000", payments: [{ provider: "M-PESA", number: "5512 3487", name: "BOSS DEUS" }] },
    products: defs.map(function (d, i) { var img = sample(d[0].split(",")[0], d[5], d[6], d[7]);
      return { id: "demo-" + i, created_at: new Date(d[4]).toISOString(), refreshed_at: new Date(d[4]).toISOString(), name: d[0], category: d[1], price: d[2], description: d[3], images: [img], thumbs: [img], status: i === 7 ? "hidden" : "active", asks: [3,1,6,2,4,0,1,2][i], ex: true }; }) };
}
async function uploadPhotos(id, photos, startIndex) {
  var images = [], thumbs = [];
  for (var j = 0; j < photos.length; j++) {
    if (!live) { images.push(await W.blobToData(photos[j].full)); thumbs.push(await W.blobToData(photos[j].thumb)); continue; }
    var base = id + "/" + (startIndex + j) + "-" + Date.now().toString(36);
    var u1 = await sb.storage.from("products").upload(base + ".jpg", photos[j].full, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false }); if (u1.error) throw u1.error;
    var u2 = await sb.storage.from("products").upload(base + "-t.jpg", photos[j].thumb, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false }); if (u2.error) throw u2.error;
    images.push(base + ".jpg"); thumbs.push(base + "-t.jpg");
  }
  return { images: images, thumbs: thumbs };
}
function isStored(x) { return x && !/^data:|^https?:/.test(x); }

/* --- public API --- */
W.db = {
  live: live,
  async getShop() {
    if (!live) return demoGet().shop;
    var r = await sb.from("shop").select("*").eq("id", 1).maybeSingle();
    if (r.error) { var c = cacheGet("winga.cache.shop"); if (c) { W.offline = true; return c; } throw r.error; }
    cacheSet("winga.cache.shop", r.data); W.offline = false; return r.data || {};
  },
  async saveShop(patch) {
    if (!live) { var d = demoGet(); Object.assign(d.shop, patch); demoSave(d); return d.shop; }
    patch.updated_at = new Date().toISOString();
    var r = await sb.from("shop").update(patch).eq("id", 1).select().maybeSingle(); if (r.error) throw r.error; return r.data;
  },
  // system status for the green / yellow / red dot
  async ping() { if (!live) return "pilot"; try { var r = await sb.from("shop").select("id").eq("id", 1).maybeSingle(); return r.error ? "down" : (W.stage === "production" ? "live" : "pilot"); } catch (e) { return "down"; } },
  async listProducts(admin) {
    if (!live) {
      var all = demoGet().products.map(function (p) { return decorate(Object.assign({}, p)); });
      return admin ? all : all.filter(function (p) { return p.status !== "hidden" && W.daysLeft(p) > 0; });
    }
    var r = await sb.from("products").select("id,created_at,refreshed_at,name,description,category,price,images,thumbs,status,asks").order("refreshed_at", { ascending: false }).limit(1000);
    if (r.error) { var c = !admin && cacheGet("winga.cache.products"); if (c) { W.offline = true; return c.map(decorate); } throw r.error; }
    if (!admin) cacheSet("winga.cache.products", r.data);
    return r.data.map(decorate);
  },
  async createProduct(data, photos) {
    var id = W.uid(), up = await uploadPhotos(id, photos, 0);
    if (!live) { var now = new Date().toISOString(), d = demoGet(); var p = Object.assign({ id: id, created_at: now, refreshed_at: now, status: "active", asks: 0 }, data, up); d.products.unshift(p); demoSave(d); return decorate(Object.assign({}, p)); }
    var r = await sb.from("products").insert(Object.assign({ id: id }, data, up)).select().single(); if (r.error) throw r.error;
    return decorate(r.data);
  },
  async updateProduct(id, patch) {
    if (!live) { var d = demoGet(), p = d.products.find(function (x) { return x.id === id; }); Object.assign(p, patch); demoSave(d); return; }
    var r = await sb.from("products").update(patch).eq("id", id); if (r.error) throw r.error;
  },
  async updateMany(rows) { for (var i = 0; i < rows.length; i++) await this.updateProduct(rows[i].id, rows[i].patch); },
  // replace a product's photo list: keep[] = indexes to keep, add[] = prepared new photos
  async setPhotos(p, keep, add) {
    var images = keep.map(function (i) { return p.images[i]; }), thumbs = keep.map(function (i) { return (p.thumbs || [])[i] || p.images[i]; });
    var removed = (p.images || []).filter(function (_, i) { return keep.indexOf(i) < 0; }).concat((p.thumbs || []).filter(function (_, i) { return keep.indexOf(i) < 0; })).filter(isStored);
    if (add.length) { var up = await uploadPhotos(p.id, add, (p.images || []).length + 1); images = images.concat(up.images); thumbs = thumbs.concat(up.thumbs); }
    await this.updateProduct(p.id, { images: images, thumbs: thumbs });
    if (live && removed.length) await sb.storage.from("products").remove(removed);
    return { images: images, thumbs: thumbs };
  },
  refresh(id) { return this.updateProduct(id, { refreshed_at: new Date().toISOString(), status: "active" }); },
  async deleteProduct(p) {
    if (!live) { var d = demoGet(); d.products = d.products.filter(function (x) { return x.id !== p.id; }); demoSave(d); return; }
    var paths = (p.images || []).concat(p.thumbs || []).filter(isStored);
    if (paths.length) await sb.storage.from("products").remove(paths);
    var r = await sb.from("products").delete().eq("id", p.id); if (r.error) throw r.error;
  },
  ask(id) { if (!live) return Promise.resolve(); return sb.rpc("ask_product", { pid: id }).then(function(){}, function(){}); },
  resetDemo() { ls(DEMO_KEY, null); W._demoMem = null; },
  /* accounts: email + password, created by the Super Admin in the Supabase dashboard */
  async session() { if (!live) return { demo: true }; var r = await sb.auth.getSession(); return r.data.session; },
  async signIn(email, password) { if (!live) return { demo: true }; var r = await sb.auth.signInWithPassword({ email: email, password: password }); if (r.error) throw r.error; return r.data.session; },
  async isAdmin() { if (!live) return true; var r = await sb.rpc("is_admin"); return !r.error && r.data === true; },
  async me() {
    if (!live) return { name: "Boss Deus", role: "boss", email: "boss@mfano" };
    var s = await sb.auth.getSession(), u = s.data.session && s.data.session.user; if (!u) return null;
    var r = await sb.from("admins").select("name,role").eq("user_id", u.id).maybeSingle();
    return { name: (r.data && r.data.name) || u.email.split("@")[0], role: (r.data && r.data.role) || "boss", email: u.email };
  },
  async signOut() { if (live) await sb.auth.signOut(); }
};
W.shopUrl = function () { var u = location.href.split("#")[0].split("?")[0]; return u.replace(/admin\/?(index\.html)?$/, "").replace(/index\.html$/, ""); };
})();
