/* Winga core: language, helpers, photos, and the data layer.
   Live mode uses Supabase (window.supabase from the CDN + window.WINGA_CONFIG).
   Example mode keeps everything in this browser so the apps can be tried before the database exists. */
(function () {
"use strict";
var W = window.Winga = {};

/* ---------------- language ---------------- */
var STR = {
 sw: {
  shop:"Duka", searchPh:"Tafuta: viatu, simu, kitenge…", all:"Zote", askPrice:"Uliza bei", soldout:"Imeisha", isNew:"Mpya",
  orderWa:"Agiza kupitia WhatsApp", share:"Shiriki", sizes:"Saizi", colors:"Rangi", details:"Maelezo",
  emptyShop:"Bidhaa mpya zinakuja hivi punde.", noMatch:"Hakuna bidhaa inayolingana. Jaribu neno jingine.",
  waHello:"Habari! Nimeiona hii kwenye duka lako:", waAsk:"Bado ipo? Bei yake ni ngapi?",
  loading:"Inapakia…", offline:"Hakuna mtandao. Unaona bidhaa ulizoziona mwisho.", example:"MFANO",
  exampleBanner:"Hili ni duka la mfano. Bidhaa halisi zitaonekana Boss Deus akianza kupakia.",
  linkCopied:"Link imenakiliwa", close:"Funga", back:"Rudi", count:"bidhaa {n}",
  // admin
  admin:"Upande wa Boss Deus", login:"Ingia", email:"Barua pepe (email)", password:"Neno la siri", wrongLogin:"Email au neno la siri si sahihi. Jaribu tena.",
  notAdmin:"Akaunti hii bado haijapewa ruhusa ya duka. Mwambie Super Admin akuongeze.", signOut:"Toka",
  home:"Nyumbani", products:"Bidhaa", settings:"Mipangilio", addPhotos:"Ongeza picha", addPhotosS:"Chagua picha nyingi kutoka Photos",
  live:"Ziko dukani", endingSoon:"Zinaisha ndani ya siku 2", soldoutN:"Zimeisha", shopLink:"Link ya duka", copyLink:"Nakili link", openShop:"Fungua duka",
  intakeTitle:"Bidhaa {i} kati ya {n}", photoN:"picha {n}", name:"Jina la bidhaa", category:"Aina", price:"Bei kwa mteja", priceHint:"Acha wazi kama ni 'Uliza bei'",
  cost:"Bei yako ya ndani", costHint:"Siri yako. Mteja haioni kamwe.", sizesPh:"Mfano: 40, 41, 42", colorsPh:"Mfano: nyeusi, brown", descPh:"Maelezo mafupi (si lazima)",
  nextPhotoSame:"Picha inayofuata ni ya bidhaa hii hii", saveNext:"Hifadhi, inayofuata", saveDone:"Hifadhi, maliza", skip:"Ruka picha hii",
  uploading:"Inapakia {i}/{n}…", savedN:"Bidhaa {n} zimeingia dukani", stillHere:"Bado ipo", markSold:"Imeisha", hide:"Ficha", unhide:"Rudisha dukani", edit:"Hariri", del:"Futa",
  confirmDel:"Futa bidhaa hii na picha zake? Haiwezi kurudishwa.", yesDel:"Ndiyo, futa", no:"Hapana",
  daysLeft:"inaisha siku {n}", lastDay:"inaisha leo", expired:"imeisha muda, haionekani", hidden:"imefichwa", refreshed:"Itaonekana siku 7 zaidi",
  shopName:"Jina la duka", tagline:"Kauli fupi", whatsapp:"Namba ya WhatsApp ya duka", lipa:"Lipa Namba", lipaName:"Jina kwenye Lipa Namba", network:"Mtandao / benki", instagram:"Instagram",
  save:"Hifadhi", saved:"Imehifadhiwa", cancel:"Ghairi", language:"Lugha", nameNeeded:"Weka jina la bidhaa kwanza.", asks:"maombi {n}",
  modeLive:"Imeunganishwa na database", modeDemo:"Hali ya mfano: data iko kwenye kivinjari hiki tu", installHint:"Kwenye iPhone: Share → Add to Home Screen", filterAll:"Zote", filterEnding:"Zinaisha", filterSold:"Zimeisha", filterHidden:"Zimefichwa",
  cat_viatu:"Viatu", cat_nguo:"Nguo", cat_electronics:"Simu & Electronics", cat_urembo:"Urembo", cat_nyumbani:"Nyumbani", cat_begi:"Mabegi", cat_watoto:"Watoto", cat_nyingine:"Nyingine",
  howTitle:"Jinsi ya kuagiza", how1:"Chagua bidhaa", how2:"Agiza WhatsApp, bei inathibitishwa", how3:"Lipa, upokee mlangoni", gotIt:"Sawa, nimeelewa",
  notReady:"Duka linaandaliwa. Kuagiza kutafunguka hivi punde.", added:"Imeongezwa {a}", agoToday:"leo", agoYday:"jana", agoDays:"siku {n} zilizopita", place:"Kariakoo, Dar es Salaam",
  obTitle:"Hatua 3 za kufungua duka", obProg:"{d} kati ya 3", ob1:"Weka namba ya WhatsApp ya duka", ob1s:"Oda za wateja zitakufikia hapa.", ob2:"Weka bidhaa 3 za kwanza", ob2s:"WhatsApp: shika picha → Save. Kisha bonyeza Ongeza picha.",
  ob3:"Shiriki link ya duka", ob3s:"Kwenye status ya WhatsApp au Instagram.", obDone:"Duka liko tayari. Endelea kuongeza bidhaa kila siku.", obGo:"Anza", obCount:"{n} kati ya 3",
  installTitle:"Weka Niagize Boss kwenye Home Screen", installS:"Kwenye Safari: bonyeza Share, kisha Add to Home Screen. Itafunguka kama app na utabaki umeingia.",
  shareShop:"Shiriki", shareText:"Karibu {s}! Bidhaa za Kariakoo, mlangoni kwako:", showPw:"Onyesha", hidePw:"Ficha", accountHint:"Akaunti yako inatengenezwa na Super Admin.",
  waFirst:"Weka namba ya WhatsApp kwanza, la sivyo wateja hawawezi kuagiza.", intakeTitle2:"Bidhaa ya {i}", photosLeft:"picha {r} zimebaki", lastPhoto:"picha ya mwisho"
 },
 en: {
  shop:"Shop", searchPh:"Search: shoes, phones, kitenge…", all:"All", askPrice:"Ask price", soldout:"Sold out", isNew:"New",
  orderWa:"Order on WhatsApp", share:"Share", sizes:"Sizes", colors:"Colours", details:"Details",
  emptyShop:"New products are coming soon.", noMatch:"Nothing matches. Try another word.",
  waHello:"Hello! I saw this in your shop:", waAsk:"Is it still available? What's the price?",
  loading:"Loading…", offline:"No connection. Showing the products you saw last.", example:"EXAMPLE",
  exampleBanner:"This is an example shop. Real products appear once Boss Deus starts uploading.",
  linkCopied:"Link copied", close:"Close", back:"Back", count:"{n} products",
  admin:"Boss Deus's side", login:"Sign in", email:"Email", password:"Password", wrongLogin:"Email or password is wrong. Try again.",
  notAdmin:"This account isn't allowed to run the shop yet. Ask the Super Admin to add you.", signOut:"Sign out",
  home:"Home", products:"Products", settings:"Settings", addPhotos:"Add photos", addPhotosS:"Pick several photos from Photos",
  live:"In the shop", endingSoon:"Ending within 2 days", soldoutN:"Sold out", shopLink:"Shop link", copyLink:"Copy link", openShop:"Open shop",
  intakeTitle:"Product {i} of {n}", photoN:"{n} photos", name:"Product name", category:"Category", price:"Customer price", priceHint:"Leave empty for 'Ask price'",
  cost:"Your inside price", costHint:"Your secret. The customer never sees it.", sizesPh:"e.g. 40, 41, 42", colorsPh:"e.g. black, brown", descPh:"Short description (optional)",
  nextPhotoSame:"Next photo is the same product", saveNext:"Save, next", saveDone:"Save, finish", skip:"Skip this photo",
  uploading:"Uploading {i}/{n}…", savedN:"{n} products are in the shop", stillHere:"Still here", markSold:"Sold out", hide:"Hide", unhide:"Back in shop", edit:"Edit", del:"Delete",
  confirmDel:"Delete this product and its photos? This can't be undone.", yesDel:"Yes, delete", no:"No",
  daysLeft:"{n} days left", lastDay:"last day", expired:"expired, not shown", hidden:"hidden", refreshed:"Shown for 7 more days",
  shopName:"Shop name", tagline:"Short tagline", whatsapp:"Shop WhatsApp number", lipa:"Lipa Namba", lipaName:"Name on Lipa Namba", network:"Network / bank", instagram:"Instagram",
  save:"Save", saved:"Saved", cancel:"Cancel", language:"Language", nameNeeded:"Add a product name first.", asks:"{n} asks",
  modeLive:"Connected to the database", modeDemo:"Example mode: data lives in this browser only", installHint:"On iPhone: Share → Add to Home Screen", filterAll:"All", filterEnding:"Ending", filterSold:"Sold out", filterHidden:"Hidden",
  cat_viatu:"Shoes", cat_nguo:"Clothing", cat_electronics:"Phones & Electronics", cat_urembo:"Beauty", cat_nyumbani:"Home", cat_begi:"Bags", cat_watoto:"Kids", cat_nyingine:"Other",
  howTitle:"How ordering works", how1:"Pick a product", how2:"Order on WhatsApp, price confirmed", how3:"Pay, receive at your door", gotIt:"Got it",
  notReady:"The shop is being set up. Ordering opens soon.", added:"Added {a}", agoToday:"today", agoYday:"yesterday", agoDays:"{n} days ago", place:"Kariakoo, Dar es Salaam",
  obTitle:"3 steps to open the shop", obProg:"{d} of 3", ob1:"Add the shop's WhatsApp number", ob1s:"Customer orders reach you here.", ob2:"Add your first 3 products", ob2s:"In WhatsApp: hold a photo → Save. Then tap Add photos.",
  ob3:"Share the shop link", ob3s:"On WhatsApp status or Instagram.", obDone:"The shop is ready. Keep adding products every day.", obGo:"Start", obCount:"{n} of 3",
  installTitle:"Put Niagize Boss on your Home Screen", installS:"In Safari: tap Share, then Add to Home Screen. It opens like an app and you stay signed in.",
  shareShop:"Share", shareText:"Welcome to {s}! Kariakoo goods to your door:", showPw:"Show", hidePw:"Hide", accountHint:"Your account is created by the Super Admin.",
  waFirst:"Add the WhatsApp number first, or customers can't order.", intakeTitle2:"Product {i}", photosLeft:"{r} photos left", lastPhoto:"last photo"
 }
};
W.CATS = ["viatu","nguo","electronics","urembo","nyumbani","begi","watoto","nyingine"];
W.lang = (function(){ try { return localStorage.getItem("winga.lang") || "sw"; } catch (e) { return "sw"; } })();
W.setLang = function (l) { W.lang = l; try { localStorage.setItem("winga.lang", l); } catch (e) {} document.documentElement.lang = l; };
W.t = function (k, v) { var s = (STR[W.lang] || STR.sw)[k]; if (s == null) s = STR.sw[k] || k; if (v) for (var p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
document.documentElement.lang = W.lang;

/* ---------------- helpers ---------------- */
W.$ = function (s, r) { return (r || document).querySelector(s); };
W.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
W.money = function (n) { return Math.round(+n || 0).toLocaleString("en-US"); };
W.parseMoney = function (v) { if (v == null || v === "") return null; var s = String(v).toLowerCase().replace(/tsh|tzs|sh/g, "").trim(); var k = /k$/.test(s); s = s.replace(/[^0-9.]/g, ""); if (!s) return null; var n = parseFloat(s); return Math.round(k ? n * 1000 : n); };
W.waPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };
W.DAY = 864e5; W.SHOW_DAYS = 7;
W.daysLeft = function (p) { return W.SHOW_DAYS - Math.floor((Date.now() - new Date(p.refreshed_at).getTime()) / W.DAY); };
W.ago = function (iso) { var d = Math.floor((Date.now() - new Date(iso).getTime()) / W.DAY); return d <= 0 ? W.t("agoToday") : d === 1 ? W.t("agoYday") : W.t("agoDays", { n: d }); };
W.isNew = function (p) { return Date.now() - new Date(p.created_at).getTime() < W.DAY; };
W.toast = function (m) { var r = document.getElementById("toastRoot"); if (!r) return; r.innerHTML = '<div class="toast" role="status">' + W.esc(m) + "</div>"; clearTimeout(W.toast._t); W.toast._t = setTimeout(function () { r.innerHTML = ""; }, 2400); };
W.copy = function (text, fallbackEl) { return navigator.clipboard.writeText(text).then(function(){ W.toast(W.t("linkCopied")); }, function(){ if (fallbackEl) { var r = document.createRange(); r.selectNodeContents(fallbackEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } }); };
W.uid = function () { return (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)); };

/* ---------------- photos ---------------- */
// Shrink a photo to max px on the long side. Returns a JPEG Blob.
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

/* ---------------- data layer ---------------- */
var C = window.WINGA_CONFIG || {};
var live = !!(C.url && C.anonKey && window.supabase && window.supabase.createClient);
var sb = live ? window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, storageKey: "winga.auth" } }) : null;
W.mode = live ? "live" : "demo";
function pub(path) { if (!path) return ""; if (/^data:|^https?:/.test(path)) return path; return C.url + "/storage/v1/object/public/products/" + path; }
function decorate(p) {
  p.thumbUrl = pub((p.thumbs && p.thumbs[0]) || (p.images && p.images[0]));
  p.imageUrls = (p.images || []).map(pub);
  if (p.product_private) { var pr = Array.isArray(p.product_private) ? p.product_private[0] : p.product_private; p.cost = pr ? pr.cost : null; p.supplier = pr ? pr.supplier : null; delete p.product_private; }
  return p;
}
function cacheSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cacheGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }

