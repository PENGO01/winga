/* Niagize Kariakoo core: words, helpers, theme, photos, and the data layer.
   Live mode uses Supabase (window.supabase from the CDN + window.WINGA_CONFIG).
   Example mode keeps everything in this browser so the apps can be tried before the database exists. */
(function () {
"use strict";
var W = window.Winga = {};
W.VERSION = "1.2.0";
W.UPDATED = { sw: "Okt 2026", en: "Oct 2026" };

/* ---------------- words ----------------
   One row per text: [key, screen, Kiswahili, English].
   Style: short, M-Pesa / Selcom tone. The same table feeds the translation Excel. */
W.STRINGS = [
 // common (icons replace: close, back, share, copy, pull-to-refresh text, loading text)
 ["save","Common","Hifadhi","Save"],
 ["back","Common","Rudi","Back"],
 ["del","Common","Futa","Delete"],
 ["copied","Common","Imenakiliwa","Copied"],
 ["saved","Common","Imehifadhiwa","Saved"],
 ["share","Common","Shiriki","Share"],
 ["copy","Common","Nakili","Copy"],
 ["error","Common","Imeshindikana. Tafadhali jaribu tena","Failed. Please try again"],
 ["offline","Common","Offline. Unaona bidhaa za mara ya mwisho","Offline. Showing the last products"],
 ["count","Common","Bidhaa {n}","{n} products"],
 ["askPrice","Common","Uliza bei","Ask price"],
 ["soldout","Common","Mzigo umetuishia","Sold out"],
 ["isNew","Common","Mzigo mpya","New"],
 ["added","Common","Imetunzwa {a}","Added {a}"],
 ["agoToday","Common","leo","today"],
 ["agoYday","Common","jana","yesterday"],
 ["agoDays","Common","siku {n} zilizopita","{n} days ago"],
 ["all","Common","Zote","All"],
 ["cat_viatu","Categories","Viatu","Shoes"],
 ["cat_nguo","Categories","Nguo","Clothes"],
 ["cat_electronics","Categories","Simu & Elektroniki","Phones & Electronics"],
 ["cat_urembo","Categories","Urembo","Beauty"],
 ["cat_nyumbani","Categories","Vifaa vya nyumbani","Home"],
 ["cat_begi","Categories","Mabegi","Bags"],
 ["cat_watoto","Categories","Watoto","Kids"],
 ["cat_nyingine","Categories","Nyingine","Other"],
 // customer shop
 ["searchPh","Shop","Tafuta bidhaa upendayo","Search products you like"],
 ["emptyShop","Shop","Kaa mkao wa kula, bidhaa mpya zinakuja","Get ready, new products are coming"],
 ["noMatch","Shop","Pole, hatuna bidhaa hiyo! Jaribu neno tofauti","Sorry, we don't have that! Try another word"],
 ["addCart","Product","Ongeza kwenye kapu","Add to basket"],
 ["inCart","Product","Ipo kwenye kapu","In your basket"],
 ["notePh","Product","Maelekezo zaidi… Size, rangi au swali?","More details… Size, colour or a question?"],
 ["how_title","How to order","Namna ya kuagiza bidhaa","How to order"],
 ["how1","How to order","Chagua bidhaa upendayo","Pick what you like"],
 ["how2","How to order","Tuma oda","Send the order"],
 ["how3","How to order","Tutahakiki oda yako","We confirm your order"],
 ["how4","How to order","Lipia, tukuletee hadi mlangoni","Pay, we deliver to your door"],
 ["how_ok","How to order","Sawa","OK"],
 ["cart_title","Basket","Kapu lako","Your basket"],
 ["cart_n","Basket","Kapu · {n}","Basket · {n}"],
 ["cart_send","Basket","Tuma oda","Send order"],
 ["cart_total","Basket","Jumla","Total"],
 ["cart_empty","Basket","Hakuna bidhaa","No products"],
 ["cart_clear","Basket","Futa, anza upya","Clear, start again"],
 ["cart_sent","Basket","Umeshaweka oda? Safisha kapu","Order sent? Clear basket"],
 ["wa_hello","Basket (WhatsApp)","Habari! Naomba oda hii:","Hello! I'd like to order:"],
 ["wa_note","Basket (WhatsApp)","Maelekezo","Note"],
 ["wa_end","Basket (WhatsApp)","Naomba uthibitishe bei na upatikanaji.","Please confirm price and availability."],
 ["wa_one","Product share","Mdau… Tuagize Kariakoo, ni chap na salama","Order from Kariakoo, fast and safe"],
 // boss: sign in
 ["boss_app","Boss · Sign in","Niagize mdau","Niagize Boss"],
 ["login","Boss · Sign in","Ingia","Sign in"],
 ["email","Boss · Sign in","Barua pepe","Email"],
 ["password","Boss · Sign in","Neno la siri","Password"],
 ["wrongLogin","Boss · Sign in","Taarifa ulizoweka sio sahihi, angalia na ujaribu tena","Wrong details, check and try again"],
 ["accountHint","Boss · Sign in","Omba akaunti kwa Super Admin","Ask the Super Admin for an account"],
 ["notAdmin","Boss · Sign in","Akaunti hii haina ruhusa, wasiliana na Super Admin","This account has no access, contact the Super Admin"],
 // boss: menu and home
 ["home","Boss · Menu","Nyumbani","Home"],
 ["addPhotos","Boss · Menu","Ongeza picha","Add photos"],
 ["products","Boss · Menu","Bidhaa","Products"],
 ["haveN","Boss · Home","Una bidhaa","You have"],
 ["inShopN","Boss · Home","dukani","in the shop"],
 ["t_ending","Boss · Home","Bado zipo?","Still there?"],
 ["t_hidden","Boss · Home","Zimefichwa","Hidden"],
 ["t_asked","Boss · Home","Zinazoulizwa","Asked"],
 ["st_live","Boss · Home","Live","Live"],
 ["st_pilot","Boss · Home","Test","Test"],
 ["st_down","Boss · Home","Haipatikani","Down"],
 ["link_title","Boss · Home","Link yangu","My link"],
 ["check_shop","Boss · Home","Cheki duka lako","See your shop"],
 ["shareText","Boss · Home","Niagize Kariakoo, ni chap na salama","Niagize Kariakoo, fast and safe"],
 ["stillHere","Boss · Home","Bado upo?","Still here"],
 ["markSold","Boss · Home","Mzigo umetuishia","Sold out"],
 ["emptyHome","Boss · Home","Ongeza picha ya bidhaa zako","Add photos of your products"],
 ["q_add","Boss · Home tiles","Ongeza bidhaa","Add product"],
 ["q_list","Boss · Home tiles","Bidhaa zangu","My products"],
 ["q_archive","Boss · Home tiles","Archive","Archive"],
 ["q_shop","Boss · Home tiles","Cheki duka","See shop"],
 ["q_share","Boss · Home tiles","Share link","Share link"],
 ["q_team","Boss · Home tiles","Wasaidizi","Assistants"],
 ["q_steps","Boss · Home tiles","Anza hapa","Start here"],
 ["q_settings","Boss · Home tiles","Mipangilio","Settings"],
 ["steps_title","Boss · Discover","Hatua 3 tu… anza hapa","Just 3 steps… start here"],
 ["step1","Boss · Discover","Namba ya WhatsApp","WhatsApp number"],
 ["step1s","Boss · Discover","Oda zitakufikia hapa","Orders reach you here"],
 ["step2","Boss · Discover","Weka bidhaa 3","Add 3 products"],
 ["step2s","Boss · Discover","Ongeza picha ya bidhaa zako","Add photos of your products"],
 ["step3","Boss · Discover","Share link ya duka kwa wateja","Share the shop link with customers"],
 ["step3s","Boss · Discover","Au share link kwenye status na kurasa zako mtandaoni","Or on your status and social pages"],
 ["stepsDone","Boss · Discover","Duka liko tayari","The shop is ready"],
 ["go","Boss · Discover","Anza","Start"],
 // boss: add product
 ["add_title","Boss · Add product","Ongeza bidhaa","Add product"],
 ["add_saved","Boss · Add product","{n} zimehifadhiwa","{n} saved"],
 ["photos_max","Boss · Add product","Picha zaidi?","More photos?"],
 ["name_ph","Boss · Add product","Jina la bidhaa","Product name"],
 ["price_ph","Boss · Add product","Bei","Price"],
 ["ask_check","Boss · Add product","Acha mteja aulize bei","Let the customer ask the price"],
 ["desc_ph","Boss · Add product","Maelezo ya ziada (size, rangi, material)","More details (size, colour, material)"],
 ["add_more","Boss · Add product","Bidhaa nyingine","Another product"],
 ["add_done","Boss · Add product","Hifadhi, Maliza","Save & finish"],
 ["need_photo","Boss · Add product","Ongeza angalau picha moja","Add at least one photo"],
 ["need_name","Boss · Add product","Jina la bidhaa","Product name"],
 ["upload_fail","Boss · Add product","Imeshindwa kupakia: {x}","Upload failed: {x}"],
 ["savedN","Boss · Add product","Bidhaa {n} zimeongezwa","{n} products added"],
 // boss: products
 ["list_title","Boss · Products","Bidhaa zilizopo","Your products"],
 ["f_hidden","Boss · Products","Zilizofichwa","Hidden"],
 ["f_archive","Boss · Products","Archive","Archive"],
 ["hidden","Boss · Products","Imefichwa","Hidden"],
 ["archived","Boss · Products","Archive","Archived"],
 ["noProducts","Boss · Products","Hakuna bidhaa","No products"],
 ["unarchive","Boss · Products","Rudisha dukani","Back to shop"],
 ["unarchived","Boss · Products","Imerudi dukani kwa siku 60","Back in the shop for 60 days"],
 ["archive_hint","Boss · Products","Bidhaa huenda Archive yenyewe baada ya siku 60","Products move to Archive by themselves after 60 days"],
 // boss: edit
 ["edit_title","Boss · Edit","Badili taarifa","Edit details"],
 ["bulk_title","Boss · Edit","Badili bidhaa {n}","Edit {n} products"],
 ["col_item","Boss · Edit","Bidhaa","Product"],
 ["col_price","Boss · Edit","Bei","Price"],
 ["confirmDel2","Boss · Edit","Je, una uhakika unataka kufuta bidhaa?","Are you sure you want to delete?"],
 ["yesDel","Boss · Edit","Ndiyo, futa","Yes, delete"],
 // boss: profile and settings
 ["role_super_admin","Boss · Profile","Super Admin","Super Admin"],
 ["role_boss","Boss · Profile","Boss","Boss"],
 ["role_assistant","Boss · Profile","Msaidizi","Assistant"],
 ["shop_settings","Boss · Profile","Mipangilio ya duka","Shop settings"],
 ["shop_settings_s","Boss · Profile","WhatsApp na namba za malipo","WhatsApp and payment numbers"],
 ["team","Boss · Profile","Wasaidizi","Assistants"],
 ["team_s","Boss · Profile","Wanaoweza kuongeza bidhaa","People who can add products"],
 ["signOut","Boss · Profile","Kutoka","Log out"],
 ["wa_label","Boss · Settings","Namba ya WhatsApp","WhatsApp number"],
 ["pay_title","Boss · Settings","Namba za malipo","Payment numbers"],
 ["pay_num","Boss · Settings","Namba ya malipo","Payment number"],
 ["pay_name","Boss · Settings","Jina la akaunti","Account name"],
 ["reset_demo","Boss · Settings","Reset examples","Reset examples"],
 // boss: assistants
 ["team_add","Boss · Assistants","Ongeza msaidizi","Add assistant"],
 ["team_name","Boss · Assistants","Jina","Name"],
 ["team_pw","Boss · Assistants","Neno la siri (herufi 8+)","Password (8+ characters)"],
 ["team_note","Boss · Assistants","Msaidizi anaweza kuongeza na kubadili bidhaa. Hawezi kufuta, wala kubadili mipangilio.","An assistant can add and edit products. They can't delete or change settings."],
 ["team_added","Boss · Assistants","Msaidizi ameongezwa. Mpe barua pepe na neno la siri","Assistant added. Give them the email and password"],
 ["team_removed","Boss · Assistants","Msaidizi ameondolewa","Assistant removed"],
 ["team_exists","Boss · Assistants","Barua pepe hii tayari ina akaunti","This email already has an account"],
 ["team_confirm","Boss · Assistants","Ondoa {x}?","Remove {x}?"],
 ["you","Boss · Assistants","Wewe","You"]
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

/* ---------------- theme: light / dark (first visit follows the phone) ---------------- */
W.isDark = function () { var th = ls("winga.theme"); if (th === "dark" || th === "light") return th === "dark"; try { return matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; } };
W.applyTheme = function (th) { if (th) ls("winga.theme", th); document.documentElement.setAttribute("data-theme", W.isDark() ? "dark" : "light"); };
W.toggleTheme = function () { W.applyTheme(W.isDark() ? "light" : "dark"); };
W.applyTheme();

/* sun loader: a sun rising over the horizon, rays turning. Used instead of "loading" words */
W.SUN = '<span class="sunload" role="img" aria-label="…"><svg viewBox="0 0 48 48" fill="none" stroke-linecap="round"><g class="rays" stroke="var(--jua)" stroke-width="3"><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/></g><circle cx="24" cy="24" r="7.5" fill="var(--jua)"/></svg></span>';

/* ---------------- helpers ---------------- */
W.$ = function (s, r) { return (r || document).querySelector(s); };
W.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
W.money = function (n) { return Math.round(+n || 0).toLocaleString("en-US"); };
W.parseMoney = function (v) { if (v == null || v === "") return null; var s = String(v).toLowerCase().replace(/tsh|tzs|sh/g, "").trim(); var k = /k$/.test(s); s = s.replace(/[^0-9.]/g, ""); if (!s) return null; var n = parseFloat(s); return Math.round(k ? n * 1000 : n); };
W.waPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };
W.DAY = 864e5; W.SHOW_DAYS = 60;   // products move to Archive after 60 days
W.daysLeft = function (p) { return W.SHOW_DAYS - Math.floor((Date.now() - new Date(p.refreshed_at).getTime()) / W.DAY); };
W.ago = function (iso) { var d = Math.floor((Date.now() - new Date(iso).getTime()) / W.DAY); return d <= 0 ? W.t("agoToday") : d === 1 ? W.t("agoYday") : W.t("agoDays", { n: d }); };
W.isNew = function (p) { return Date.now() - new Date(p.created_at).getTime() < W.DAY; };
W.toast = function (m) { var r = document.getElementById("toastRoot"); if (!r) return; r.innerHTML = '<div class="toast" role="status">' + W.esc(m) + "</div>"; clearTimeout(W.toast._t); W.toast._t = setTimeout(function () { r.innerHTML = ""; }, 2400); };
W.copy = function (text, fallbackEl) { return navigator.clipboard.writeText(text).then(function(){ W.toast(W.t("copied")); }, function(){ if (fallbackEl) { var r = document.createRange(); r.selectNodeContents(fallbackEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } }); };
W.uid = function () { return (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); };
W.standalone = function () { try { return navigator.standalone === true || matchMedia("(display-mode: standalone)").matches; } catch (e) { return false; } };

/* pull to refresh: drag down at the top of the page; the sun shows, release to reload */
W.pullToRefresh = function (indicator, onRefresh) {
  var startY = null, dist = 0, busy = false;
  addEventListener("touchstart", function (e) { if (busy || window.scrollY > 0 || document.querySelector(".scrim")) { startY = null; return; } startY = e.touches[0].clientY; dist = 0; }, { passive: true });
  addEventListener("touchmove", function (e) { if (startY == null) return; dist = e.touches[0].clientY - startY; if (dist > 12) { indicator.innerHTML = W.SUN; indicator.classList.add("on"); indicator.classList.toggle("ready", dist > 70); } }, { passive: true });
  addEventListener("touchend", async function () { if (startY == null) return; startY = null; if (dist > 70) { busy = true; indicator.classList.add("spin"); try { await onRefresh(); } catch (e) {} busy = false; } indicator.classList.remove("on", "spin", "ready"); dist = 0; });
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
W.frame = function (st) { document.documentElement.setAttribute("data-stage", st || (live && W.stage === "production" ? "live" : "pilot")); };
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
var DEMO_KEY = "winga.demo.v3";
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
    ["Begi la mgongoni", "begi", 27000, "Laptop ya 15\" inaingia.", now - 55*D, "#B9C9B0", "#2F4B32", "bag"],
    ["Mafuta ya nywele, 250ml", "urembo", 9500, "", now - 64*D, "#F2D7E0", "#8A2E4E", "bottle"],
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
      all.forEach(function (p) { if ((p.status === "active" || p.status === "soldout") && W.daysLeft(p) <= 0) p.status = "archived"; });
      return admin ? all : all.filter(function (p) { return (p.status === "active" || p.status === "soldout"); });
    }
    var r = await sb.from("products").select("id,created_at,refreshed_at,name,description,category,price,images,thumbs,status,asks").order("refreshed_at", { ascending: false }).limit(1000);
    if (r.error) { var c = !admin && cacheGet("winga.cache.products"); if (c) { W.offline = true; return c.map(decorate); } throw r.error; }
    if (!admin) cacheSet("winga.cache.products", r.data);
    // the database archives once a day; show it straight away here too
    r.data.forEach(function (p) { if ((p.status === "active" || p.status === "soldout") && W.daysLeft(p) <= 0) p.status = "archived"; });
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
  unarchive(id) { return this.refresh(id); },
  /* team: list / add / remove assistants (server function checks the caller is an owner) */
  async team(action, body) {
    if (!live) {
      var d = demoGet(); d.team = d.team || [{ user_id: "demo-boss", name: "Boss Deus", role: "boss", email: "boss@mfano" }];
      if (action === "add") { if (d.team.some(function (m) { return m.email === body.email; })) throw new Error("exists"); d.team.push({ user_id: W.uid(), name: body.name, role: "assistant", email: body.email }); }
      if (action === "remove") d.team = d.team.filter(function (m) { return m.user_id !== body.user_id; });
      demoSave(d); return { ok: true, team: d.team };
    }
    var r = await sb.functions.invoke("team", { body: Object.assign({ action: action }, body || {}) });
    if (r.error) { var msg = "error"; try { msg = (await r.error.context.json()).error || msg; } catch (e) {} throw new Error(msg); }
    return r.data;
  },
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
    if (!live) return { id: "demo-boss", name: "Boss Deus", role: ls("winga.demoRole") || "boss", email: "boss@mfano" };
    var s = await sb.auth.getSession(), u = s.data.session && s.data.session.user; if (!u) return null;
    var r = await sb.from("admins").select("name,role").eq("user_id", u.id).maybeSingle();
    return { id: u.id, name: (r.data && r.data.name) || u.email.split("@")[0], role: (r.data && r.data.role) || "assistant", email: u.email };
  },
  async signOut() { if (live) await sb.auth.signOut(); }
};
W.shopUrl = function () { var u = location.href.split("#")[0].split("?")[0]; return u.replace(/admin\/?(index\.html)?$/, "").replace(/index\.html$/, ""); };
})();
