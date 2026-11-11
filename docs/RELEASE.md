# How we ship (small steps, always reversible)

1. **Branch** from `main`: `git checkout -b v2.NN-short-name`.
2. **Build in `beta/`** only. SQL goes in `supabase/migrations/YYYY-MM-DD_vX.Y_name.sql` with an undo line; apply on **winga-dev** first.
3. **Bump** `W.VERSION` (`beta/shared/core.js`) and the service-worker cache name (`beta/sw.js`). Add a `CHANGELOG.md` entry and tick `ROADMAP.md`.
4. **Test**: `python3 -m http.server 8765`, then `cd tests && python3 <suite>.py` (README there). CI runs the same on every pull request.
5. **Pull request** with the template. Squash-merge into `main` when green. GitHub Pages publishes `main`.
6. **Before any deployment** list open High items from `Cowork/_review/pending.md`; log new pending items, observations, failures there.
7. **Promote** (beta to live root), only after real-phone check: copy app files, keep root `shared/config.js`, remove `noindex`, rename cache prefix `winga-beta` to `winga-full`, order once end to end.
8. **Roll back** = revert the merge commit; DB changes use the undo line.

Commits go out as `Super Admin <PENGO01@users.noreply.github.com>`.
