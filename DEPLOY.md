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

`.env` (mode 600, never committed):

```
NEXT_PUBLIC_SITE_URL=https://learn.zerwiz.org
DATABASE_URL=file:/home/zerwizserver/learnai/db/custom.db
LLM_BASE_URL=http://heimdall.tailefab81.ts.net:8080/v1
LLM_API_KEY=<LLAMA_SWAP_API_KEY from the vault>
LLM_MODEL=qwen3.6-35b-a3b@q4_k_xl-mtp
```

## Live playground backends

The playground's three tabs are env-driven (`RULES/07`):

| Tab | Backend | Config |
|---|---|---|
| `chat` | the llama-swap rail, OpenAI-compatible | `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` |
| `image` | any OpenAI-compatible images endpoint | `IMAGE_BASE_URL`, `IMAGE_API_KEY`, `IMAGE_MODEL` |
| `search` | one of `searxng` / `brave` / `tavily` / `custom` | `SEARCH_PROVIDER`, `SEARCH_API_URL`, `SEARCH_API_KEY` |

The rail is reached over the **tailnet** (`heimdall.tailefab81.ts.net:8080`), so the
tunnel keeps working on and off LAN. The rail runs `--models-max 1`: the first
request after idle pays the model-load cost.

Image and search have **no backend today** — the vault's OpenAI key is rejected
and there is no local SearXNG. Both return an honest `503` until configured;
the UI shows the message rather than pretending.

## Regenerating brand assets

```bash
./scripts/generate-brand-assets.sh   # brand/*.svg -> public/ (favicon, icons, og.png)
```

After regenerating `og.png`, purge the Cloudflare edge cache (it is cached
`max-age=14400`) or the old plate will keep being served.

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
