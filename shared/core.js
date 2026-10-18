/* Niagize Kariakoo core (v2): words, categories, helpers, theme, photos and the data layer.
   Live mode uses Supabase (window.supabase from the CDN + window.WINGA_CONFIG).
   Example mode keeps everything in this browser so the apps can be tried without the database.
   Set window.NIAGIZE_APP = "shop" | "boss" before this file so each app keeps its own sign-in. */
(function () {
"use strict";
var W = window.Winga = {};
W.VERSION = "2.0.0";
W.UPDATED = { sw: "Okt 2026", en: "Oct 2026" };
W.APP = window.NIAGIZE_APP || "shop";

/* ---------------- words ----------------
   One row per text: [key, screen, Kiswahili, English]. Short, M-Pesa / Selcom tone.
   The same table feeds the translation Excel. */
W.STRINGS = [
 // common
 ["save","Common","Hifadhi","Save"],
 ["back","Common","Rudi","Back"],
 ["del","Common","Futa","Delete"],
 ["edit","Common","Badili","Edit"],
 ["ok","Common","Sawa","OK"],
 ["copied","Common","Imenakiliwa","Copied"],
 ["saved","Common","Imehifadhiwa","Saved"],
 ["share","Common","Shiriki","Share"],
 ["copy","Common","Nakili","Copy"],
 ["error","Common","Imeshindikana. Tafadhali jaribu tena","Failed. Please try again"],
 ["err_title","Common","Kuna hitilafu","Something went wrong"],
 ["err_sub","Common","Imeshindikana kupakia. Angalia mtandao kisha jaribu tena.","Couldn't load. Check your connection and try again."],
 ["retry","Common","Jaribu tena","Try again"],
 ["offline","Common","Offline. Unaona bidhaa za mara ya mwisho","Offline. Showing the last products"],
 ["askPrice","Common","Uliza bei","Ask price"],
 ["soldout","Common","Mzigo umetuishia","Sold out"],
 ["added","Common","Imetunzwa {a}","Added {a}"],
 ["agoToday","Common","leo","today"],
 ["agoYday","Common","jana","yesterday"],
 ["agoDays","Common","siku {n} zilizopita","{n} days ago"],
 ["all","Common","Zote","All"],
 ["lang","Common","Lugha","Language"],
 ["theme","Common","Mwonekano","Appearance"],
 ["th_light","Common","Mwanga","Light"],
 ["th_dark","Common","Giza","Dark"],
 ["tagline","Common","Ni chap na salama, mpaka mlangoni kwako","Fast and safe, to your door"],
 // categories (labels for the 6 main groups and their sub-groups live in W.TAX below)
 // customer shop
 ["nav_home","Shop · Menu","Nyumbani","Home"],
 ["nav_cats","Shop · Menu","Aina","Categories"],
 ["nav_cart","Shop · Menu","Kapu","Basket"],
 ["nav_me","Shop · Menu","Mimi","Me"],
 ["searchPh","Shop","Tafuta bidhaa upendayo","Search products you like"],
 ["emptyShop","Shop","Kaa mkao wa kula, bidhaa mpya zinakuja","Get ready, new products are coming"],
 ["noMatch","Shop","Pole, hatuna bidhaa hiyo! Jaribu neno tofauti","Sorry, we don't have that! Try another word"],
 ["sold_n","Shop","{n} wameagiza","{n} ordered"],
 ["rate_1","Shop","Ubora wa kawaida","Standard quality"],
 ["rate_2","Shop","Ubora wa kati","Good quality"],
 ["rate_3","Shop","Ubora wa juu","Top quality"],
 ["chat","Product","Ulizia","Ask"],
 ["addCart","Product","Ongeza kwenye kapu","Add to basket"],
 ["buyNow","Product","Agiza sasa","Order now"],
 ["cart_added","Product","Imeongezwa","Added"],
 ["inCart","Product","Ipo kwenye kapu","In your basket"],
 ["subtotal","Product","Jumla","Subtotal"],
 ["qty","Product","Idadi","Quantity"],
 ["how_title","How to order","Namna ya kuagiza bidhaa","How to order"],
 ["how1","How to order","Chagua bidhaa upendayo","Pick what you like"],
 ["how2","How to order","Tuma oda","Send the order"],
 ["how3","How to order","Tutahakiki oda yako","We confirm your order"],
 ["how4","How to order","Lipia, tukuletee hadi mlangoni","Pay, we deliver to your door"],
 ["cart_title","Basket","Kapu lako","Your basket"],
 ["cart_send","Basket","Tuma oda","Send order"],
 ["cart_total","Basket","Jumla","Total"],
 ["cart_empty","Basket","Hakuna bidhaa","No products"],
 ["cart_clear","Basket","Futa","Clear"],
 ["delivery","Basket","Usafiri","Delivery"],
 ["del_fasta","Basket","Fasta","Fasta"],
 ["del_fasta_s","Basket","Usafiri wa kawaida","Standard delivery"],
 ["del_leo","Basket","Utume Leo","Send today"],
 ["del_leo_s","Basket","Inatumwa leo · kipaumbele","Sent today · priority"],
 ["fee_tbd","Basket","Bei itathibitishwa","Confirmed in chat"],
 ["deliver_to","Basket","Peleka kwa","Deliver to"],
 ["add_addr","Basket","Ongeza anwani","Add address"],
 ["wa_hello","Basket (WhatsApp)","Habari! Napata mzigo huu?","Hello! Can I get these?"],
 ["wa_items","Basket (WhatsApp)","Oda {code} · bidhaa {n}","Order {code} · {n} items"],
 ["wa_ask","Product (WhatsApp)","Habari! Naulizia hii:","Hello! I'm asking about this:"],
 ["wa_one","Product share","Mdau… Tuagize Kariakoo, ni chap na salama","Order from Kariakoo, fast and safe"],
 ["order_sent","Order","Oda imetumwa","Order sent"],
 ["order_sent_s","Order","Maliza kwenye WhatsApp. Fuatilia oda yako hapa.","Finish in WhatsApp. Track your order here."],
 ["guest_hint","Order","Jisajili uone historia na kuagiza tena","Sign up to see your history and reorder"],
 ["o_title","Order","Oda {code}","Order {code}"],
 ["o_items","Order","Bidhaa","Items"],
 ["o_pay","Order","Lipia hapa","Pay here"],
 ["o_pay_s","Order","Ukishalipa, tuma namba ya muamala na jina kwenye WhatsApp","After paying, send the transaction ID and name on WhatsApp"],
 ["o_chat","Order","Ongea na muuzaji","Chat with seller"],
 ["o_notfound","Order","Oda haipatikani","Order not found"],
 ["st_new","Order","Imepokelewa","Received"],
 ["st_progress","Order","Nakurudia","In progress"],
 ["st_invoiced","Order","Ankara imetumwa","Invoice sent"],
 ["st_paid","Order","Imelipwa","Paid"],
 ["st_done","Order","Imekamilika","Completed"],
 ["st_cancelled","Order","Imesitishwa","Cancelled"],
 // customer account
 ["me_guest","Me","Karibu!","Welcome!"],
 ["me_guest_s","Me","Ingia uone oda zako, anwani na kuagiza tena","Sign in for your orders, addresses and reorders"],
 ["signin","Me","Ingia","Sign in"],
 ["signup","Me","Jisajili","Sign up"],
 ["f_name","Me","Jina kamili","Full name"],
 ["f_user","Me","Username","Username"],
 ["f_wa","Me","Namba ya WhatsApp","WhatsApp number"],
 ["f_email","Me","Barua pepe (si lazima)","Email (optional)"],
 ["f_pin","Me","PIN (tarakimu 6)","PIN (6 digits)"],
 ["f_pin2","Me","Rudia PIN","Repeat PIN"],
 ["f_login","Me","Username au barua pepe","Username or email"],
 ["f_secret","Boss · Sign in","PIN au neno la siri","PIN or password"],
 ["have_acc","Me","Una akaunti? Ingia","Have an account? Sign in"],
 ["no_acc","Me","Huna akaunti? Jisajili","No account? Sign up"],
 ["err_taken","Me","Username hii imeshachukuliwa","That username is taken"],
 ["err_wrong","Me","Taarifa si sahihi. Majaribio {n} yamebaki","Wrong details. {n} tries left"],
 ["err_locked","Me","Umejaribu mara nyingi. Subiri dakika 15","Too many tries. Wait 15 minutes"],
 ["err_pin","Me","PIN iwe tarakimu 6","PIN must be 6 digits"],
 ["err_pin2","Me","PIN hazifanani","PINs don't match"],
 ["err_user","Me","Username: herufi 3–20 (a-z, 0-9, _ .)","Username: 3–20 characters (a-z, 0-9, _ .)"],
 ["err_wa","Me","Weka namba sahihi ya WhatsApp","Enter a valid WhatsApp number"],
 ["err_name","Me","Weka jina kamili","Enter your full name"],
 ["unverified","Me","Haijathibitishwa","Not verified"],
 ["verify_note","Me","Uthibitisho kwa code unakuja hivi karibuni","Verification by code is coming soon"],
 ["me_orders","Me","Historia","History"],
 ["me_addr","Me","Anwani","Addresses"],
 ["me_cart","Me","Kapu","Basket"],
 ["me_for_you","Me","Kwa ajili yako","For you"],
 ["no_orders","Me","Bado hujaagiza","No orders yet"],
 ["reorder","Me","Agiza tena","Order again"],
 ["set_title","Me · Settings","Mipangilio","Settings"],
 ["set_contacts","Me · Settings","Mawasiliano","Contacts"],
 ["set_about","Me · Settings","Kuhusu sisi","About us"],
 ["set_terms","Me · Settings","Vigezo na masharti","Terms and conditions"],
 ["signOut","Me · Settings","Kutoka","Log out"],
 ["danger","Me · Settings","Hatari","Danger zone"],
 ["del_acc","Me · Settings","Futa akaunti yangu","Delete my account"],
 ["del_acc_s","Me · Settings","Akaunti na anwani zako zitafutwa. Oda zilizopita zinabaki kwa kumbukumbu ya duka.","Your account and addresses are deleted. Past orders stay in the shop's records."],
 ["yesDelAcc","Me · Settings","Ndiyo, futa akaunti","Yes, delete account"],
 ["about_body","Me · Settings","Niagize Kariakoo ni duka la winga mmoja unayemwamini. Unachagua bidhaa, unatuma oda, tunahakiki, unalipia, tunakuletea mpaka mlangoni.","Niagize Kariakoo is one trusted winga's shop. Pick products, send the order, we confirm, you pay, we deliver to your door."],
 ["terms_body","Me · Settings","Bei na upatikanaji huthibitishwa kwenye WhatsApp kabla ya malipo. Malipo hufanyika moja kwa moja kwa muuzaji. Anwani na namba yako hutumika tu kuleta oda zako. Unaweza kufuta akaunti yako wakati wowote.","Price and stock are confirmed on WhatsApp before you pay. You pay the seller directly. Your address and number are used only to deliver your orders. You can delete your account any time."],
 ["addr_title","Me · Addresses","Anwani zangu","My addresses"],
 ["addr_add","Me · Addresses","Ongeza anwani","Add address"],
 ["addr_search","Me · Addresses","Tafuta mtaa, jengo au eneo","Search street, building or area"],
 ["addr_manual","Me · Addresses","Andika mwenyewe","Type it yourself"],
 ["addr_label","Me · Addresses","Jina (mf. Nyumbani, Kazini)","Name (e.g. Home, Work)"],
 ["addr_line","Me · Addresses","Anwani kamili","Full address"],
 ["addr_landmark","Me · Addresses","Alama ya karibu (mf. karibu na msikiti)","Nearby landmark"],
 ["addr_terms","Me · Addresses","Nakubali vigezo na masharti, na anwani hii ishirikishwe na muuzaji kwa ajili ya kuleta oda","I accept the terms, and this address may be shared with the seller to deliver my orders"],
 ["addr_need_terms","Me · Addresses","Kubali vigezo kwanza","Accept the terms first"],
 ["addr_none","Me · Addresses","Huna anwani bado","No addresses yet"],
 ["addr_nores","Me · Addresses","Hakuna matokeo. Andika mwenyewe","No results. Type it yourself"],
 // boss: sign in and menu
 ["boss_app","Boss · Sign in","Niagize mdau","Niagize Boss"],
 ["login","Boss · Sign in","Ingia","Sign in"],
 ["email","Boss · Sign in","Barua pepe","Email"],
 ["wrongLogin","Boss · Sign in","Taarifa ulizoweka sio sahihi, angalia na ujaribu tena","Wrong details, check and try again"],
 ["accountHint","Boss · Sign in","Omba akaunti kwa Super Admin","Ask the Super Admin for an account"],
 ["notAdmin","Boss · Sign in","Akaunti hii haina ruhusa, wasiliana na Super Admin","This account has no access, contact the Super Admin"],
 ["home","Boss · Menu","Nyumbani","Home"],
 ["addPhotos","Boss · Menu","Ongeza picha","Add photos"],
 ["products","Boss · Menu","Bidhaa","Products"],
 ["nav_orders","Boss · Menu","Oda","Orders"],
 // boss: dashboard
 ["d_title","Boss · Dashboard","Leo na siku 7","Today and last 7 days"],
 ["d_sales","Boss · Dashboard","Mauzo","Sales"],
 ["d_orders","Boss · Dashboard","Oda","Orders"],
 ["d_visitors","Boss · Dashboard","Wageni","Visitors"],
 ["d_conv","Boss · Dashboard","Conversion","Conversion"],
 ["d_open","Boss · Dashboard","Oda wazi","Open orders"],
 ["d_new","Boss · Dashboard","mpya","new"],
 ["d_funnel","Boss · Dashboard","Safari ya mteja","Customer funnel"],
 ["d_views","Boss · Dashboard","Wameona","Viewed"],
 ["d_carts","Boss · Dashboard","Kapuni","In basket"],
 ["d_chats","Boss · Dashboard","Wameulizia","Asked"],
 ["d_paid","Boss · Dashboard","Wamelipa","Paid"],
 ["d_top","Boss · Dashboard","Zinazofanya vizuri","Top products"],
 ["d_live","Boss · Dashboard","bidhaa dukani","products live"],
 ["q_orders","Boss · Home","Oda","Orders"],
 ["q_archive","Boss · Home","Archive","Archive"],
 ["q_share","Boss · Home","Share link","Share link"],
 ["q_shop","Boss · Home","Cheki duka","See shop"],
 ["my_shop","Boss · Home","Duka langu","My shop"],
 ["t_ending","Boss · Home","Bado zipo?","Still there?"],
 ["stillHere","Boss · Home","Bado upo?","Still here"],
 ["markSold","Boss · Home","Mzigo umetuishia","Sold out"],
 ["st_live","Boss · Home","Live","Live"],
 ["st_pilot","Boss · Home","Test","Test"],
 ["st_down","Boss · Home","Haipatikani","Down"],
 ["share_title","Boss · Share","Shiriki duka","Share the shop"],
 ["share_link","Boss · Share","Link yangu","My link"],
 ["shareText","Boss · Share","Niagize Kariakoo, ni chap na salama","Niagize Kariakoo, fast and safe"],
 ["emptyHome","Boss · Home","Ongeza picha ya bidhaa zako","Add photos of your products"],
 ["steps_title","Boss · Discover","Hatua 3 tu… anza hapa","Just 3 steps… start here"],
 ["step1","Boss · Discover","Namba ya WhatsApp","WhatsApp number"],
 ["step1s","Boss · Discover","Oda zitakufikia hapa","Orders reach you here"],
 ["step2","Boss · Discover","Weka bidhaa 3","Add 3 products"],
 ["step2s","Boss · Discover","Ongeza picha ya bidhaa zako","Add photos of your products"],
 ["step3","Boss · Discover","Share link ya duka kwa wateja","Share the shop link with customers"],
 ["step3s","Boss · Discover","Au share link kwenye status na kurasa zako mtandaoni","Or on your status and social pages"],
 ["stepsDone","Boss · Discover","Duka liko tayari","The shop is ready"],
 ["go","Boss · Discover","Anza","Start"],
 // boss: orders
 ["o_list","Boss · Orders","Oda","Orders"],
 ["f_new","Boss · Orders","Mpya","New"],
 ["f_open","Boss · Orders","Zinaendelea","Open"],
 ["f_closed","Boss · Orders","Zimefungwa","Closed"],
 ["no_orders_b","Boss · Orders","Hakuna oda hapa","No orders here"],
 ["guest","Boss · Orders","Mgeni","Guest"],
 ["a_progress","Boss · Orders","Nakurudia","Working on it"],
 ["a_invoice","Boss · Orders","Tuma ankara","Send invoice"],
 ["a_paid","Boss · Orders","Imelipwa","Paid"],
 ["a_done","Boss · Orders","Imekamilika","Completed"],
 ["a_cancel","Boss · Orders","Sitisha","Cancel"],
 ["a_call","Boss · Orders","Piga simu","Call"],
 ["cust","Boss · Orders","Mteja","Customer"],
 ["cust_phone","Boss · Orders","Namba ya mteja","Customer number"],
 ["fee_set","Boss · Orders","Bei ya usafiri (TSh)","Delivery fee (TSh)"],
 ["pay_ref","Boss · Orders","Namba ya muamala (si lazima)","Transaction ID (optional)"],
 ["pay_name","Boss · Orders","Jina la aliyelipa (si lazima)","Payer name (optional)"],
 ["reason","Boss · Orders","Sababu","Reason"],
 ["r_price","Boss · Orders","Bei","Price"],
 ["r_stock","Boss · Orders","Mzigo umeisha","Out of stock"],
 ["r_noreply","Boss · Orders","Hajajibu","No reply"],
 ["r_other","Boss · Orders","Nyingine","Other"],
 ["need_phone","Boss · Orders","Weka namba ya mteja kwanza","Add the customer's number first"],
 ["inv_hi","Boss · Orders (WhatsApp)","Habari {name}! Ankara ya oda {code}:","Hi {name}! Invoice for order {code}:"],
 ["inv_pay","Boss · Orders (WhatsApp)","Lipia kupitia:","Pay with:"],
 ["inv_after","Boss · Orders (WhatsApp)","Ukishalipa, tuma namba ya muamala na jina. Fuatilia oda:","After paying, send the transaction ID and name. Track the order:"],
 ["msg_progress","Boss · Orders (WhatsApp)","Tumepokea oda {code}. Tunaishughulikia sasa hivi.","We got order {code}. Working on it now."],
 ["msg_paid","Boss · Orders (WhatsApp)","Tumepokea malipo ya oda {code}. Asante! 🙏","Payment received for order {code}. Thank you! 🙏"],
 ["msg_done","Boss · Orders (WhatsApp)","Oda {code} imekamilika. Asante kwa kuagiza Niagize Kariakoo! Agiza tena:","Order {code} is complete. Thank you! Order again:"],
 ["msg_cancel","Boss · Orders (WhatsApp)","Oda {code} imesitishwa. Tuandikie ukihitaji msaada.","Order {code} was cancelled. Message us if you need help."],
 // boss: add / edit product
 ["add_title","Boss · Add product","Ongeza bidhaa","Add product"],
 ["add_saved","Boss · Add product","{n} zimehifadhiwa","{n} saved"],
 ["photos_max","Boss · Add product","Picha zaidi?","More photos?"],
 ["name_ph","Boss · Add product","Jina la bidhaa","Product name"],
 ["price_ph","Boss · Add product","Bei","Price"],
 ["ask_check","Boss · Add product","Acha mteja aulize bei","Let the customer ask the price"],
 ["desc_ph","Boss · Add product","Maelezo ya ziada (size, rangi, material)","More details (size, colour, material)"],
 ["tags_ph","Boss · Add product","#tag (mf. #nike #mpya)","#tags (e.g. #nike #new)"],
 ["quality","Boss · Add product","Ubora","Quality"],
 ["add_more","Boss · Add product","Bidhaa nyingine","Another product"],
 ["add_done","Boss · Add product","Hifadhi, Maliza","Save & finish"],
 ["need_photo","Boss · Add product","Ongeza angalau picha moja","Add at least one photo"],
 ["need_name","Boss · Add product","Jina la bidhaa","Product name"],
 ["upload_fail","Boss · Add product","Imeshindwa kupakia: {x}","Upload failed: {x}"],
 ["savedN","Boss · Add product","Bidhaa {n} zimeongezwa","{n} products added"],
 ["list_title","Boss · Products","Bidhaa zilizopo","Your products"],
 ["f_hidden","Boss · Products","Zilizofichwa","Hidden"],
 ["f_archive","Boss · Products","Archive","Archive"],
 ["hidden","Boss · Products","Imefichwa","Hidden"],
 ["archived","Boss · Products","Archive","Archived"],
 ["noProducts","Boss · Products","Hakuna bidhaa","No products"],
 ["unarchive","Boss · Products","Rudisha dukani","Back to shop"],
 ["unarchived","Boss · Products","Imerudi dukani kwa siku 60","Back in the shop for 60 days"],
 ["archive_hint","Boss · Products","Bidhaa huenda Archive yenyewe baada ya siku 60","Products move to Archive by themselves after 60 days"],
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
 ["shop_settings_s","Boss · Profile","WhatsApp, malipo na usafiri","WhatsApp, payments and delivery"],
 ["team","Boss · Profile","Wasaidizi","Assistants"],
 ["team_s","Boss · Profile","Wanaoweza kuongeza bidhaa na kuhudumia oda","People who add products and serve orders"],
 ["pin_title","Boss · Profile","Username & PIN","Username & PIN"],
 ["pin_title_s","Boss · Profile","Ingia kwa username na PIN","Sign in with username and PIN"],
 ["pin_done","Boss · Profile","PIN imewekwa. Ingia kwa username na PIN","PIN set. Sign in with username and PIN"],
 ["wa_label","Boss · Settings","Namba ya WhatsApp","WhatsApp number"],
 ["pay_title","Boss · Settings","Namba za malipo","Payment numbers"],
 ["pay_num","Boss · Settings","Namba ya malipo","Payment number"],
 ["pay_acc","Boss · Settings","Jina la akaunti","Account name"],
 ["fee_title","Boss · Settings","Bei za usafiri","Delivery fees"],
 ["reset_demo","Boss · Settings","Reset examples","Reset examples"],
 ["team_add","Boss · Assistants","Ongeza msaidizi","Add assistant"],
 ["team_name","Boss · Assistants","Jina","Name"],
 ["team_pw","Boss · Assistants","Neno la siri (herufi 8+)","Password (8+ characters)"],
 ["team_note","Boss · Assistants","Msaidizi anaweza kuongeza na kubadili bidhaa, na kuhudumia oda. Hawezi kufuta, wala kubadili mipangilio.","An assistant can add and edit products and serve orders. They can't delete or change settings."],
 ["team_added","Boss · Assistants","Msaidizi ameongezwa. Mpe barua pepe na neno la siri","Assistant added. Give them the email and password"],
 ["team_removed","Boss · Assistants","Msaidizi ameondolewa","Assistant removed"],
 ["team_exists","Boss · Assistants","Barua pepe hii tayari ina akaunti","This email already has an account"],
 ["team_confirm","Boss · Assistants","Ondoa {x}?","Remove {x}?"],
 ["you","Boss · Assistants","Wewe","You"]
];
/* categories: 6 groups + sub-groups. [key, Kiswahili, English, [[subKey, sw, en], …]] */
W.TAX = [
 ["accessories","Mapambo","Accessories",[["jewelry","Jewelry","Jewelry"],["watches","Saa","Watches"],["eyewear","Miwani","Eyewear"],["bags","Mabegi","Bags"]]],
 ["shoes","Viatu","Shoes",[["men","Wanaume","Men"],["women","Wanawake","Women"],["kids","Watoto","Kids"],["sport","Raba","Sneakers"]]],
 ["kids","Mama & Watoto","Mother & Kids",[["baby","Mtoto mchanga","Baby"],["kidswear","Nguo za watoto","Kids' clothes"],["toys","Midoli","Toys"],["mother","Mama","Mother"]]],
 ["fashion","Nguo & Fashion","Clothing & Fashion",[["women","Wanawake","Women"],["men","Wanaume","Men"],["kitenge","Vitenge","Kitenge"]]],
 ["electronics","Elektroniki","Electronics & Gadgets",[["phones","Simu","Phones"],["accessories","Vifaa vya simu","Phone accessories"],["audio","Spika & Earphones","Audio"],["home","Vifaa vya nyumbani","Home appliances"]]],
 ["other","Nyingine","Other",[["home","Nyumbani","Home"],["beauty","Urembo","Beauty"],["health","Afya","Health"],["other","Nyingine","Other"]]]
];
W.CATS = W.TAX.map(function (c) { return c[0]; });
var STR = { sw: {}, en: {} };
W.STRINGS.forEach(function (r) { STR.sw[r[0]] = r[2]; STR.en[r[0]] = r[3]; });
W.TAX.forEach(function (c) { STR.sw["cat_" + c[0]] = c[1]; STR.en["cat_" + c[0]] = c[2]; c[3].forEach(function (s) { STR.sw["sub_" + c[0] + "_" + s[0]] = s[1]; STR.en["sub_" + c[0] + "_" + s[0]] = s[2]; }); });
W.subs = function (cat) { var c = W.TAX.find(function (x) { return x[0] === cat; }); return c ? c[3].map(function (s) { return s[0]; }) : []; };
W.PROVIDERS = ["M-PESA","AIRTEL MONEY","HALOPESA","MIXX BY YAS","CRDB","NMB","SELCOM"];
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
W.ls = ls;
W.lang = ls("winga.lang") || "sw";
W.setLang = function (l) { W.lang = l; ls("winga.lang", l); document.documentElement.lang = l; };
W.t = function (k, v) { var s = (STR[W.lang] || STR.sw)[k]; if (s == null) s = STR.sw[k] || k; if (v) for (var p in v) s = s.split("{" + p + "}").join(v[p]); return s; };
W.catLabel = function (c, s) { return s ? W.t("sub_" + c + "_" + s) : W.t("cat_" + c); };
document.documentElement.lang = W.lang;

/* ---------------- theme: light / dark (first visit follows the phone) ---------------- */
W.isDark = function () { var th = ls("winga.theme"); if (th === "dark" || th === "light") return th === "dark"; try { return matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; } };
W.applyTheme = function (th) { if (th) ls("winga.theme", th); document.documentElement.setAttribute("data-theme", W.isDark() ? "dark" : "light"); };
W.toggleTheme = function () { W.applyTheme(W.isDark() ? "light" : "dark"); };
W.applyTheme();

/* brand mark: the Dar es Salaam sun rising over the Indian Ocean, light on the water */
W.MARK = '<svg class="brandmark" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="nkSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD25A"/><stop offset="1" stop-color="#F28C1B"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="#0F2A44"/><path d="M8 23a12 12 0 0 1 24 0z" fill="url(#nkSun)"/><g stroke="#F6B41C" stroke-width="1.8" stroke-linecap="round"><path d="M20 6.5v3M9.4 10.9l2.1 2.1M30.6 10.9l-2.1 2.1"/></g><g stroke-linecap="round"><path d="M6 25.5h28" stroke="#5FB4C9" stroke-width="2"/><path d="M12 29h16" stroke="#F6B41C" stroke-width="2"/><path d="M15.5 32.5h9" stroke="#F6B41C" stroke-width="2" opacity=".7"/></g></svg>';
/* sun loader: the same sun, rays turning. Used instead of "loading" words */
W.SUN = '<span class="sunload" role="img" aria-label="…"><svg viewBox="0 0 48 48" fill="none" stroke-linecap="round"><g class="rays" stroke="var(--jua)" stroke-width="3"><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/></g><circle cx="24" cy="24" r="7.5" fill="var(--jua)"/></svg></span>';
/* error screen used by both apps */
W.errorScreen = function (onRetry) {
  var r = document.getElementById("errRoot"); if (!r) { r = document.createElement("div"); r.id = "errRoot"; document.body.appendChild(r); }
  r.innerHTML = '<div class="errscreen" role="alert"><span class="erricon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5v.3"/></svg></span><h2>' + W.esc(W.t("err_title")) + '</h2><p>' + W.esc(W.t("err_sub")) + '</p><button class="btn primary" id="errRetry">' + W.esc(W.t("retry")) + '</button></div>';
  document.getElementById("errRetry").onclick = function () { r.innerHTML = ""; onRetry && onRetry(); };
};

/* ---------------- helpers ---------------- */
W.$ = function (s, r) { return (r || document).querySelector(s); };
W.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
W.money = function (n) { return Math.round(+n || 0).toLocaleString("en-US"); };
W.parseMoney = function (v) { if (v == null || v === "") return null; var s = String(v).toLowerCase().replace(/tsh|tzs|sh/g, "").trim(); var k = /k$/.test(s); s = s.replace(/[^0-9.]/g, ""); if (!s) return null; var n = parseFloat(s); return Math.round(k ? n * 1000 : n); };
W.waPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };
W.wa = function (phone, text) { return "https://wa.me/" + (W.waPhone(phone) || "") + "?text=" + encodeURIComponent(text); };
W.DAY = 864e5; W.SHOW_DAYS = 60;   // products move to Archive after 60 days
W.daysLeft = function (p) { return W.SHOW_DAYS - Math.floor((Date.now() - new Date(p.refreshed_at).getTime()) / W.DAY); };
W.ago = function (iso) { var d = Math.floor((Date.now() - new Date(iso).getTime()) / W.DAY); return d <= 0 ? W.t("agoToday") : d === 1 ? W.t("agoYday") : W.t("agoDays", { n: d }); };
W.when = function (iso) { var d = new Date(iso); return d.toLocaleDateString(W.lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short" }) + " · " + d.toTimeString().slice(0, 5); };
W.parseTags = function (s) { return String(s || "").split(/[\s,]+/).map(function (x) { return x.replace(/^#+/, "").toLowerCase().replace(/[^a-z0-9_\-]/g, ""); }).filter(Boolean).slice(0, 8); };
W.toast = function (m) { var r = document.getElementById("toastRoot"); if (!r) return; r.innerHTML = '<div class="toast" role="status">' + W.esc(m) + "</div>"; clearTimeout(W.toast._t); W.toast._t = setTimeout(function () { r.innerHTML = ""; }, 2200); };
W.copy = function (text, fallbackEl) { return navigator.clipboard.writeText(text).then(function(){ W.toast(W.t("copied")); }, function(){ if (fallbackEl) { var r = document.createRange(); r.selectNodeContents(fallbackEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); } }); };
W.uid = function () { return (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); })); };
W.standalone = function () { try { return navigator.standalone === true || matchMedia("(display-mode: standalone)").matches; } catch (e) { return false; } };
W.sid = (function () { var k = "niagize.sid", v = ls(k); if (!v) { v = W.uid().slice(0, 18); ls(k, v); } return v; })();

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
var sb = live ? window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, storageKey: W.APP === "boss" ? "winga.auth" : "niagize.customer" } }) : null;
W.mode = live ? "live" : "demo";
W.stage = C.stage || "pilot";   // "production" or "pilot"
W.frame = function () {};       // the coloured frame was removed in v2; kept so older calls don't break
function pub(path) { if (!path) return ""; if (/^data:|^https?:/.test(path)) return path; return C.url + "/storage/v1/object/public/products/" + path; }
W.img = pub;
function decorate(p) {
  p.thumbUrl = pub((p.thumbs && p.thumbs[0]) || (p.images && p.images[0]));
  p.imageUrls = (p.images || []).map(pub);
  p.thumbUrls = (p.thumbs && p.thumbs.length ? p.thumbs : p.images || []).map(pub);
  p.tags = p.tags || []; p.rating = p.rating || 2; p.ordered = p.ordered || 0;
  if (p.product_private) delete p.product_private;
  return p;
}
function archiveAged(p) { if ((p.status === "active" || p.status === "soldout") && W.daysLeft(p) <= 0) p.status = "archived"; }
function cacheSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cacheGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
async function fnErr(r) { var msg = "error", extra = {}; try { extra = await r.error.context.json(); msg = extra.error || msg; } catch (e) {} var e = new Error(msg); e.info = extra; return e; }

/* --- example mode store --- */
var DEMO_KEY = "winga.demo.v4";
function demoLoad() { var d = cacheGet(DEMO_KEY); if (d && d.products) return d; d = demoSeed(); demoSave(d); return d; }
function demoSave(d) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(d)); } catch (e) { W._demoMem = d; } }
function demoGet() { return W._demoMem || demoLoad(); }
function sample(label, bg, fg, shape, h) {
  var c = document.createElement("canvas"); c.width = 600; c.height = h || 600; var x = c.getContext("2d"), H = c.height, oy = (H - 600) / 2;
  x.fillStyle = bg; x.fillRect(0, 0, 600, H); x.fillStyle = fg; x.translate(0, oy);
  if (shape === "shoe") { x.beginPath(); x.moveTo(90,380); x.quadraticCurveTo(100,265,210,250); x.lineTo(310,312); x.quadraticCurveTo(460,325,510,400); x.lineTo(510,440); x.lineTo(90,440); x.closePath(); x.fill(); x.fillStyle="rgba(0,0,0,.25)"; x.fillRect(90,428,420,16); }
  else if (shape === "phone") { x.beginPath(); x.roundRect ? x.roundRect(200,100,200,380,30) : x.rect(200,100,200,380); x.fill(); x.fillStyle="rgba(255,255,255,.35)"; x.fillRect(220,135,160,300); }
  else if (shape === "cloth") { for (var i=0;i<7;i++){ x.fillStyle = i%2?fg:"rgba(255,255,255,.55)"; x.fillRect(100,100+i*52,400,52);} x.fillStyle="rgba(0,0,0,.18)"; for (var j=0;j<6;j++){ x.beginPath(); x.arc(160+j*56,126+j*52,15,0,7); x.fill(); } }
  else if (shape === "bag") { x.beginPath(); x.roundRect ? x.roundRect(140,220,320,250,30) : x.rect(140,220,320,250); x.fill(); x.strokeStyle=fg; x.lineWidth=20; x.beginPath(); x.arc(300,225,86,Math.PI,0); x.stroke(); }
  else if (shape === "bottle") { x.beginPath(); x.roundRect ? x.roundRect(240,180,120,300,26) : x.rect(240,180,120,300); x.fill(); x.fillRect(270,120,60,70); }
  else if (shape === "glasses") { x.lineWidth = 18; x.strokeStyle = fg; x.beginPath(); x.arc(200,300,80,0,7); x.stroke(); x.beginPath(); x.arc(400,300,80,0,7); x.stroke(); x.beginPath(); x.moveTo(280,290); x.lineTo(320,290); x.stroke(); }
  else { x.beginPath(); x.arc(300,290,140,0,7); x.fill(); }
  x.setTransform(1,0,0,1,0,0);
  x.fillStyle = "rgba(15,42,68,.8)"; x.fillRect(0, H - 64, 600, 64); x.fillStyle = "#fff"; x.font = "600 26px 'IBM Plex Sans', sans-serif"; x.fillText(label, 22, H - 24);
  x.fillStyle = "#F6B41C"; x.font = "600 16px 'IBM Plex Mono', monospace"; x.fillText("MFANO", 500, H - 24);
  return c.toDataURL("image/jpeg", 0.8);
}
function demoSeed() {
  var now = Date.now(), D = W.DAY;
  var defs = [
    ["Raba brown, Air style", "shoes", "sport", 35000, "Ngozi laini, soli imara. Saizi 40–44. Inafaa kazini na mtaani.", now - 2*36e5, "#C9A27E", "#6B3E1E", "shoe", 760, 3, 14, ["nike","raba"]],
    ["Sandals za kike", "shoes", "women", 18000, "Nyeusi na beige. Saizi 37–40.", now - D, "#E9D7C5", "#2B2B2B", "shoe", 600, 2, 6, ["sandals"]],
    ["Tecno Spark 20, 128GB", "electronics", "phones", null, "Mpya kwenye boksi, warranty ya mwaka mmoja.", now - 2*D, "#D3DEE8", "#1C3A54", "phone", 820, 3, 3, ["tecno"]],
    ["Chaja Type-C 33W", "electronics", "accessories", 12000, "Inachaji haraka. Kwa simu zote za Type-C.", now - 3*36e5, "#E7ECEF", "#3B4A57", "phone", 640, 2, 21, ["chaja"]],
    ["Kitenge cha Kongo, doti 1", "fashion", "kitenge", 22000, "Pamba halisi, rangi haitoki.", now - 3*D, "#F6C85F", "#1F6F5C", "cloth", 700, 3, 9, ["kitenge"]],
    ["Begi la mgongoni", "accessories", "bags", 27000, "Laptop ya 15\" inaingia. Lina mifuko 4.", now - 55*D, "#B9C9B0", "#2F4B32", "bag", 600, 2, 4, ["begi"]],
    ["Mafuta ya nywele, 250ml", "other", "beauty", 9500, "", now - 64*D, "#F2D7E0", "#8A2E4E", "bottle", 680, 1, 2, []],
    ["Miwani ya jua", "accessories", "eyewear", 15000, "UV400. Fremu nyeusi.", now - 5*D, "#EDE6DA", "#2B2B2B", "glasses", 560, 2, 7, ["miwani"]],
    ["Shati la kitambaa", "fashion", "men", 25000, "M, L, XL.", now - 6*D, "#E4EEF7", "#1F5C8F", "cloth", 720, 2, 0, []]
  ];
  return { shop: { name: "Niagize Kariakoo", tagline: "", whatsapp: "255700000000", fee_fasta: 3000, fee_leo: 7000, payments: [{ provider: "M-PESA", number: "5512 3487", name: "BOSS DEUS" }] },
    products: defs.map(function (d, i) { var img = sample(d[0].split(",")[0], d[6], d[7], d[8], d[9]);
      return { id: "demo-" + i, created_at: new Date(d[5]).toISOString(), refreshed_at: new Date(d[5]).toISOString(), name: d[0], category: d[1], subcategory: d[2], price: d[3], description: d[4], images: [img], thumbs: [img], status: i === 8 ? "hidden" : "active", asks: d[11], ordered: d[11], rating: d[10], tags: d[12] }; }),
    orders: [], events: [], users: [], addresses: [], me: null };
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
function demoCode() { var a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", c = "NK-"; for (var i = 0; i < 5; i++) c += a[Math.floor(Math.random() * a.length)]; return c; }
function demoOrderView(o, d) { var x = JSON.parse(JSON.stringify(o)); x.payments = d.shop.payments; x.whatsapp = d.shop.whatsapp; return x; }
var PCOLS = "id,created_at,refreshed_at,name,description,category,subcategory,tags,rating,ordered,price,images,thumbs,status,asks";

/* --- public API --- */
W.db = {
  live: live,
  /* shop */
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
  async ping() { if (!live) return "pilot"; try { var r = await sb.from("shop").select("id").eq("id", 1).maybeSingle(); return r.error ? "down" : (W.stage === "production" ? "live" : "pilot"); } catch (e) { return "down"; } },
  /* products */
  async listProducts(admin) {
    if (!live) {
      var all = demoGet().products.map(function (p) { return decorate(Object.assign({}, p)); });
      all.forEach(archiveAged);
      return admin ? all : all.filter(function (p) { return p.status === "active" || p.status === "soldout"; });
    }
    var r = await sb.from("products").select(PCOLS).order("refreshed_at", { ascending: false }).limit(1000);
    if (r.error) { var c = !admin && cacheGet("winga.cache.products"); if (c) { W.offline = true; return c.map(decorate); } throw r.error; }
    if (!admin) cacheSet("winga.cache.products", r.data);
    r.data.forEach(archiveAged);   // the database archives once a day; show it straight away here too
    return r.data.map(decorate);
  },
  async createProduct(data, photos) {
    var id = W.uid(), up = await uploadPhotos(id, photos, 0);
    if (!live) { var now = new Date().toISOString(), d = demoGet(); var p = Object.assign({ id: id, created_at: now, refreshed_at: now, status: "active", asks: 0, ordered: 0 }, data, up); d.products.unshift(p); demoSave(d); return decorate(Object.assign({}, p)); }
    var r = await sb.from("products").insert(Object.assign({ id: id }, data, up)).select(PCOLS).single(); if (r.error) throw r.error;
    return decorate(r.data);
  },
  async updateProduct(id, patch) {
    if (!live) { var d = demoGet(), p = d.products.find(function (x) { return x.id === id; }); Object.assign(p, patch); demoSave(d); return; }
    var r = await sb.from("products").update(patch).eq("id", id); if (r.error) throw r.error;
  },
  async updateMany(rows) { for (var i = 0; i < rows.length; i++) await this.updateProduct(rows[i].id, rows[i].patch); },
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
  async deleteProduct(p) {
    if (!live) { var d = demoGet(); d.products = d.products.filter(function (x) { return x.id !== p.id; }); demoSave(d); return; }
    var paths = (p.images || []).concat(p.thumbs || []).filter(isStored);
    if (paths.length) await sb.storage.from("products").remove(paths);
    var r = await sb.from("products").delete().eq("id", p.id); if (r.error) throw r.error;
  },
  /* events for the dashboard: visit, view, cart, chat. Fire and forget */
  log(type, pid) {
    if (!live) { var d = demoGet(); d.events.push({ type: type, product_id: pid || null, session: W.sid, at: new Date().toISOString() }); if (d.events.length > 500) d.events = d.events.slice(-500); demoSave(d); return; }
    sb.rpc("log_event", { t: type, pid: pid || null, sid: W.sid }).then(function(){}, function(){});
  },
  /* orders: created on Tuma oda; prices are taken from the database */
  async createOrder(items, delivery, addressId, name, phone) {
    if (!live) {
      var d = demoGet(), sub = 0, cnt = 0, priced = true, rows = [];
      items.forEach(function (it) { var p = d.products.find(function (x) { return x.id === it.id && x.status === "active"; }); if (!p) return; var q = Math.max(1, Math.min(99, it.qty || 1)); rows.push({ product_id: p.id, name: p.name, price: p.price, qty: q, thumb: p.thumbs[0] }); if (p.price == null) priced = false; else sub += p.price * q; cnt += q; p.ordered = (p.ordered || 0) + q; });
      var me = d.me && d.users.find(function (u) { return u.username === d.me; }); var addr = addressId && d.addresses.find(function (a) { return a.id === addressId; });
      var o = { code: demoCode(), created_at: new Date().toISOString(), status: "new", delivery: delivery, delivery_fee: delivery === "leo" ? d.shop.fee_leo : d.shop.fee_fasta, subtotal: sub, priced: priced, items_count: cnt, items: rows,
        customer: me ? me.username : null, customer_name: me ? me.full_name : name, customer_phone: me ? me.whatsapp : phone, address: addr ? { label: addr.label, line: addr.line, landmark: addr.landmark } : null, history: [{ s: "new", at: new Date().toISOString() }] };
      d.orders.unshift(o); demoSave(d); return { code: o.code, subtotal: sub, fee: o.delivery_fee, priced: priced, count: cnt };
    }
    var r = await sb.rpc("create_order", { items: items, delivery: delivery, address_id: addressId || null, name: name || null, phone: phone || null });
    if (r.error) throw r.error; return r.data;
  },
  async getOrder(code) {
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === String(code).toUpperCase(); }); return o ? demoOrderView(o, d) : null; }
    var r = await sb.rpc("get_order", { c: code }); if (r.error) throw r.error; return r.data;
  },
  async myOrders() {
    if (!live) { var d = demoGet(); return d.orders.filter(function (o) { return d.me && o.customer === d.me; }); }
    var s = await sb.auth.getSession(); if (!s.data.session) return [];
    var r = await sb.from("orders").select("code,created_at,status,subtotal,priced,delivery_fee,items_count,order_items(product_id,name,price,qty,thumb)").eq("customer_id", s.data.session.user.id).order("created_at", { ascending: false }).limit(100);
    if (r.error) throw r.error; return r.data.map(function (o) { o.items = o.order_items; delete o.order_items; return o; });
  },
  /* team side */
  async orders() {
    if (!live) return demoGet().orders.map(function (o) { return JSON.parse(JSON.stringify(o)); });
    var r = await sb.from("orders").select("*,order_items(product_id,name,price,qty,thumb)").order("created_at", { ascending: false }).limit(300);
    if (r.error) throw r.error; return r.data.map(function (o) { o.items = o.order_items; delete o.order_items; return o; });
  },
  async setOrder(code, status, extra) {
    extra = extra || {};
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === code; }); if (o.status !== status) o.history.push({ s: status, at: new Date().toISOString() }); o.status = status; ["pay_ref","pay_name"].forEach(function (k) { if (extra[k]) o[k] = extra[k]; }); if (extra.reason) o.cancel_reason = extra.reason; if (extra.phone) o.customer_phone = extra.phone; if (extra.fee != null) o.delivery_fee = extra.fee; demoSave(d); return demoOrderView(o, d); }
    var r = await sb.rpc("set_order", { c: code, st: status, ref: extra.pay_ref || null, payer: extra.pay_name || null, reason: extra.reason || null, phone: extra.phone || null, fee: extra.fee == null ? null : extra.fee });
    if (r.error) throw r.error; return r.data;
  },
  async dashboard(days) {
    days = days || 7;
    if (!live) {
      var d = demoGet(), since = Date.now() - days * W.DAY, ev = d.events.filter(function (e) { return new Date(e.at) > since; });
      var os = d.orders.filter(function (o) { return new Date(o.created_at) > since; }), paid = os.filter(function (o) { return o.status === "paid" || o.status === "done"; });
      var byDay = []; for (var i = days - 1; i >= 0; i--) { var day = new Date(Date.now() - i * W.DAY).toISOString().slice(0, 10); byDay.push({ d: day, orders: d.orders.filter(function (o) { return o.created_at.slice(0, 10) === day; }).length + [2,1,3,0,4,2,1][i % 7], visitors: [9,6,12,4,15,8,7][i % 7] }); }
      var sessions = {}; ev.forEach(function (e) { if (e.type === "visit") sessions[e.session] = 1; });
      return { visitors: Object.keys(sessions).length + 61, views: ev.filter(function (e) { return e.type === "view"; }).length + 140, carts: ev.filter(function (e) { return e.type === "cart"; }).length + 23, chats: ev.filter(function (e) { return e.type === "chat"; }).length + 9,
        orders: os.length + 13, paid: paid.length + 8, sales: paid.reduce(function (s, o) { return s + o.subtotal + (o.delivery_fee || 0); }, 0) + 412000,
        open: d.orders.filter(function (o) { return ["new","progress","invoiced","paid"].indexOf(o.status) >= 0; }).length, new: d.orders.filter(function (o) { return o.status === "new"; }).length, by_day: byDay,
        top: d.products.slice().sort(function (a, b) { return (b.ordered || 0) - (a.ordered || 0); }).slice(0, 5).map(function (p) { return { id: p.id, name: p.name, thumb: p.thumbs[0], ordered: p.ordered || 0, views: (p.ordered || 0) * 4 }; }) };
    }
    var r = await sb.rpc("dashboard", { days: days }); if (r.error) throw r.error; return r.data;
  },
  /* team: list / add / remove assistants (server function checks the caller is an owner) */
  async team(action, body) {
    if (!live) {
      var d = demoGet(); d.team = d.team || [{ user_id: "demo-boss", name: "Boss Deus", role: "boss", email: "boss@mfano" }];
      if (action === "add") { if (d.team.some(function (m) { return m.email === body.email; })) throw new Error("exists"); d.team.push({ user_id: W.uid(), name: body.name, role: "assistant", email: body.email }); }
      if (action === "remove") d.team = d.team.filter(function (m) { return m.user_id !== body.user_id; });
      demoSave(d); return { ok: true, team: d.team };
    }
    var r = await sb.functions.invoke("team", { body: Object.assign({ action: action }, body || {}) });
    if (r.error) throw await fnErr(r); return r.data;
  },
  /* accounts: username + 6-digit PIN (customers and staff); staff can still use email + password */
  async account(action, body) {
    if (!live) {
      var d = demoGet(); body = body || {};
      if (action === "signup") { if (d.users.some(function (u) { return u.username === body.username; })) throw new Error("taken"); d.users.push({ username: body.username, pin: body.pin, full_name: body.full_name, whatsapp: W.waPhone(body.whatsapp), email: body.email || null }); d.me = body.username; demoSave(d); return { ok: true }; }
      if (action === "login") { var u = d.users.find(function (x) { return x.username === String(body.login).toLowerCase() && x.pin === body.pin; }); if (!u) { var e = new Error("wrong"); e.info = { left: 4 }; throw e; } d.me = u.username; demoSave(d); return { ok: true }; }
      if (action === "contacts") { var me = d.users.find(function (x) { return x.username === d.me; }); if (body.whatsapp) me.whatsapp = W.waPhone(body.whatsapp); if (body.email !== undefined) me.email = body.email || null; demoSave(d); return { ok: true }; }
      if (action === "delete") { d.users = d.users.filter(function (x) { return x.username !== d.me; }); d.addresses = d.addresses.filter(function (a) { return a.owner !== d.me; }); d.me = null; demoSave(d); return { ok: true }; }
      if (action === "set_pin") return { ok: true };
      return { ok: true };
    }
    var r = await sb.functions.invoke("account", { body: Object.assign({ action: action }, body || {}) });
    if (r.error) throw await fnErr(r);
    if (r.data && r.data.session) await sb.auth.setSession(r.data.session);
    return r.data;
  },
  async profile() {
    if (!live) { var d = demoGet(); var u = d.me && d.users.find(function (x) { return x.username === d.me; }); return u ? { username: u.username, full_name: u.full_name, whatsapp: u.whatsapp, email: u.email, verified: false } : null; }
    var s = await sb.auth.getSession(); if (!s.data.session) return null;
    var r = await sb.from("profiles").select("username,full_name,whatsapp,email,verified,kind").eq("id", s.data.session.user.id).maybeSingle();
    return r.data || null;
  },
  async addresses() {
    if (!live) { var d = demoGet(); return d.addresses.filter(function (a) { return a.owner === d.me; }); }
    var r = await sb.from("addresses").select("*").order("created_at"); if (r.error) throw r.error; return r.data;
  },
  async saveAddress(a) {
    if (!live) { var d = demoGet(); if (a.id) Object.assign(d.addresses.find(function (x) { return x.id === a.id; }), a); else { a.id = W.uid(); a.owner = d.me; d.addresses.push(a); } demoSave(d); return a; }
    var row = { label: a.label || "", line: a.line, landmark: a.landmark || null, lat: a.lat || null, lng: a.lng || null, accepted_terms: !!a.accepted_terms };
    var r = a.id ? await sb.from("addresses").update(row).eq("id", a.id).select().single() : await sb.from("addresses").insert(row).select().single();
    if (r.error) throw r.error; return r.data;
  },
  async deleteAddress(id) {
    if (!live) { var d = demoGet(); d.addresses = d.addresses.filter(function (x) { return x.id !== id; }); demoSave(d); return; }
    var r = await sb.from("addresses").delete().eq("id", id); if (r.error) throw r.error;
  },
  resetDemo() { ls(DEMO_KEY, null); W._demoMem = null; },
  /* staff session */
  async session() {
    if (!live) { if (W.APP === "shop") { var d = demoGet(); return d.me ? { demo: true } : null; } return { demo: true }; }
    var r = await sb.auth.getSession(); return r.data.session;
  },
  async signIn(login, secret) {
    if (!live) return { demo: true };
    if (/@/.test(login) && !/^\d{6}$/.test(secret)) { var r = await sb.auth.signInWithPassword({ email: login, password: secret }); if (r.error) throw r.error; return r.data.session; }
    return this.account("login", { login: login, pin: secret });
  },
  async isAdmin() { if (!live) return true; var r = await sb.rpc("is_admin"); return !r.error && r.data === true; },
  async me() {
    if (!live) return { id: "demo-boss", name: "Boss Deus", role: ls("winga.demoRole") || "boss", email: "boss@mfano", username: "bossdeus" };
    var s = await sb.auth.getSession(), u = s.data.session && s.data.session.user; if (!u) return null;
    var r = await sb.from("admins").select("name,role").eq("user_id", u.id).maybeSingle();
    var p = await sb.from("profiles").select("username").eq("id", u.id).maybeSingle();
    return { id: u.id, name: (r.data && r.data.name) || u.email.split("@")[0], role: (r.data && r.data.role) || "assistant", email: /@users\.niagize\.app$/.test(u.email) ? "" : u.email, username: p.data && p.data.username };
  },
  async signOut() { if (!live) { if (W.APP === "shop") { var d = demoGet(); d.me = null; demoSave(d); } return; } await sb.auth.signOut(); }
};
W.shopUrl = function () { var u = location.href.split("#")[0].split("?")[0]; return u.replace(/admin\/?(index\.html)?$/, "").replace(/index\.html$/, ""); };
W.adminUrl = function () { return W.shopUrl() + "admin/"; };
})();
