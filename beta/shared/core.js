/* Niagize Kariakoo core (v2): words, categories, helpers, theme, photos and the data layer.
   Live mode uses Supabase (window.supabase from the CDN + window.WINGA_CONFIG).
   Example mode keeps everything in this browser so the apps can be tried without the database.
   Set window.NIAGIZE_APP = "shop" | "boss" before this file so each app keeps its own sign-in. */
(function () {
"use strict";
var W = window.Winga = {};
W.VERSION = "2.3.3";
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
 ["or","Common","au","or"],
 ["copied","Common","Imenakiliwa","Copied"],
 ["saved","Common","Imehifadhiwa","Saved"],
 ["share","Common","Shiriki","Share"],
 ["copy","Common","Nakili","Copy"],
 ["send","Common","Tuma","Send"],
 ["error","Common","Imeshindikana. Tafadhali jaribu tena","Failed. Please try again"],
 ["err_title","Common","Kuna hitilafu","Something went wrong"],
 ["err_sub","Common","Imeshindikana kupakia. Angalia mtandao kisha jaribu tena.","Couldn't load. Check your connection and try again."],
 ["off_title","Common","Hakuna mtandao","You're offline"],
 ["off_sub","Common","Angalia data au Wi-Fi kisha jaribu tena.","Check your data or Wi-Fi, then try again."],
 ["retry","Common","Jaribu tena","Try again"],
 ["offline","Common","Offline. Unaona bidhaa za mara ya mwisho","Offline. Showing the last products"],
 ["need_field","Common","Weka {f}","Add {f}"],
 ["noPrice","Common","Bei inakuja","Price coming"],
 ["added","Common","Imetunzwa: {a}","Saved: {a}"],
 ["agoToday","Common","leo","today"],
 ["agoYday","Common","jana","yesterday"],
 ["agoJuzi","Common","juzi","2 days ago"],
 ["agoDays","Common","siku {n} zilizopita","{n} days ago"],
 ["all","Common","Zote","All"],
 ["lang","Common","Lugha","Language"],
 ["theme","Common","Mwonekano","Appearance"],
 ["th_light","Common","Mwanga","Light"],
 ["th_dark","Common","Giza","Dark"],
 ["tagline","Common","Ni chap na salama, mpaka mlangoni kwako","Fast and safe, to your door"],
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
 ["chat","Product","Chat nasi","Chat with us"],
 ["addCart","Product","Ongeza kwenye kapu","Add to basket"],
 ["kapu","Product","Kapuni","To basket"],
 ["buyNow","Product","Agiza sasa","Order now"],
 ["cart_added","Product","Imeongezwa kwenye kapu","Added to basket"],
 ["inCart","Product","Ipo kwenye kapu","In your basket"],
 ["subtotal","Product","Jumla","Subtotal"],
 ["qty","Product","Idadi","Quantity"],
 ["spec_title","Product","Maelekezo (Specs)","Specifications"],
 ["spec_ph","Product","Spec (Maelekezo): rangi au saizi","Spec: colour or size"],
 ["how_title","How to order","Namna ya kuagiza bidhaa","How to order"],
 ["how1","How to order","Chagua bidhaa upendayo","Pick what you like"],
 ["how2","How to order","Tuma oda","Send the order"],
 ["how3","How to order","Tutahakiki oda yako","We confirm your order"],
 ["how4","How to order","Lipia, tukuletee hadi mlangoni","Pay, we deliver to your door"],
 ["cart_title","Basket","Kapu lako","Your basket"],
 ["cart_send","Basket","Tuma oda","Send order"],
 ["cart_total","Basket","Jumla","Total"],
 ["cart_empty","Basket","Kapu lako ni tupu","Your basket is empty"],
 ["cart_clear","Basket","Futa kapu","Empty basket"],
 ["delivery","Basket","Usafiri","Delivery"],
 ["del_fasta","Basket","Inaharaka","Urgent"],
 ["del_leo","Basket","Utumwe Leo","Send today"],
 ["fee_tbd","Basket","Bei itathibitishwa","Confirmed in chat"],
 ["deliver_to","Basket","Anwani ya kupokea","Delivery address"],
 ["add_addr","Basket","Ongeza anwani","Add address"],
 ["wa_hello","Basket (WhatsApp)","Habari! Napata mzigo huu?","Hello! Can I get these?"],
 ["wa_items","Basket (WhatsApp)","Oda {code} · bidhaa {n}","Order {code} · {n} items"],
 ["wa_ask","Product (WhatsApp)","Habari! Naulizia hii:","Hello! I'm asking about this:"],
 ["wa_one","Product share","Tumekurahisishia ununuzi wa bidhaa zozote kutoka Kariakoo.\n\nIngia Niagize Kariakoo, ni chap na salama {url}\n\nChagua bidhaa, tutaifanyia kazi kwa wakati, fanya malipo na uletewe mzigo wako mpaka mlangoni.","We made buying anything from Kariakoo easy.\n\nOpen Niagize Kariakoo, fast and safe {url}\n\nPick your items, we work on them on time, you pay and we deliver to your door."],
 ["wa_total","Basket (WhatsApp)","Jumla: TSh {x}","Total: TSh {x}"],
 ["wa_del","Basket (WhatsApp)","Usafiri: {d} · {fee}","Delivery: {d} · {fee}"],
 ["order_sent","Order","Oda imetumwa","Order sent"],
 ["order_sent_s","Order","Unaweza kufuatilia hapa, status ya oda yako","You can follow your order status here"],
 ["guest_hint","Order","Jisajili uone historia na kuagiza tena","Sign up to see your history and reorder"],
 ["o_title","Order","Oda {code}","Order {code}"],
 ["o_items","Order","Bidhaa","Items"],
 ["o_pay","Order","Lipia hapa","Pay here"],
 ["o_pay_s","Order","Ukishalipa, tuma namba ya muamala na jina kwenye WhatsApp","After paying, send the transaction ID and name on WhatsApp"],
 ["o_chat","Order","Ongea na muuzaji","Chat with seller"],
 ["o_notfound","Order","Oda haipatikani","Order not found"],
 ["o_closed","Order","Oda hii imefungwa. Hakuna malipo yanayohitajika.","This order is closed. No payment is needed."],
 ["st_new","Order","Imepokelewa","Received"],
 ["st_progress","Order","Nakurudia","In progress"],
 ["st_invoiced","Order","Ankara imetumwa","Invoice sent"],
 ["st_paid","Order","Imelipwa","Paid"],
 ["st_done","Order","Imekamilika","Completed"],
 ["st_cancelled","Order","Imesitishwa","Cancelled"],
 ["st_pack","Order","Tunafunga mzigo na kukutumia","Packing and sending"],
 ["o_pay_wait","Order","Njia za malipo zitaonekana ukishapokea ankara","Payment options show once you get the invoice"],
 ["claim_title","Order","Umeshalipa? Tuma taarifa za malipo","Paid? Send the payment details"],
 ["claim_channel","Order","Njia ya malipo","Payment channel"],
 ["claim_ref","Order","Namba ya muamala / risiti","Transaction ID / receipt"],
 ["claim_name","Order","Jina la aliyelipa","Payer name"],
 ["claim_send","Order","Tuma kwa muuzaji","Send to seller"],
 ["claim_sent","Order","Imetumwa · Inasubiri uthibitisho","Sent · Waiting for confirmation"],
 ["claim_ok","Order","Malipo yamethibitishwa","Payment confirmed"],
 ["claim_wa","Order","Habari! Nimelipia oda {code}.\nKupitia: {ch}\nMuamala: {ref}\nJina: {name}\n\n{link}","Hello! I paid for order {code}.\nVia: {ch}\nTransaction: {ref}\nName: {name}\n\n{link}"],
 ["received","Order","Nimepokea","I've received it"],
 ["rate_title","Order","Umeridhika na huduma?","How was the service?"],
 ["rate_note","Order","Maoni (si lazima)","Comment (optional)"],
 ["rate_send","Order","Funga oda","Close the order"],
 ["rate_thanks","Order","Asante! Oda imefungwa","Thank you! Order closed"],
 ["rate_your","Order","Umetoa nyota {n}","You gave {n} stars"],
 ["chat_order","Order","Habari! Kuhusu oda {code}:","Hello! About order {code}:"],
 ["chat_status","Order","Habari! Naulizia status ya oda yangu: {code}\n{link}","Hello! I'm asking about the status of my order: {code}\n{link}"],
 ["g_wa","Basket","Namba yako ya WhatsApp","Your WhatsApp number"],
 ["g_name","Basket","Jina lako (si lazima)","Your name (optional)"],
 ["g_hint","Basket","Ankara na taarifa za oda zitakufikia hapa","Your invoice and order news come here"],
 ["inst_title","Install","Weka Niagize kwenye simu yako","Put Niagize on your phone"],
 ["tips_title","Tips","Karibu tuanze pamoja","Welcome, let's start together"],
 ["tips_sub","Tips","Hatua chache tu, uagize kwa urahisi","A few steps and you're ordering"],
 ["tips_buy","Tips","Jinsi ya kununua","How to buy"],
 ["tips_save","Tips","Weka app kwenye simu","Save the app"],
 ["tips_swipe","Tips","Telezesha kuona zaidi","Swipe for more"],
 ["inst_1","Install","Fungua link","Open the link"],
 ["inst_2","Install","Ukiwa kwenye ukurasa wa Niagize Kariakoo","On the Niagize Kariakoo page"],
 ["inst_3","Install","Bonyeza dot tatu (⋮) chini au juu upande wa kulia","Tap the three dots (⋮) at the bottom or top right"],
 ["inst_4","Install","Au tafuta alama ya Share","Or look for the Share icon"],
 ["inst_5","Install","Shuka chini, chagua \"Add to Home Screen\"","Scroll down, choose \"Add to Home Screen\""],
 ["inst_6","Install","Jina: Niagize Kariakoo, bonyeza Add","Name: Niagize Kariakoo, tap Add"],
 ["inst_7","Install","Hongera! Fungua duka kirahisi kwa icon yetu kwenye Home Screen","Done! Open the shop from our icon on your Home Screen"],
 ["inst_close","Install","Nimeelewa","Got it"],
 // customer account
 ["me_guest","Me","Karibu!","Welcome!"],
 ["me_guest_s","Me","Ingia uone oda zako, weka anwani na rudia kuagiza bidhaa kwa urahisi","Sign in to see your orders, save addresses and reorder easily"],
 ["signin","Me","Ingia","Sign in"],
 ["signup","Me","Jisajili","Sign up"],
 ["google","Me","Endelea na Google","Continue with Google"],
 ["f_name","Me","Jina kamili","Full name"],
 ["f_user","Me","Username","Username"],
 ["f_wa","Me","Namba ya WhatsApp","WhatsApp number"],
 ["f_email","Me","Barua pepe (si lazima)","Email (optional)"],
 ["f_pass","Me","Neno la siri (herufi 6+)","Password (6+ characters)"],
 ["f_pass2","Me","Rudia neno la siri","Repeat password"],
 ["f_login","Me","Username au barua pepe","Username or email"],
 ["f_secret","Me","Neno la siri","Password"],
 ["agree","Me","Nakubali","I accept the"],
 ["have_acc","Me","Tayari nina akaunti","I already have an account"],
 ["no_acc","Me","Huna akaunti? Jisajili","No account? Sign up"],
 ["forgot","Me","Umesahau neno la siri?","Forgot password?"],
 ["forgot_msg","Me","Habari! Nimesahau neno la siri la Niagize. Username: @{u}. Naomba msaada.","Hello! I forgot my Niagize password. Username: @{u}. Please help."],
 ["err_taken","Me","Username hii imeshachukuliwa","That username is taken"],
 ["err_dup","Me","Tayari una akaunti kwa namba hii","You already have an account with this number"],
 ["err_wrong","Me","Taarifa si sahihi. Majaribio {n} yamebaki","Wrong details. {n} tries left"],
 ["err_locked","Me","Umejaribu mara nyingi. Subiri dakika 15","Too many tries. Wait 15 minutes"],
 ["err_pass","Me","Neno la siri liwe herufi 6 au zaidi","Password must be 6 or more characters"],
 ["err_pass2","Me","Maneno ya siri hayafanani","Passwords don't match"],
 ["err_user","Me","Username: herufi 3–20 (a-z, 0-9, _ .)","Username: 3–20 characters (a-z, 0-9, _ .)"],
 ["err_wa","Me","Weka namba sahihi ya WhatsApp","Enter a valid WhatsApp number"],
 ["err_name","Me","Weka jina kamili","Enter your full name"],
 ["err_terms","Me","Kubali vigezo na masharti kwanza","Accept the terms first"],
 ["complete_title","Me","Kamilisha akaunti","Finish your account"],
 ["complete_s","Me","Hatua moja tu: username na namba ya WhatsApp","One step: a username and your WhatsApp number"],
 ["unverified","Me","Haijathibitishwa","Not verified"],
 ["me_orders","Me","Track oda","Track orders"],
 ["me_addr","Me","Anwani","Addresses"],
 ["me_help","Me","Msaada","Help"],
 ["me_for_you","Me","Kwa ajili yako","For you"],
 ["no_orders","Me","Bado hujaagiza bidhaa","You haven't ordered yet"],
 ["reorder","Me","Agiza tena","Order again"],
 ["help_title","Me · Help","Kituo cha msaada","Help centre"],
 ["help_wa","Me · Help","Ongea nasi kwenye WhatsApp","Chat with us on WhatsApp"],
 ["help_wa_s","Me · Help","Tunajibu haraka","We reply fast"],
 ["help_msg","Me · Help","Habari! Naomba msaada kuhusu:","Hello! I need help with:"],
 ["help_form","Me · Help","Tuandikie","Write to us"],
 ["help_soon","Me · Help","Inakuja hivi karibuni","Coming soon"],
 ["help_subject","Me · Help","Kichwa","Subject"],
 ["help_body","Me · Help","Eleza changamoto yako","Describe the problem"],
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
 ["terms_body","Me · Settings","1. Huduma: Niagize Kariakoo ni duka la mtandaoni la winga (muuzaji) wa Kariakoo. Unachagua bidhaa, unatuma oda kwa WhatsApp, kisha muuzaji anathibitisha.\n\n2. Bei na mzigo: Bei na upatikanaji huthibitishwa kwenye WhatsApp kabla ya kulipa. Picha ni za kuonyesha bidhaa; rangi na saizi zinaweza kutofautiana kidogo.\n\n3. Malipo: Unalipa moja kwa moja kwa muuzaji kupitia namba zilizo kwenye ankara. Usilipe namba nyingine yoyote. Tuma namba ya muamala na jina ili tuthibitishe.\n\n4. Usafiri: Gharama ya usafiri inathibitishwa kwenye kila oda. Mzigo unaletwa kwenye anwani uliyoweka.\n\n5. Kubadilisha au kusitisha: Unaweza kusitisha oda kabla ya kulipa. Baada ya kulipa, mabadiliko au kurudisha bidhaa hukubaliwa na muuzaji kwenye WhatsApp.\n\n6. Taarifa zako: Jina, namba na anwani yako hutumika tu kuhudumia oda zako. Hatuuzi taarifa zako. Unaweza kufuta akaunti yako wakati wowote kwenye Mipangilio.\n\n7. Akaunti: Linda neno lako la siri. Usimpe mtu mwingine.\n\n8. Mabadiliko: Vigezo hivi vinaweza kubadilika; toleo jipya litaonekana hapa.","1. Service: Niagize Kariakoo is the online shop of one Kariakoo winga (seller). You pick products, send the order on WhatsApp, and the seller confirms it.\n\n2. Price and stock: Price and availability are confirmed on WhatsApp before you pay. Photos show the product; colour and size may differ slightly.\n\n3. Payment: You pay the seller directly to the numbers on the invoice. Don't pay any other number. Send the transaction ID and name so we can confirm.\n\n4. Delivery: The delivery fee is confirmed for each order. Goods are delivered to the address you give.\n\n5. Changes and cancelling: You can cancel before paying. After paying, changes or returns are agreed with the seller on WhatsApp.\n\n6. Your data: Your name, number and address are used only to serve your orders. We don't sell your data. You can delete your account any time in Settings.\n\n7. Account: Keep your password safe. Don't share it.\n\n8. Changes: These terms may change; the new version will appear here."],
 ["addr_title","Me · Addresses","Anwani zangu","My addresses"],
 ["addr_add","Me · Addresses","Ongeza anwani","Add address"],
 ["addr_search","Me · Addresses","Tafuta mtaa, jengo au eneo","Search street, building or area"],
 ["addr_manual","Me · Addresses","Andika mwenyewe","Type it yourself"],
 ["addr_label","Me · Addresses","Jina (mf. Nyumbani, Kazini)","Name (e.g. Home, Work)"],
 ["addr_line","Me · Addresses","Anwani kamili","Full address"],
 ["addr_landmark","Me · Addresses","Alama ya karibu (mf. karibu na msikiti)","Nearby landmark"],
 ["addr_terms","Me · Addresses","Nakubali anwani hii ishirikishwe na muuzaji kwa ajili ya kuleta oda","I agree this address is shared with the seller to deliver my orders"],
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
 ["d_sales","Boss · Dashboard","Mauzo","Sales"],
 ["d_orders","Boss · Dashboard","Oda","Orders"],
 ["d_visitors","Boss · Dashboard","Wateja wapya","New visitors"],
 ["d_conv","Boss · Dashboard","Conversion","Conversion"],
 ["d_open","Boss · Dashboard","Oda wazi","Open orders"],
 ["d_new","Boss · Dashboard","mpya","new"],
 ["p_all","Boss · Orders","Wakati wote","All time"],
 ["p_today","Boss · Orders","Leo","Today"],
 ["p_7","Boss · Orders","Siku 7","7 days"],
 ["p_30","Boss · Orders","Siku 30","30 days"],
 ["min_money","Boss · Orders","Kiasi kianzie TSh 1,000","Amount must be TSh 1,000 or more"],
 ["crop","Boss · Add product","Kata picha","Crop photo"],
 ["d_pending","Boss · Dashboard","zinasubiri","pending"],
 ["d_done","Boss · Dashboard","zimekamilika","completed"],
 ["d_cancelled","Boss · Dashboard","zimesitishwa","cancelled"],
 ["d_views_s","Boss · Dashboard","{n} wameangalia bidhaa","{n} product views"],
 ["d_rating","Boss · Dashboard","Wastani wa nyota","Average stars"],
 ["d_funnel","Boss · Dashboard","Safari ya mteja","Customer funnel"],
 ["d_views","Boss · Dashboard","Wameangalia bidhaa","Product views"],
 ["d_carts","Boss · Dashboard","Kapuni","In basket"],
 ["d_chats","Boss · Dashboard","Wameulizia","Asked"],
 ["d_paid","Boss · Dashboard","Wamelipa","Paid"],
 ["d_top","Boss · Dashboard","Zinazofanya vizuri","Top products"],
 ["d_live","Boss · Dashboard","Kuna bidhaa {n}","{n} products live"],
 ["q_orders","Boss · Home","Oda","Orders"],
 ["q_archive","Boss · Home","Archive","Archive"],
 ["q_share","Boss · Home","Share link","Share link"],
 ["q_shop","Boss · Home","Cheki duka","See shop"],
 ["my_shop","Boss · Home","Ingia dukani","Go to the shop"],
 ["t_ending","Boss · Home","Bado zipo?","Still there?"],
 ["stillHere","Boss · Home","Bado ipo?","Still here?"],
 ["st_live","Boss · Home","Live","Live"],
 ["st_pilot","Boss · Home","Test","Test"],
 ["st_down","Boss · Home","Haipatikani","Down"],
 ["share_title","Boss · Share","Shiriki duka","Share the shop"],
 ["share_link","Boss · Share","Link yangu","My link"],
 ["shareText","Boss · Share","Tumekurahisishia ununuzi wa bidhaa zozote kutoka Kariakoo.\n\nIngia Niagize Kariakoo, ni chap na salama {url}\n\nChagua bidhaa, tutaifanyia kazi kwa wakati, fanya malipo na uletewe mzigo wako mpaka mlangoni.","We made buying anything from Kariakoo easy.\n\nOpen Niagize Kariakoo, fast and safe {url}\n\nPick your items, we work on them on time, you pay and we deliver to your door."],
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
 ["o_search","Boss · Orders","Namba ya oda","Order number"],
 ["f_new","Boss · Orders","Mpya","New"],
 ["f_pending","Boss · Orders","Zinasubiri","Pending"],
 ["f_done","Boss · Orders","Zimekamilika","Completed"],
 ["f_waitpay","Boss · Orders","Inasubiri malipo","Awaiting payment"],
 ["f_working","Boss · Orders","Inafanyiwa kazi","In progress"],
 ["f_complete","Boss · Orders","Kamili","Complete"],
 ["f_cancelled","Boss · Orders","Zimesitishwa","Cancelled"],
 ["no_orders_b","Boss · Orders","Hakuna oda hapa","No orders here"],
 ["guest","Boss · Orders","Mteja mpya","New customer"],
 ["name_add","Boss · Orders","Weka jina la mteja","Add the customer's name"],
 ["paid_q","Boss · Orders","Umehakiki malipo ya oda {code}?","Have you checked the payment for {code}?"],
 ["paid_claim","Boss · Orders","Mteja ametuma","The customer sent"],
 ["paid_none","Boss · Orders","Mteja hajatuma taarifa. Hakiki kwenye simu au benki kwanza.","No details from the customer. Check your phone or bank first."],
 ["paid_yes","Boss · Orders","Malipo yamepokelewa","Payment received"],
 ["claim_badge","Boss · Orders","Mteja amelipa","Customer paid"],
 ["by_customer","Boss · Orders","Mteja amethibitisha kupokea","Customer confirmed receipt"],
 ["auto_hint","Boss · Orders","Itahamia \"Inafanyiwa kazi\" baada ya dakika 2","Moves to In progress after 2 minutes"],
 ["a_progress","Boss · Orders","Nakurudia","Working on it"],
 ["a_invoice","Boss · Orders","Tuma ankara","Send invoice"],
 ["a_paid","Boss · Orders","Imelipwa","Paid"],
 ["a_done","Boss · Orders","Imekamilika","Completed"],
 ["a_cancel","Boss · Orders","Sitisha oda","Cancel order"],
 ["a_call","Boss · Orders","Piga simu","Call"],
 ["cust","Boss · Orders","Mteja","Customer"],
 ["cust_phone","Boss · Orders","Namba ya mteja","Customer number"],
 ["fee_set","Boss · Orders","Gharama ya usafiri (TSh)","Delivery fee (TSh)"],
 ["fee_name","Boss · Orders","Gharama ya usafiri","Delivery fee"],
 ["total_edit","Boss · Orders","Badili jumla","Edit total"],
 ["total_new","Boss · Orders","Jumla mpya baada ya maelewano (TSh)","New agreed total (TSh)"],
 ["total_orig","Boss · Orders","Bei ya awali","Original price"],
 ["total_reset","Boss · Orders","Rudisha bei ya awali","Back to original price"],
 ["pay_ref","Boss · Orders","Namba ya muamala (si lazima)","Transaction ID (optional)"],
 ["pay_name","Boss · Orders","Jina la aliyelipa (si lazima)","Payer name (optional)"],
 ["reason","Boss · Orders","Sababu","Reason"],
 ["reason_ph","Boss · Orders","Weka sababu ya kusitisha","Why is it cancelled?"],
 ["need_phone","Boss · Orders","Weka namba ya mteja kwanza","Add the customer's number first"],
 ["inv_hi","Boss · Orders (WhatsApp)","{name}! Tafadhali fanya malipo ya Oda yako {code}.","{name}! Please pay for your order {code}."],
 ["inv_pay","Boss · Orders (WhatsApp)","Lipia kupitia:","Pay with:"],
 ["inv_after","Boss · Orders (WhatsApp)","Ukisha fanya malipo, tutumie namba ya muamala/risiti na Jina litakalokuja.","After paying, send us the transaction ID/receipt and the name that shows."],
 ["inv_track","Boss · Orders (WhatsApp)","Unaweza kuendelea kufuatilia oda yako hapa:","You can keep tracking your order here:"],
 ["msg_progress","Boss · Orders (WhatsApp)","Tumepokea oda {code}. Tunaishughulikia sasa hivi.","We got order {code}. Working on it now."],
 ["msg_paid","Boss · Orders (WhatsApp)","Tumepokea malipo ya oda {code}. Asante! 🤝\n\nTunashughulikia na tutakutaarifu hivi punde!\n\nUnaweza kuendelea kufuatilia oda yako hapa: {link}","Payment received for order {code}. Thank you! 🤝\n\nWe're on it and will update you shortly!\n\nTrack your order here: {link}"],
 ["msg_done","Boss · Orders (WhatsApp)","Oda {code} imekamilika.\n\nAsante kwa kutuamini na kuagiza nasi, Karibu tena.\n\n*Niagize Kariakoo!*\nNi chap na salama, mpaka mlangoni kwako.\n\nUnataka kuagiza kitu kingine?\n{shop}","Order {code} is complete.\n\nThank you for trusting us and ordering with us. Welcome back.\n\n*Niagize Kariakoo!*\nFast and safe, to your door.\n\nWant something else?\n{shop}"],
 ["msg_cancel","Boss · Orders (WhatsApp)","Rafiki, pole kwa changamoto! Oda {code}, imesitishwa. Sababu: {reason}.","Friend, sorry for the trouble! Order {code} has been cancelled. Reason: {reason}."],
 // boss: add / edit product
 ["add_title","Boss · Add product","Ongeza bidhaa","Add product"],
 ["add_saved","Boss · Add product","{n} zimehifadhiwa","{n} saved"],
 ["photos_max","Boss · Add product","Picha nyingine?","Another photo?"],
 ["photos_drop","Boss · Add product","Picha {n} tu zimechukuliwa (mwisho 3)","Only {n} photos taken (max 3)"],
 ["f_photo","Boss · Add product","picha","a photo"],
 ["name_ph","Boss · Add product","Jina la bidhaa","Product name"],
 ["price_ph","Boss · Add product","Bei","Price"],
 ["cat_ph","Boss · Add product","aina","a category"],
 ["desc_ph","Boss · Add product","Maelezo ya ziada (size, rangi, material)","More details (size, colour, material)"],
 ["quality","Boss · Add product","Ubora","Quality"],
 ["add_more","Boss · Add product","Bidhaa nyingine","Another product"],
 ["add_done","Boss · Add product","Hifadhi, Maliza","Save & finish"],
 ["upload_fail","Boss · Add product","Imeshindwa kupakia: {x}","Upload failed: {x}"],
 ["savedN","Boss · Add product","Bidhaa {n} zimeongezwa","{n} products added"],
 ["list_title","Boss · Products","Bidhaa zilizopo","Your products"],
 ["f_archive","Boss · Products","Archive","Archive"],
 ["archived","Boss · Products","Archive","Archived"],
 ["archived_ok","Boss · Products","Imehamia Archive","Moved to Archive"],
 ["noProducts","Boss · Products","Hakuna bidhaa","No products"],
 ["unarchive","Boss · Products","Rudisha dukani","Back to shop"],
 ["unarchived","Boss · Products","Imerudi dukani kwa siku 60","Back in the shop for 60 days"],
 ["archive_hint","Boss · Products","Bidhaa huenda Archive yenyewe baada ya siku 60","Products move to Archive by themselves after 60 days"],
 ["edit_title","Boss · Edit","Badili taarifa","Edit details"],
 ["confirmDel2","Boss · Edit","Je, una uhakika unataka kufuta bidhaa?","Are you sure you want to delete?"],
 ["yesDel","Boss · Edit","Ndiyo, futa","Yes, delete"],
 // boss: profile and settings
 ["role_super_admin","Boss · Profile","Super Admin","Super Admin"],
 ["role_boss","Boss · Profile","Boss","Boss"],
 ["role_assistant","Boss · Profile","Msaidizi","Assistant"],
 ["shop_settings","Boss · Profile","Mipangilio ya duka","Shop settings"],
 ["shop_settings_s","Boss · Profile","WhatsApp na namba za malipo","WhatsApp and payment numbers"],
 ["team","Boss · Profile","Wasaidizi","Assistants"],
 ["team_s","Boss · Profile","Wanaoweza kuongeza bidhaa na kuhudumia oda","People who add products and serve orders"],
 ["pin_title","Boss · Profile","Username & neno la siri","Username & password"],
 ["pin_title_s","Boss · Profile","Ingia kwa username na neno la siri","Sign in with username and password"],
 ["pin_done","Boss · Profile","Imehifadhiwa. Ingia kwa username na neno la siri","Saved. Sign in with username and password"],
 ["f_current","Boss · Profile","Neno la siri la sasa","Current password"],
 ["err_current","Boss · Profile","Neno la siri la sasa si sahihi","Current password is wrong"],
 ["pin_assistant","Boss · Profile","Kubadili neno la siri, muombe Boss akusaidie","To change your password, ask the Boss"],
 ["wa_label","Boss · Settings","Namba ya WhatsApp","WhatsApp number"],
 ["pay_title","Boss · Settings","Namba za malipo","Payment numbers"],
 ["pay_num","Boss · Settings","Namba ya malipo","Payment number"],
 ["pay_acc","Boss · Settings","Jina la akaunti","Account name"],
 ["reset_demo","Boss · Settings","Reset examples","Reset examples"],
 ["team_add","Boss · Assistants","Ongeza msaidizi","Add assistant"],
 ["team_name","Boss · Assistants","Jina","Name"],
 ["team_pw","Boss · Assistants","Neno la siri (herufi 6+)","Password (6+ characters)"],
 ["team_note","Boss · Assistants","Msaidizi anaweza kuongeza na kubadili bidhaa, na kuhudumia oda. Hawezi kufuta, wala kubadili mipangilio.","An assistant can add and edit products and serve orders. They can't delete or change settings."],
 ["team_added","Boss · Assistants","Msaidizi ameongezwa. Mpe barua pepe na neno la siri","Assistant added. Give them the email and password"],
 ["team_removed","Boss · Assistants","Msaidizi ameondolewa","Assistant removed"],
 ["team_exists","Boss · Assistants","Barua pepe hii tayari ina akaunti","This email already has an account"],
 ["team_confirm","Boss · Assistants","Ondoa {x}?","Remove {x}?"],
 ["team_share","Boss · Assistants","Tuma link ya kuingia","Send sign-in link"],
 ["team_share_msg","Boss · Assistants","Habari {name}!\nKaribu tufanye kazi, tumia taarifa zako hapo chini kuingia Niagize: {url}\nJina: {login}","Hello {name}!\nWelcome to the team. Use the details below to sign in to Niagize: {url}\nName: {login}"],
 ["team_reset","Boss · Assistants","Weka neno jipya la siri","Set a new password"],
 ["team_reset_s","Boss · Assistants","Kwa {x}. Mpe neno hili jipya","For {x}. Give them this new password"],
 ["team_reset_ok","Boss · Assistants","Neno jipya la siri limewekwa","New password set"],
 ["you","Boss · Assistants","Wewe","You"],
 // boss: order notifications
 ["push_title","Boss · Alerts","Arifa za oda","Order alerts"],
 ["push_s","Boss · Alerts","Oda mpya inakufikia papo hapo. Gusa arifa, oda inafunguka hapa.","New orders reach you at once. Tap the alert to open the order here."],
 ["push_on","Boss · Alerts","Zimewashwa","On"],
 ["push_off","Boss · Alerts","Zimezimwa","Off"],
 ["push_enable","Boss · Alerts","Washa arifa","Turn on alerts"],
 ["push_disable","Boss · Alerts","Zima arifa","Turn off alerts"],
 ["push_test","Boss · Alerts","Jaribu arifa","Send a test"],
 ["push_test_ok","Boss · Alerts","Arifa ya majaribio imetumwa","Test alert sent"],
 ["push_nudge","Boss · Alerts","Washa arifa za oda","Turn on order alerts"],
 ["push_nudge_s","Boss · Alerts","Ujue oda mpya papo hapo, bila kusubiri WhatsApp","Know about new orders at once, without waiting for WhatsApp"],
 ["push_denied","Boss · Alerts","Umezuia arifa. Fungua Settings → Niagize → Notifications → Allow","Alerts are blocked. Open Settings → Niagize → Notifications → Allow"],
 ["push_unsupported","Boss · Alerts","Simu hii haiwezi kupokea arifa za Niagize","This phone can't receive Niagize alerts"],
 ["push_install","Boss · Alerts","Kwanza weka Niagize kwenye Home Screen","First add Niagize to your Home Screen"],
 ["push_i1","Boss · Alerts","Fungua Niagize kwenye Safari, gusa Share","Open Niagize in Safari, tap Share"],
 ["push_i2","Boss · Alerts","Chagua \"Add to Home Screen\"","Choose \"Add to Home Screen\""],
 ["push_i3","Boss · Alerts","Fungua Niagize kutoka Home Screen, ingia, kisha rudi hapa","Open Niagize from the Home Screen, sign in, come back here"],
 ["push_fail","Boss · Alerts","Imeshindikana kuwasha arifa. Jaribu tena","Couldn't turn on alerts. Try again"],
 // WhatsApp handoff page (admin/o.html)
 ["ho_title","Handoff","Oda {code}","Order {code}"],
 ["ho_open","Handoff","Fungua Niagize","Open Niagize"],
 ["ho_here","Handoff","Endelea hapa","Continue here"],
 ["ho_ios","Handoff","Gusa app ya Niagize kwenye Home Screen. Oda hii itafunguka yenyewe.","Tap the Niagize app on your Home Screen. This order opens by itself."],
 ["ho_track","Handoff","Mteja? Fuatilia oda yako","Customer? Track your order"],
 ["ho_opening","Handoff","Inafungua…","Opening…"]
];
/* categories: 6 groups + sub-groups, in shop order.
   [key, Kiswahili, English, icon, [[subKey, sw, en, icon], …]]. Keys never change; labels can. */
W.TAX = [
 ["fashion","Nguo & Fashion","Clothing & Fashion","shirt",[["women","Wanawake","Women","dress"],["men","Wanaume","Men","shirt"]]],
 ["shoes","Viatu","Shoes","sneaker",[["men","Wanaume","Men","sneaker"],["women","Wanawake","Women","heel"],["kids","Watoto","Kids","kidshoe"]]],
 ["electronics","Electronics","Electronics","phone",[["phones","Simu","Phones","phone"],["gadgets","Vifaa","Gadgets","headphones"]]],
 ["accessories","Urembo","Beauty & Accessories","ring",[["jewelry","Jewelry","Jewelry","ring"],["watches","Saa","Watches","watch"],["eyewear","Miwani","Eyewear","glasses"],["bags","Mabegi","Bags","bag"]]],
 ["kids","Mama & Watoto","Mother & Kids","bottle",[["baby","Mtoto mchanga","Baby","bottle"],["kidswear","Nguo za watoto","Kids' clothes","onesie"],["mother","Mzazi","Parent","heart"]]],
 ["other","Nyingine","Other","box",[]]
];
W.CATS = W.TAX.map(function (c) { return c[0]; });
var STR = { sw: {}, en: {} };
W.STRINGS.forEach(function (r) { STR.sw[r[0]] = r[2]; STR.en[r[0]] = r[3]; });
W.TAX.forEach(function (c) { STR.sw["cat_" + c[0]] = c[1]; STR.en["cat_" + c[0]] = c[2]; c[4].forEach(function (s) { STR.sw["sub_" + c[0] + "_" + s[0]] = s[1]; STR.en["sub_" + c[0] + "_" + s[0]] = s[2]; }); });
function taxOf(cat) { return W.TAX.find(function (x) { return x[0] === cat; }); }
W.subs = function (cat) { var c = taxOf(cat); return c ? c[4].map(function (s) { return s[0]; }) : []; };
/* category and sub-category icons (24px line icons) */
var LI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
W.CATICONS = {
  shirt: '<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3c0 2-1.5 3-4 3S8 5 8 3z"/>',
  dress: '<path d="M9 3h6l-1.5 5L18 21H6l4.5-13z"/><path d="M9.5 8h5"/>',
  sneaker: '<path d="M2.5 17.5V13l5-1 3-4 3 3c2 1.2 5 1.2 8 3.5v3z"/><path d="M2.5 17.5h19M9 12.5l1.5 1.5M11.5 11l1.5 1.5"/>',
  heel: '<path d="M3 16c4.5 0 7.5-2.5 9.5-7l2.2 1c-.8 3 1.3 6 6.3 6v3h-4.5l-2-2.5H8V20H3z"/>',
  kidshoe: '<path d="M4 18v-4.5l4-1 2.5-3 3 3c2 1 4 1 6.5 2.5v3z"/><path d="M4 18h16"/><circle cx="9" cy="15.5" r=".8"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.6"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.6"/>',
  ring: '<circle cx="12" cy="15" r="5.8"/><path d="M9.5 4.5h5l-2.5 3.8z"/>',
  watch: '<rect x="8.5" y="2.5" width="7" height="4" rx="1"/><rect x="8.5" y="17.5" width="7" height="4" rx="1"/><circle cx="12" cy="12" r="5.5"/><path d="M12 9.5V12l1.6 1.4"/>',
  glasses: '<circle cx="6.5" cy="14.5" r="3.5"/><circle cx="17.5" cy="14.5" r="3.5"/><path d="M10 14.5h4M3.2 13.5l2-6.5M20.8 13.5l-2-6.5"/>',
  bag: '<path d="M5 8h14l-1.2 12.5H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  bottle: '<path d="M10 2.5h4V6h-4z"/><path d="M9 9c0-2 1.3-3 3-3s3 1 3 3v10.5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/><path d="M9 13h6"/>',
  onesie: '<path d="M8 3L4 6l2 3.5 2-1V12l-2 9h4l2-4 2 4h4l-2-9V8.5l2 1L20 6l-4-3c0 2-1.8 3-4 3S8 5 8 3z"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  box: '<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>'
};
W.catIcon = function (cat, sub) {
  var c = taxOf(cat), k = "box";
  if (c) { k = c[3]; if (sub) { var s = c[4].find(function (x) { return x[0] === sub; }); if (s) k = s[3]; } }
  if (cat === "all") k = "grid";
  return LI + W.CATICONS[k] + "</svg>";
};
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

/* brand mark: the striped sun. Small sizes use 6 thick stripes, large sizes 14 thin ones with a gradient. */
var SMALL = [[10,8],[22,9],[35,10],[49,11],[64,12],[80,12]];
var LARGE = [[10,1.4],[13.6,1.8],[17.6,2.2],[22,2.6],[26.8,3],[32,3.4],[37.6,3.8],[43.6,4.2],[50,4.6],[56.8,5],[64,5.4],[71.6,5.8],[79.6,6.2],[88,4]];
var markN = 0;
W.sunSvg = function (big, cls, extra) {
  var id = "nk" + (++markN), st = big ? LARGE : SMALL;
  return '<svg class="' + (cls || "brandmark") + '" viewBox="0 0 100 100" aria-hidden="true"' + (extra || "") + '><defs><clipPath id="' + id + 'c"><circle cx="50" cy="50" r="40"/></clipPath>' +
    (big ? '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD45A"/><stop offset="1" stop-color="#F3A500"/></linearGradient>' : '') +
    '</defs><g clip-path="url(#' + id + 'c)" fill="' + (big ? 'url(#' + id + 'g)' : '#FFC62D') + '">' + st.map(function (r) { return '<rect x="8" y="' + r[0] + '" width="84" height="' + r[1] + '"/>'; }).join("") + '</g></svg>';
};
Object.defineProperty(W, "MARK", { get: function () { return W.sunSvg(false); } });
/* sun loader: the striped sun, stripes rising one after another. Used instead of "loading" words */
Object.defineProperty(W, "SUN", { get: function () { return '<span class="sunload" role="img" aria-label="…">' + W.sunSvg(false, "sl") + '</span>'; } });
/* splash: big sun + name, shown while an app boots */
W.splash = function (name) {
  return '<div class="splash">' + W.sunSvg(true, "big") + '<div class="sw">' + (name || "Niagize") + '</div><div class="sk">Kariakoo</div><div class="sload">' + W.SUN + '</div><div class="stag">' + W.esc(W.t("tagline")) + '</div></div>';
};
/* full-screen error / offline screen used by both apps */
W.errorScreen = function (onRetry, offline) {
  if (offline == null) offline = navigator.onLine === false;
  var r = document.getElementById("errRoot"); if (!r) { r = document.createElement("div"); r.id = "errRoot"; document.body.appendChild(r); }
  var icon = offline ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/><path d="M3 3l18 18"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.5v.3"/></svg>';
  r.innerHTML = '<div class="errscreen" role="alert"><span class="erricon">' + icon + '</span><h2>' + W.esc(W.t(offline ? "off_title" : "err_title")) + '</h2><p>' + W.esc(W.t(offline ? "off_sub" : "err_sub")) + '</p><button class="btn primary" id="errRetry">' + W.esc(W.t("retry")) + '</button></div>';
  document.getElementById("errRetry").onclick = function () { if (navigator.onLine === false) { this.animate && this.animate([{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "none" }], 240); return; } r.innerHTML = ""; onRetry && onRetry(); };
};
W.clearError = function () { var r = document.getElementById("errRoot"); if (r) r.innerHTML = ""; };
/* going offline shows the offline screen; coming back hides it and refreshes */
W.watchNetwork = function (onBack) {
  addEventListener("offline", function () { W.errorScreen(onBack, true); });
  addEventListener("online", function () { var r = document.getElementById("errRoot"); if (r && r.innerHTML) { r.innerHTML = ""; onBack && onBack(); } });
};

/* ---------------- helpers ---------------- */
W.$ = function (s, r) { return (r || document).querySelector(s); };
W.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
W.money = function (n) { return Math.round(+n || 0).toLocaleString("en-US"); };
W.parseMoney = function (v) { if (v == null || v === "") return null; var s = String(v).toLowerCase().replace(/tsh|tzs|sh/g, "").trim(); var k = /k$/.test(s); s = s.replace(/[^0-9.]/g, ""); if (!s) return null; var n = parseFloat(s); return Math.round(k ? n * 1000 : n); };
W.waPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (!d) return ""; if (d[0] === "0") d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };
W.wa = function (phone, text) { return "https://wa.me/" + (W.waPhone(phone) || "") + "?text=" + encodeURIComponent(text); };
/* open WhatsApp without leaving a blank tab behind. Phones: the WhatsApp app directly (this screen stays as it is);
   if WhatsApp doesn't answer in 2.5 s, fall back to wa.me in this same tab. Computers: wa.me in a new tab. */