/* --- example mode store --- */
var DEMO_KEY = "winga.demo.v1";
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
    ["Raba brown, Air style", "viatu", 35000, 25000, "40, 41, 42, 43, 44", "brown", "Ngozi laini, soli imara. Inafaa kazini na matembezini.", now - 2*36e5, "#C9A27E", "#6B3E1E", "shoe"],
    ["Sandals za kike", "viatu", 18000, 14000, "37, 38, 39, 40", "nyeusi, beige", "", now - D, "#E9D7C5", "#2B2B2B", "shoe"],
    ["Tecno Spark 20, 128GB", "electronics", null, 265000, "", "nyeusi, bluu", "Mpya kwenye boksi, warranty ya duka.", now - 2*D, "#D3DEE8", "#1C3A54", "phone"],
    ["Chaja Type-C 33W", "electronics", 12000, 9000, "", "", "Inachaji haraka. Simu nyingi za Android.", now - 3*36e5, "#E7ECEF", "#3B4A57", "phone"],
    ["Kitenge cha Kongo, doti 1", "nguo", 22000, 18000, "", "kijani, njano", "Pamba halisi.", now - D, "#F6C85F", "#1F6F5C", "cloth"],
    ["Begi la mgongoni", "begi", 27000, 22000, "", "kijivu, nyeusi", "Linafaa shule na laptop ya 15\".", now - 5*D, "#B9C9B0", "#2F4B32", "bag"],
    ["Mafuta ya nywele, 250ml", "urembo", 9500, 7000, "", "", "", now - 4*D, "#F2D7E0", "#8A2E4E", "bottle"],
    ["Shati la kitambaa, mikono mirefu", "nguo", 25000, 19000, "M, L, XL", "nyeupe, bluu", "", now - 6*D, "#E4EEF7", "#1F5C8F", "cloth"]
  ];
  return { shop: { name: "Niagize Kariakoo", tagline: "Bidhaa za Kariakoo, mlangoni kwako", whatsapp: "255700000000", lipa: "5512 3487", lipa_name: "BOSS DEUS KARIAKOO", network: "Mtandao wowote", instagram: "" },
    products: defs.map(function (d, i) { var img = sample(d[0].split(",")[0], d[8], d[9], d[10]);
      return { id: "demo-" + i, created_at: new Date(d[7]).toISOString(), refreshed_at: new Date(d[7]).toISOString(), name: d[0], category: d[1], price: d[2], cost: d[3], sizes: d[4], colors: d[5], description: d[6], images: [img], thumbs: [img], status: i === 7 ? "soldout" : "active", asks: [3,1,6,2,4,0,1,2][i], ex: true }; }) };
}

