# Deploying LearnAI

LearnAI is a static-ish Next.js site (Prisma/SQLite) served from **zerwizserver**
behind the AI Geeks & Freaks Cloudflare tunnel.

| | |
|---|---|
| Live | https://learn.zerwiz.org |
| Host | zerwizserver (`192.168.68.103`, tailnet `100.88.238.83`) |
| Port | **3742** (loopback, uncommon) |
| Unit | `learnai.service` (systemd, enabled at boot) |
| Tunnel | `aigeeksandfreaks` (`e3a203ac-…`) → `~/.cloudflared/config.yml` |
| App dir | `/home/zerwizserver/learnai` |
| Runtime | `bun` (`/home/zerwizserver/.bun/bin/bun`) |

## First-time setup (already done)

```bash
# on zerwizserver
git clone https://github.com/zerwiz/learnai.git ~/learnai
cd ~/learnai
PATH="$HOME/.bun/bin:$PATH" bun install
PATH="$HOME/.bun/bin:$PATH" bun run db:generate
PATH="$HOME/.bun/bin:$PATH" bun run build
```

`.env`:

```
DATABASE_URL=file:/home/zerwizserver/learnai/db/custom.db
```

## systemd unit

`/etc/systemd/system/learnai.service` — copy of `learnai.service` in this repo,
`PORT=3742`, `HOSTNAME=127.0.0.1`, runs `.next/standalone/server.js`.

## Cloudflare ingress

`~/.cloudflared/config.yml`, after the `aigeeksnfreaks` rule:

```yaml
  - hostname: learn.zerwiz.org
    service: http://localhost:3742
```

DNS route (once):

```bash
cloudflared tunnel route dns aigeeksandfreaks learn.zerwiz.org
```

## Redeploy

```bash
ssh zerwizserver@100.88.238.83 'cd ~/learnai && git pull && \
  PATH="$HOME/.bun/bin:$PATH" bun install && \
  PATH="$HOME/.bun/bin:$PATH" bun run build && \
  sudo -S systemctl restart learnai.service'
```

Or run `deploy.sh` from a clone.
