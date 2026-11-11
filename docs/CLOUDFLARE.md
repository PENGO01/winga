# Cloudflare: finish line for niagize.tz (free plan)

Status 11 Nov: the app already runs at `niagize.kariakoo.workers.dev` (auto-deploys from `main`). What is left is the domain.

## 1. Pages project (5 min)
Workers & Pages → the project → **Settings → Builds**: framework *None*, build command *(empty)*, output directory `/` (repo root), production branch `main`. Preview deployments: on (every branch gets its own link, use it to retest before merging).

## 2. Custom domain (10 min + DNS wait)
1. Add `niagize.tz` as a site in Cloudflare (free plan). At the .tz registrar set the two Cloudflare nameservers it shows. `.tz` is run by TZNIC, so the change can take up to a day.
2. Pages project → **Custom domains → Set up** `niagize.tz`, then again for `www.niagize.tz`. Cloudflare creates the DNS records and the certificate.
3. **Rules → Redirect Rules**: `www.niagize.tz/*` → `https://niagize.tz/$1`, 301.
4. **SSL/TLS** → mode *Full (strict)*; turn on *Always Use HTTPS* and *Automatic HTTPS Rewrites*.
5. **Speed → Optimization**: Brotli on, HTTP/3 on, Early Hints on. Leave Rocket Loader and Auto Minify off (they break plain inline scripts).

## 3. Swap the address in the app (one small commit, after the domain answers)
- `index.html` (root): `og:image` → `https://niagize.tz/og-v2.jpg`
- `beta/index.html`, `beta/admin/*.html`: `og:image` stays on the beta link until promote; at promote the copy in root takes the new address.
- Supabase → Authentication → URL Configuration: add `https://niagize.tz` as Site URL and redirect URL.
- Anyone on the old link re-adds the Home Screen icon and signs in again: tell Boss Deus first.

## 4. Check
`curl -I https://niagize.tz` shows `200`, `server: cloudflare`, `x-content-type-options: nosniff`. Open `/robots.txt`, `/sitemap.xml`, `/llms.txt`. PageSpeed Insights on the home page.

## 5. Then search
Search Console + Bing Webmaster + Google Business Profile (see `docs/SEO.md`).

## Free-plan limits worth knowing
Pages: 500 builds a month, unlimited bandwidth for static files. Web Analytics (free) gives visits without cookies: switch it on in the dashboard, no code needed.
