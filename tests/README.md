# Tests

Browser checks with Playwright against the beta in **demo mode** (`?demo`): no database, no network, safe to run anywhere.
`hook.py` exposes the apps' internals to the tests (it rewrites the page in the test browser only).

```bash
pip install playwright && python -m playwright install chromium
python3 -m http.server 8765          # from the repo root, in another terminal
cd tests
python3 boss_orders.py               # Boss: invoice in one tap, WhatsApp retry, number prefill        11 checks
python3 shop_orders.py               # Shop: payment channels, proof of order, thank-you card, Track oda 23 checks
python3 order_tabs.py                # Boss tabs + search, Ongeza, invoice-first card, Mimi open orders 10 checks
```

Each script prints PASS / FAIL per check and a total. Screenshots go to `/tmp/`.