W.mobile = function () { return /android|iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); };
W.openWaUrl = function (web) {
  W._lastWa = web;
  var m = String(web).match(/^https:\/\/wa\.me\/(\d*)\?text=(.*)$/);
  if (!W.mobile() || !m) { var w = null; try { w = window.open(web, "_blank"); if (w) w.opener = null; } catch (e) {} if (!w) location.href = web; return; }
  var app = "whatsapp://send?" + (m[1] ? "phone=" + m[1] + "&" : "") + "text=" + m[2], gone = false;
  var off = function () { gone = true; };
  addEventListener("blur", off); addEventListener("pagehide", off); document.addEventListener("visibilitychange", off);
  location.href = app;
  setTimeout(function () { removeEventListener("blur", off); removeEventListener("pagehide", off); document.removeEventListener("visibilitychange", off); if (!gone && document.visibilityState === "visible") location.href = web; }, 2500);
};
W.openWa = function (phone, text) { W.openWaUrl(W.wa(phone, text)); };
/* any wa.me link in either app goes through the same opener */
document.addEventListener("click", function (e) { var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]'); if (!a || e.defaultPrevented) return; e.preventDefault(); W.openWaUrl(a.href); }, true);
/* share the shop: the agreed message, the same from both apps */
W.shareShop = async function () {
  var text = W.t("shareText", { url: W.shopUrl() });
  if (navigator.share) { try { await navigator.share({ text: text }); return true; } catch (e) { if (e && e.name === "AbortError") return false; } }
  W.openWa("", text); return true;
};
/* time for lists: "14:05 · Leo", "Jana", "Juzi"; older shows the date. English has Today / Yesterday only */
W.whenRel = function (iso) {
  if (!iso) return "";
  var d = new Date(iso), now = new Date(), day = function (x) { return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); };
  var diff = Math.round((day(now) - day(d)) / 864e5), tm = d.toTimeString().slice(0, 5), sw = W.lang === "sw";
  var lbl = diff === 0 ? (sw ? "Leo" : "Today") : diff === 1 ? (sw ? "Jana" : "Yesterday") : (diff === 2 && sw) ? "Juzi" : d.toLocaleDateString(sw ? "sw-TZ" : "en-GB", { day: "numeric", month: "short" });
  return tm + " · " + lbl;
};
/* money fields: 1,250,000 as you type */
W.fmtMoneyInput = function (el) {
  var raw = el.value, pos = el.selectionStart == null ? raw.length : el.selectionStart;
  var digitsBefore = raw.slice(0, pos).replace(/\D/g, "").length, digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 10);
  var out = digits ? Number(digits).toLocaleString("en-US") : "";
  if (out === raw) return;
  el.value = out;
  var i = 0, seen = 0; while (i < out.length && seen < digitsBefore) { if (/\d/.test(out[i])) seen++; i++; }
  try { el.setSelectionRange(i, i); } catch (e) {}
};
document.addEventListener("input", function (e) { if (e.target && e.target.classList && e.target.classList.contains("money")) W.fmtMoneyInput(e.target); });
/* a button that starts slow work shows the sun and can't be tapped twice */
W.busy = function (el, on) { if (!el || el.tagName !== "BUTTON") return; if (on) { el.dataset.busy = "1"; el.classList.add("busy"); el.setAttribute("aria-busy", "true"); } else { delete el.dataset.busy; el.classList.remove("busy"); el.removeAttribute("aria-busy"); } };
/* boot can't hang forever: after ms, show the retry screen (it reloads the page) */
W.guard = function (promise, ms) { return Promise.race([promise, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms || 12000); })]); };
W.DAY = 864e5; W.SHOW_DAYS = 60;   // products move to Archive after 60 days
W.daysLeft = function (p) { return W.SHOW_DAYS - Math.floor((Date.now() - new Date(p.refreshed_at).getTime()) / W.DAY); };
W.ago = function (iso) { var d = Math.floor((Date.now() - new Date(iso).getTime()) / W.DAY); return d <= 0 ? W.t("agoToday") : d === 1 ? W.t("agoYday") : W.t("agoDays", { n: d }); };
W.when = function (iso) { var d = new Date(iso); return d.toLocaleDateString(W.lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short" }) + " · " + d.toTimeString().slice(0, 5); };
W.whenFull = function (iso) { var d = new Date(iso); return d.toLocaleDateString(W.lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) + " · " + d.toTimeString().slice(0, 5); };
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

/* ---------------- order alerts (Web Push) ----------------
   iPhone: works only in the Home Screen app (iOS 16.4+). The permission ask must come straight from a tap. */
W.push = {
  supported: function () { return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; },
  ios: function () { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); },
  /* on · off · denied · install · unsupported */
  state: async function () {
    if (W.mode !== "live") return ls("winga.demoPush") || "off";
    if (this.ios() && !W.standalone()) return "install";
    if (!this.supported()) return "unsupported";
    if (Notification.permission === "denied") return "denied";
    try { var r = await navigator.serviceWorker.ready, sub = await r.pushManager.getSubscription(); return sub && Notification.permission === "granted" ? "on" : "off"; } catch (e) { return "off"; }
  },
  enable: async function () {
    if (W.mode !== "live") { ls("winga.demoPush", "on"); return "on"; }
    var perm = await Notification.requestPermission();   // first, while the tap still counts
    if (perm !== "granted") return perm === "denied" ? "denied" : "off";
    var key = await W.db.pushKey(), r = await navigator.serviceWorker.ready;
    var sub = await r.pushManager.getSubscription();
    if (!sub) sub = await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: W.push.keyBytes(key) });
    await W.db.savePush(sub.toJSON(), W.adminUrl());
    return "on";
  },
  disable: async function () {
    if (W.mode !== "live") { ls("winga.demoPush", "off"); return "off"; }
    var r = await navigator.serviceWorker.ready, sub = await r.pushManager.getSubscription();
    if (sub) { await W.db.dropPush(sub.endpoint).catch(function () {}); await sub.unsubscribe(); }
    return "off";
  },
  keyBytes: function (b64) { var t = b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4), bin = atob(t), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
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
var sb = live ? window.supabase.createClient(C.url, C.anonKey, { auth: { persistSession: true, storageKey: W.APP === "boss" ? "winga.auth" : "niagize.customer", lock: function (name, timeout, fn) { return fn(); } } }) : null;
W.mode = live ? "live" : "demo";
W.stage = C.stage || "pilot";
W.beta = !!C.beta;          // the /beta/ copy shows a small BETA pill
W.betaPill = function () { return W.beta ? '<span class="betapill">BETA</span>' : ""; };   // "production" or "pilot"
W.frame = function () {};       // the coloured frame was removed in v2; kept so older calls don't break
function pub(path) { if (!path) return ""; if (/^data:|^https?:/.test(path)) return path; return C.url + "/storage/v1/object/public/products/" + path; }
W.img = pub;
function decorate(p) {
  p.thumbUrl = pub((p.thumbs && p.thumbs[0]) || (p.images && p.images[0]));
  p.imageUrls = (p.images || []).map(pub);
  p.thumbUrls = (p.thumbs && p.thumbs.length ? p.thumbs : p.images || []).map(pub);
  p.tags = p.tags || []; p.rating = p.rating || 2; p.ordered = p.ordered || 0;
  normalize(p);
  if (p.product_private) delete p.product_private;
  return p;
}
/* v2.1 category map: old keys still in the database are shown under the new groups (see supabase/v2_1_data.sql) */
function normalize(p) {
  if (p.status === "hidden" || p.status === "soldout") p.status = "archived";
  if (p.category === "electronics" && p.subcategory !== "phones") p.subcategory = "gadgets";
  if (p.category === "other") p.subcategory = null;
  var fix = { shoes: { sport: "men" }, kids: { toys: "kidswear" }, fashion: { kitenge: "women" } };
  if (fix[p.category] && fix[p.category][p.subcategory]) p.subcategory = fix[p.category][p.subcategory];
  if (p.subcategory && W.subs(p.category).indexOf(p.subcategory) < 0) p.subcategory = null;
  if (W.CATS.indexOf(p.category) < 0) p.category = "other";
  return p;
}
W.normalize = normalize;
/* what the customer pays: the agreed total if the team changed it, else items + delivery */
W.total = function (o) { return o.agreed_total != null ? o.agreed_total : (o.subtotal || 0) + (o.delivery_fee || 0); };
function archiveAged(p) { if ((p.status === "active" || p.status === "soldout") && W.daysLeft(p) <= 0) p.status = "archived"; }
function cacheSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function cacheGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
async function fnErr(r) { var msg = "error", extra = {}; try { extra = await r.error.context.json(); msg = extra.error || msg; } catch (e) {} var e = new Error(msg); e.info = extra; return e; }

