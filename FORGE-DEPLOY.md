# How this project deploys

**Project:** `learnai` · **Forge:** <https://forgejo.zerwiz.org/zerwiz/learnai>

Everything below is enforced in three places, so one mistake is not enough:
**on your machine** (the hooks), **on the forge** (branch protection), and **on
the server** (it checks the branch out by name). Read that sentence twice — the
reason the same rule exists in three places is that each one has failed
independently during this work.

---

## The two branches

```
main        work lands here, by pull request. Bad code CAN land here.
validated   the ONLY branch the server pulls. A push here is a DEPLOY.
```

Anything else — `feature/*`, `bugfix/*` — is just work in progress.

## The ordinary day

```bash
git switch -c feature/what-i-am-doing
# ... write, commit, test ...

git push -u origin feature/what-i-am-doing
# open a pull request to main, get it reviewed, merge it
```

Merging to `main` does **not** deploy anything. That is deliberate: it is where
bad code is allowed to land so it can be fixed in the open.

## Shipping it

```bash
bash bin/promote-to-validated.sh    # main -> validated, after the checks
bash bin/forgejo-deploy.sh          # push validated to the forge
```

Then **stop.** The server notices the forge within a minute, pulls `validated`,
migrates, builds, swaps the release, restarts, and checks the public URL. You do
not log into the server, and you should not: a deploy that needs a human is a
deploy that happens at the wrong hour.

## The guards, once per clone

```bash
bash bin/install-hooks.sh
```

Without it **this clone has no guards at all**, and the absence of a guard is
invisible. A fresh clone, a new machine, a teammate — none of them have the
hooks until they run it.

| Hook | Refuses |
|---|---|
| `pre-commit` | a plain commit on `main`; a branch named nothing in particular; a credential file; a staged line that assigns a secret; a schema change with no migration |
| `pre-push` | a direct push to `main`; a push to `validated` of a commit `main` does not have; a force push to a permanent branch |

Every guard has a named, deliberate override (`AIGF_SKIP_SECRETS=1`,
`AIGF_ALLOW_MAIN_PUSH=1`, …). That is on purpose: a guard with no escape is a
guard people disable wholesale, and one that is always disabled teaches everyone
the rules are theatre. Two guards have **no** override by design — the deploy
refuses `main`, and so does the promotion path.

## If something is wrong after a deploy

The server keeps releases rather than overwriting the live tree, so rolling back
is a re-point of a symlink, not a rebuild:

```bash
ssh <server> 'ls -lt ~/releases | head'          # what is on disk
```

The ledger of what the watcher did is here:

```bash
ssh <server> 'tail -50 ~/.state/forge/learnai.log'
```

## The one rule that is not negotiable

**A number on a public page may only be a count of rows we can query.** If you
cannot run the query, the number does not go on the page.