/* --- public API --- */
W.db = {
  live: live,
  async getShop() {
    if (!live) return demoGet().shop;
    var r = await sb.from("shop").select("*").eq("id", 1).maybeSingle();
    if (r.error) { var c = cacheGet("winga.cache.shop"); if (c) return c; throw r.error; }
    cacheSet("winga.cache.shop", r.data); return r.data || {};
  },
  async saveShop(patch) {
    if (!live) { var d = demoGet(); Object.assign(d.shop, patch); demoSave(d); return d.shop; }
    patch.updated_at = new Date().toISOString();
    var r = await sb.from("shop").update(patch).eq("id", 1).select().maybeSingle(); if (r.error) throw r.error; return r.data;
  },
  // Customer view: live products only. Admin view: everything, with private cost.
  async listProducts(admin) {
    if (!live) {
      var all = demoGet().products.map(function (p) { return decorate(Object.assign({}, p)); });
      return admin ? all : all.filter(function (p) { return p.status !== "hidden" && W.daysLeft(p) > 0; });
    }
    var q = admin ? sb.from("products").select("*, product_private(cost,supplier)") : sb.from("products").select("id,created_at,refreshed_at,name,description,category,price,sizes,colors,images,thumbs,status");
    var r = await q.order("refreshed_at", { ascending: false }).limit(1000);
    if (r.error) { var c = !admin && cacheGet("winga.cache.products"); if (c) { W.offline = true; return c.map(decorate); } throw r.error; }
    if (!admin) cacheSet("winga.cache.products", r.data);
    return r.data.map(decorate);
  },
  async createProduct(data, photos) {
    // photos: [{full: Blob, thumb: Blob}]
    var id = W.uid(), images = [], thumbs = [];
    if (!live) {
      for (var i = 0; i < photos.length; i++) { images.push(await W.blobToData(photos[i].full)); thumbs.push(await W.blobToData(photos[i].thumb)); }
      var now = new Date().toISOString(), d = demoGet();
      var p = Object.assign({ id: id, created_at: now, refreshed_at: now, status: "active", asks: 0, images: images, thumbs: thumbs }, data);
      d.products.unshift(p); demoSave(d); return p;
    }
    for (var j = 0; j < photos.length; j++) {
      var base = id + "/" + j + "-" + Date.now().toString(36);
      var u1 = await sb.storage.from("products").upload(base + ".jpg", photos[j].full, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
      if (u1.error) throw u1.error;
      var u2 = await sb.storage.from("products").upload(base + "-t.jpg", photos[j].thumb, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
      if (u2.error) throw u2.error;
      images.push(base + ".jpg"); thumbs.push(base + "-t.jpg");
    }
    var cost = data.cost, supplier = data.supplier; delete data.cost; delete data.supplier;
    var r = await sb.from("products").insert(Object.assign({ id: id, images: images, thumbs: thumbs }, data)).select().single();
    if (r.error) throw r.error;
    if (cost != null || supplier) { var r2 = await sb.from("product_private").upsert({ product_id: id, cost: cost, supplier: supplier || null }); if (r2.error) throw r2.error; }
    return decorate(r.data);
  },
  async updateProduct(id, patch) {
    var priv = {}, has = false;
    ["cost", "supplier"].forEach(function (k) { if (k in patch) { priv[k] = patch[k]; delete patch[k]; has = true; } });
    if (!live) { var d = demoGet(), p = d.products.find(function (x) { return x.id === id; }); Object.assign(p, patch, priv); demoSave(d); return p; }
    if (Object.keys(patch).length) { var r = await sb.from("products").update(patch).eq("id", id); if (r.error) throw r.error; }
    if (has) { priv.product_id = id; var r2 = await sb.from("product_private").upsert(priv); if (r2.error) throw r2.error; }
  },
  refresh(id) { return this.updateProduct(id, { refreshed_at: new Date().toISOString(), status: "active" }); },
  async deleteProduct(p) {
    if (!live) { var d = demoGet(); d.products = d.products.filter(function (x) { return x.id !== p.id; }); demoSave(d); return; }
    var paths = (p.images || []).concat(p.thumbs || []).filter(function (x) { return x && !/^data:|^https?:/.test(x); });
    if (paths.length) await sb.storage.from("products").remove(paths);
    var r = await sb.from("products").delete().eq("id", p.id); if (r.error) throw r.error;
  },
  ask(id) { if (!live) return Promise.resolve(); return sb.rpc("ask_product", { pid: id }).then(function(){}, function(){}); },
  resetDemo() { try { localStorage.removeItem(DEMO_KEY); } catch (e) {} W._demoMem = null; },
  /* auth (Boss Deus + Super Admin): email + password. Accounts are created by the owner in the Supabase dashboard,
     so no email delivery is needed. The session stays on the phone until "Toka". */
  async session() { if (!live) return { demo: true }; var r = await sb.auth.getSession(); return r.data.session; },
  async signIn(email, password) { if (!live) return { demo: true }; var r = await sb.auth.signInWithPassword({ email: email, password: password }); if (r.error) throw r.error; return r.data.session; },
  async isAdmin() { if (!live) return true; var r = await sb.rpc("is_admin"); return !r.error && r.data === true; },
  async signOut() { if (live) await sb.auth.signOut(); }
};
W.shopUrl = function () { var u = location.href.split("#")[0].split("?")[0]; return u.replace(/admin\/?(index\.html)?$/, "").replace(/index\.html$/, ""); };
})();