/* --- example mode store --- */
var DEMO_KEY = "winga.demo.v5";
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
    ["Raba brown, Air style", "shoes", "men", 35000, "Ngozi laini, soli imara. Saizi 40–44. Inafaa kazini na mtaani.", now - 2*36e5, "#C9A27E", "#6B3E1E", "shoe", 760, 3, 14, ["nike","raba"]],
    ["Sandals za kike", "shoes", "women", 18000, "Nyeusi na beige. Saizi 37–40.", now - D, "#E9D7C5", "#2B2B2B", "shoe", 600, 2, 6, ["sandals"]],
    ["Tecno Spark 20, 128GB", "electronics", "phones", 320000, "Mpya kwenye boksi, warranty ya mwaka mmoja.", now - 2*D, "#D3DEE8", "#1C3A54", "phone", 820, 3, 3, ["tecno"]],
    ["Chaja Type-C 33W", "electronics", "gadgets", 12000, "Inachaji haraka. Kwa simu zote za Type-C.", now - 3*36e5, "#E7ECEF", "#3B4A57", "phone", 640, 2, 21, ["chaja"]],
    ["Gauni la kitenge", "fashion", "women", 22000, "Pamba halisi, rangi haitoki.", now - 3*D, "#F6C85F", "#1F6F5C", "cloth", 700, 3, 9, ["kitenge"]],
    ["Begi la mgongoni", "accessories", "bags", 27000, "Laptop ya 15\" inaingia. Lina mifuko 4.", now - 55*D, "#B9C9B0", "#2F4B32", "bag", 600, 2, 4, ["begi"]],
    ["Mafuta ya nywele, 250ml", "other", null, 9500, "", now - 64*D, "#F2D7E0", "#8A2E4E", "bottle", 680, 1, 2, []],
    ["Miwani ya jua", "accessories", "eyewear", 15000, "UV400. Fremu nyeusi.", now - 5*D, "#EDE6DA", "#2B2B2B", "glasses", 560, 2, 7, ["miwani"]],
    ["Shati la kitambaa", "fashion", "men", 25000, "M, L, XL.", now - 6*D, "#E4EEF7", "#1F5C8F", "cloth", 720, 2, 0, []]
  ];
  return { shop: { name: "Niagize Kariakoo", tagline: "", whatsapp: "255700000000", payments: [{ provider: "M-PESA", number: "5512 3487", name: "BOSS DEUS" }] },
    products: defs.map(function (d, i) { var img = sample(d[0].split(",")[0], d[6], d[7], d[8], d[9]);
      return { id: "demo-" + i, created_at: new Date(d[5]).toISOString(), refreshed_at: new Date(d[5]).toISOString(), name: d[0], category: d[1], subcategory: d[2], price: d[3], description: d[4], images: [img], thumbs: [img], status: i === 8 ? "archived" : "active", asks: d[11], ordered: d[11], rating: d[10], tags: d[12] }; }),
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
  async setPhotos(p, keep, add, order) {
    var images = keep.map(function (i) { return p.images[i]; }), thumbs = keep.map(function (i) { return (p.thumbs || [])[i] || p.images[i]; });
    var removed = (p.images || []).filter(function (_, i) { return keep.indexOf(i) < 0; }).concat((p.thumbs || []).filter(function (_, i) { return keep.indexOf(i) < 0; })).filter(isStored);
    if (add.length) { var up = await uploadPhotos(p.id, add, (p.images || []).length + 1); images = images.concat(up.images); thumbs = thumbs.concat(up.thumbs); }
    /* order: [{k:i}|{a:j}] puts kept and new photos back in the slots they had (a cropped cover stays first) */
    if (order && order.length === images.length) { var kc = keep.length, im2 = [], th2 = []; order.forEach(function (o) { var at = o.a != null ? kc + o.a : o.k; im2.push(images[at]); th2.push(thumbs[at]); }); images = im2; thumbs = th2; }
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
      items.forEach(function (it) { var p = d.products.find(function (x) { return x.id === it.id && x.status === "active"; }); if (!p) return; var q = Math.max(1, Math.min(99, it.qty || 1)); rows.push({ product_id: p.id, name: p.name, price: p.price, qty: q, thumb: p.thumbs[0], note: (it.note || "").trim().slice(0, 200) || null }); if (p.price == null) priced = false; else sub += p.price * q; cnt += q; p.ordered = (p.ordered || 0) + q; });
      var me = d.me && d.users.find(function (u) { return u.username === d.me; }); var addr = addressId && d.addresses.find(function (a) { return a.id === addressId; });
      var o = { code: demoCode(), created_at: new Date().toISOString(), status: "new", delivery: delivery, delivery_fee: null, agreed_total: null, seen_at: null, subtotal: sub, priced: priced, items_count: cnt, items: rows,
        customer: me ? me.username : null, customer_name: me ? me.full_name : name, customer_phone: me ? me.whatsapp : phone, address: addr ? { label: addr.label, line: addr.line, landmark: addr.landmark } : null, history: [{ s: "new", at: new Date().toISOString() }] };
      d.orders.unshift(o); demoSave(d); return { code: o.code, subtotal: sub, fee: o.delivery_fee, priced: priced, count: cnt };
    }
    items = items.map(function (it) { var x = { id: it.id, qty: it.qty }; if (it.note && String(it.note).trim()) x.note = String(it.note).trim().slice(0, 200); return x; });
    var r = await sb.rpc("create_order", { items: items, delivery: delivery, address_id: addressId || null, name: name || null, phone: phone || null });
    if (r.error) throw r.error; return r.data;
  },
  async getOrder(code) {
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === String(code).toUpperCase(); }); return o ? demoOrderView(o, d) : null; }
    var r = await sb.rpc("get_order", { c: code }); if (r.error) throw r.error; return r.data;
  },
  /* customer: payment details after the invoice; "Nimepokea" + stars */
  async submitPayment(code, ref, payer, channel) {
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === String(code).toUpperCase(); }); if (!o || o.status !== "invoiced") throw new Error("status"); o.claim_ref = ref; o.claim_name = payer; o.claim_channel = channel || null; o.claim_at = new Date().toISOString(); demoSave(d); return demoOrderView(o, d); }
    var r = await sb.rpc("submit_payment", { c: code, ref: ref, payer: payer, channel: channel || null }); if (r.error) throw new Error((r.error.message || "").match(/ref|payer|status/) ? r.error.message.match(/ref|payer|status/)[0] : "error"); return r.data;
  },
  async customerReceived(code, stars, note) {
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === String(code).toUpperCase(); }); if (!o || (o.status !== "paid" && o.status !== "done")) throw new Error("status"); if (o.status !== "done") o.history.push({ s: "done", at: new Date().toISOString(), by: "customer" }); o.status = "done"; o.rating = stars; o.rating_note = note || null; o.received_at = o.received_at || new Date().toISOString(); demoSave(d); return demoOrderView(o, d); }
    var r = await sb.rpc("customer_received", { c: code, stars: stars, note: note || null }); if (r.error) throw r.error; return r.data;
  },
  async setOrderName(code, name) {
    if (!live) { var d = demoGet(), o = d.orders.find(function (x) { return x.code === code; }); o.customer_name = name; demoSave(d); return demoOrderView(o, d); }
    var r = await sb.rpc("set_order_name", { c: code, name: name }); if (r.error) throw r.error; return r.data;
  },
  async myOrders() {
    if (!live) { var d = demoGet(); return d.orders.filter(function (o) { return d.me && o.customer === d.me; }); }
    var s = await sb.auth.getSession(); if (!s.data.session) return [];
    var r = await sb.from("orders").select("code,created_at,status,subtotal,agreed_total,priced,delivery_fee,items_count,cancel_reason,order_items(product_id,name,price,qty,thumb,note)").eq("customer_id", s.data.session.user.id).order("created_at", { ascending: false }).limit(100);
    if (r.error) throw r.error; return r.data.map(function (o) { o.items = o.order_items; delete o.order_items; return o; });
  },
  /* team side */
  async orders() {
    if (!live) { var dd = demoGet(), ch = false; dd.orders.forEach(function (o) { if (o.status === "new" && o.seen_at && Date.now() - new Date(o.seen_at) > 120000) { o.status = "progress"; o.history.push({ s: "progress", at: new Date().toISOString(), auto: true }); ch = true; } }); if (ch) demoSave(dd); return dd.orders.map(function (o) { return JSON.parse(JSON.stringify(o)); }); }
    var r = await sb.from("orders").select("*,order_items(product_id,name,price,qty,thumb,note)").order("created_at", { ascending: false }).limit(300);
    if (r.error) throw r.error; return r.data.map(function (o) { o.items = o.order_items; delete o.order_items; return o; });
  },
  async setOrder(code, status, extra) {
    extra = extra || {};
    if (!live) {
      var d = demoGet(), o = d.orders.find(function (x) { return x.code === code; });
      if (!o) throw new Error("not_found");
      if (status === "cancelled" && !String(extra.reason || "").trim() && o.status !== "cancelled") throw new Error("reason");
      if (o.status !== status) o.history.push({ s: status, at: new Date().toISOString() }); o.status = status;
      ["pay_ref","pay_name"].forEach(function (k) { if (extra[k]) o[k] = extra[k]; });
      if (extra.reason) o.cancel_reason = extra.reason; if (extra.phone) o.customer_phone = extra.phone; if (extra.fee != null) o.delivery_fee = extra.fee;
      if (extra.clear_total) o.agreed_total = null; else if (extra.total != null) o.agreed_total = extra.total;
      if (extra.seen && !o.seen_at) o.seen_at = new Date().toISOString();
      demoSave(d); return demoOrderView(o, d);
    }
    var r = await sb.rpc("set_order_v2", { c: code, st: status, ref: extra.pay_ref || null, payer: extra.pay_name || null, reason: extra.reason || null, phone: extra.phone || null,
      fee: extra.fee == null ? null : extra.fee, total: extra.total == null ? null : extra.total, clear_total: !!extra.clear_total, seen: !!extra.seen });
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
        orders: os.length + 13, paid: paid.length + 8, sales: paid.reduce(function (s, o) { return s + W.total(o); }, 0) + 412000,
        open: d.orders.filter(function (o) { return ["new","progress","invoiced","paid"].indexOf(o.status) >= 0; }).length, new: d.orders.filter(function (o) { return o.status === "new"; }).length, by_day: byDay,
        p_new: os.filter(function (o) { return o.status === "new"; }).length + 2, pending: os.filter(function (o) { return ["progress","invoiced","paid"].indexOf(o.status) >= 0; }).length + 3, done: os.filter(function (o) { return o.status === "done"; }).length + 8, cancelled: os.filter(function (o) { return o.status === "cancelled"; }).length,
        customers: 11, new_customers: 7, rating: 4.6,
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
      if (action === "reset" && String(body.password || "").length < 6) throw new Error("password_short");
      demoSave(d); return { ok: true, team: d.team };
    }
    var r = await sb.functions.invoke("team", { body: Object.assign({ action: action }, body || {}) });
    if (r.error) throw await fnErr(r); return r.data;
  },
  /* accounts: username + 6-digit PIN (customers and staff); staff can still use email + password */
  async account(action, body) {
    if (!live) {
      var d = demoGet(); body = body || {};
      if (action === "signup") {
        if (d.users.some(function (u) { return u.username === body.username; })) throw new Error("taken");
        if (d.users.some(function (u) { return u.whatsapp === W.waPhone(body.whatsapp); })) throw new Error("duplicate");
        if (String(body.password || "").length < 6) throw new Error("password");
        d.users.push({ username: body.username, password: body.password, full_name: body.full_name, whatsapp: W.waPhone(body.whatsapp), email: body.email || null }); d.me = body.username; demoSave(d); return { ok: true };
      }
      if (action === "login") { var lg = String(body.login).toLowerCase().replace(/^@/, ""); var u = d.users.find(function (x) { return (x.username === lg || (x.email && x.email === lg)) && x.password === body.password; }); if (!u) { d.fails = (d.fails || 0) + 1; demoSave(d); var e = new Error(d.fails >= 5 ? "locked" : "wrong"); e.info = { left: Math.max(0, 5 - d.fails) }; if (d.fails >= 5) d.fails = 0; demoSave(d); throw e; } d.fails = 0; d.me = u.username; demoSave(d); return { ok: true }; }
      if (action === "contacts") { var me = d.users.find(function (x) { return x.username === d.me; }); if (body.whatsapp) { var nw = W.waPhone(body.whatsapp); if (d.users.some(function (x) { return x !== me && x.whatsapp === nw; })) throw new Error("duplicate"); me.whatsapp = nw; } if (body.email !== undefined) me.email = body.email || null; demoSave(d); return { ok: true }; }
      if (action === "delete") { d.users = d.users.filter(function (x) { return x.username !== d.me; }); d.addresses = d.addresses.filter(function (a) { return a.owner !== d.me; }); d.me = null; demoSave(d); return { ok: true }; }
      if (action === "set_pin" || action === "set_password") { if (String(body.password || "").length < 6) throw new Error("password"); return { ok: true }; }
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
    if (r.error) throw r.error;
    if (!r.data) { var md = s.data.session.user.user_metadata || {}; return { needsProfile: true, full_name: md.full_name || md.name || "", email: s.data.session.user.email || "" }; }
    return r.data;
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
  google: !!(live && C.google),
  async signInGoogle() { var r = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: W.shopUrl() + "?go=me" } }); if (r.error) throw r.error; },
  /* order alerts */
  async pushKey() {
    var r = await sb.rpc("push_public_key"); if (r.data) return r.data;
    var s = await sb.functions.invoke("notify", { body: { action: "setup" } }); if (s.error) throw s.error; return s.data.publicKey;
  },
  async savePush(j, appUrl) {
    var s = await sb.auth.getSession(), uid = s.data.session && s.data.session.user.id;
    var row = { user_id: uid, endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, app_url: appUrl, ua: navigator.userAgent.slice(0, 160), fails: 0 };
    var r = await sb.from("push_subs").upsert(row, { onConflict: "endpoint" }); if (r.error) throw r.error;
  },
  async dropPush(endpoint) { var r = await sb.from("push_subs").delete().eq("endpoint", endpoint); if (r.error) throw r.error; },
  async testPush() {
    if (!live) return { sent: 1 };
    var r = await sb.functions.invoke("notify", { body: { action: "test" } }); if (r.error) throw await fnErr(r); return r.data;
  },
  resetDemo() { ls(DEMO_KEY, null); W._demoMem = null; },
  /* staff session */
  async session() {
    if (!live) { if (W.APP === "shop") { var d = demoGet(); return d.me ? { demo: true } : null; } return { demo: true }; }
    var r = await sb.auth.getSession(); return r.data.session;
  },
  async signIn(login, secret) {
    if (!live) return W.APP === "shop" ? this.account("login", { login: login, password: secret }) : { demo: true };
    if (/@/.test(login)) { var r = await sb.auth.signInWithPassword({ email: login, password: secret }); if (!r.error) return r.data.session; }
    return this.account("login", { login: login, password: secret });
  },
  /* handoff page: is a team member signed in in this browser? (demo: only when a test sets winga.demoTeam) */
  async teamHere() { if (!live) return ls("winga.demoTeam") === "1"; var s = await this.session(); return !!s && await this.isAdmin(); },
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
W.shopUrl = function () { var u = location.href.split("#")[0].split("?")[0]; return u.replace(/admin\/?([a-z]+\.html)?$/, "").replace(/index\.html$/, ""); };
W.adminUrl = function () { return W.shopUrl() + "admin/"; };
})();
