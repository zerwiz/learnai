// LearnAI course content — 5 tracks, real lessons with runnable code.
// This is the single source of truth used by both the API routes and the UI.

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type LessonBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'code'; lang: string; caption?: string; code: string }
  | { type: 'tip'; text: string }
  | { type: 'warn'; text: string }
  | { type: 'try'; text: string }

export type Lesson = {
  id: string
  title: string
  blurb: string
  duration: string
  difficulty: Difficulty
  blocks: LessonBlock[]
}

export type Track = {
  id: string
  number: number
  slug: string
  title: string
  tagline: string
  description: string
  accent: 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan'
  icon: string
  lessons: Lesson[]
}

export const tracks: Track[] = [
  {
    id: 't1',
    number: 1,
    slug: 'git-github',
    title: 'Git & GitHub',
    tagline: 'The Foundation',
    description:
      'Every coder needs this first. Before models, before Python — learn to move code around. Branch, commit, push, and never break main again.',
    accent: 'emerald',
    icon: 'GitBranch',
    lessons: [
      {
        id: 'l1',
        title: 'Making Your First Repo',
        blurb: 'Create a repo, clone it, push your first commit.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A repository (repo) is just a folder that Git tracks. You can make one on GitHub and pull it down, or turn a local folder into one. Both paths are valid — pick the one that feels right.' },
          { type: 'h', text: 'Option A — Create on GitHub, then clone' },
          { type: 'code', lang: 'bash', caption: 'Create a repo with the GitHub CLI', code: `# Install GitHub CLI once: https://cli.github.com
gh auth login

# Create a new public repo
gh repo create learnai --public --description "AI learning experiments"

# Clone it locally (SSH recommended)
git clone git@github.com:zerwiz/learnai.git
cd learnai` },
          { type: 'h', text: 'Option B — Init a folder you already have' },
          { type: 'code', lang: 'bash', code: `git init
git remote add origin git@github.com:zerwiz/learnai.git
git branch -M main
git add .
git commit -m "initial commit"
git push -u origin main` },
          { type: 'tip', text: 'Use SSH keys, not passwords. Set them up once and never type a credential again. See GitHub → Settings → SSH and GPG keys.' },
          { type: 'try', text: 'Make a repo called `learnai`, clone it, create a README.md with one line, commit it as "add readme", and push. If it shows up on GitHub, you win.' },
        ],
      },
      {
        id: 'l2',
        title: 'Cloning: SSH vs HTTPS',
        blurb: 'Two ways to grab code. SSH wins long-term.',
        duration: '10 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Cloning downloads a copy of a repo to your machine. You can do it over SSH (key-based, frictionless) or HTTPS (prompts for a token every time). Use SSH.' },
          { type: 'code', lang: 'bash', caption: 'SSH — recommended, uses your key', code: `git clone git@github.com:zerwiz/learnai.git` },
          { type: 'code', lang: 'bash', caption: 'HTTPS — prompts for a personal access token', code: `git clone https://github.com/zerwiz/learnai.git` },
          { type: 'code', lang: 'bash', caption: 'Clone a specific branch only', code: `git clone -b dev git@github.com:zerwiz/learnai.git` },
          { type: 'warn', text: 'If HTTPS keeps asking for your password, GitHub removed password auth in 2021. You need a Personal Access Token, not your login password. Save yourself the pain — go SSH.' },
          { type: 'try', text: 'Run `git remote -v` inside a cloned repo. You should see `origin` pointing at your fork. Remember that word — `origin` matters.' },
        ],
      },
      {
        id: 'l3',
        title: 'Forking & Upstream',
        blurb: 'Your copy vs the original. Keep them straight.',
        duration: '12 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A fork is your personal copy of someone else\'s repo. You can change it freely. The original is called `upstream`. You pull fixes from `upstream` and push your work to `origin` (your fork).' },
          { type: 'code', lang: 'bash', caption: 'Fork and clone in one move', code: `gh repo fork zerwiz/learnai --clone=true
cd learnai` },
          { type: 'code', lang: 'bash', caption: 'Add the original repo as upstream', code: `git remote add upstream git@github.com:zerwiz/learnai.git

# Verify your remotes
git remote -v
# origin    → your fork
# upstream  → the original` },
          { type: 'tip', text: '`origin` is yours to push to. `upstream` is read-only — you pull from it, you never push to it.' },
          { type: 'try', text: 'Fork any public repo, add upstream, and run `git remote -v`. Confirm you have exactly two remotes.' },
        ],
      },
      {
        id: 'l4',
        title: 'Syncing a Fork',
        blurb: 'Keep your fork fresh with the original.',
        duration: '10 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'The original repo keeps moving. To stay current, fetch from `upstream` and rebase your `main` onto it. Rebase keeps history linear and clean.' },
          { type: 'code', lang: 'bash', code: `# Pull latest changes from the original
git fetch upstream

# Switch to your fork's main
git checkout main

# Replay your main on top of upstream
git rebase upstream/main

# Ship it to your fork
git push origin main` },
          { type: 'warn', text: 'Never `merge` upstream into main if you can `rebase`. Merge commits clutter history. Rebase replays your commits cleanly on top.' },
          { type: 'try', text: 'Fetch upstream, then run `git log --oneline -5`. You should see commits from the original repo at the top.' },
        ],
      },
      {
        id: 'l5',
        title: 'Branching & Pull Requests',
        blurb: 'Never push to main. Branch first, always.',
        duration: '14 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: '`main` is sacred. You don\'t push to it. You branch off, do your thing, push the branch, and open a Pull Request (PR) so someone (even future-you) can review it.' },
          { type: 'code', lang: 'bash', code: `# Create and switch to a feature branch
git checkout -b feature/my-idea

# Work, stage, commit
git add .
git commit -m "add learning module"

# Push the branch upstream (-u sets tracking)
git push -u origin feature/my-idea

# Open a PR from the command line
gh pr create --title "Add learning module" \\
  --body "Description of what changed and why"` },
          { type: 'tip', text: 'Branch names like `feature/...`, `fix/...`, `docs/...` tell everyone what the branch is for at a glance.' },
          { type: 'try', text: 'Create a branch, add a file, commit, push, and open a PR. Then merge it via the GitHub web UI.' },
        ],
      },
      {
        id: 'l6',
        title: 'Small, Focused PRs',
        blurb: 'One thing per PR. Reviewers (and future-you) will thank you.',
        duration: '8 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A PR should do one thing. Refactor the auth helper, OR add the signup form, OR fix the typo — not all three. Small PRs get reviewed faster, merged faster, and are easier to revert when they break something.' },
          { type: 'code', lang: 'bash', caption: 'Splitting work into focused branches', code: `git checkout main
git checkout -b fix/typo-in-readme
# ... fix typo, commit, push, open PR, merge ...

git checkout main
git pull
git checkout -b feature/add-login
# ... build login, commit, push, open PR ...` },
          { type: 'tip', text: 'If your PR title needs an "and", it\'s probably two PRs.' },
          { type: 'try', text: 'Look at your last few commits. Could any have been split? Practice the "one PR, one change" rule on your next contribution.' },
        ],
      },
    ],
  },
  {
    id: 't2',
    number: 2,
    slug: 'python-ai',
    title: 'Python for AI',
    tagline: 'The Language',
    description:
      'Python is the lingua franca of AI. Learn it the right way — environments, data structures, and the real skill: reading error messages.',
    accent: 'amber',
    icon: 'Terminal',
    lessons: [
      {
        id: 'l1',
        title: 'Setup: Python, pip, venv',
        blurb: 'Get a clean, isolated Python environment running.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Never install packages into your system Python. Always use a virtual environment (`venv`) — an isolated folder that keeps each project\'s dependencies separate. This single habit will save you from a world of pain.' },
          { type: 'code', lang: 'bash', caption: 'Create and activate a virtual environment', code: `# Create a venv named .venv in your project
python -m venv .venv

# Activate it (macOS / Linux)
source .venv/bin/activate

# Activate it (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Your prompt now shows (.venv) — you're isolated` },
          { type: 'code', lang: 'bash', caption: 'Install packages and freeze requirements', code: `pip install requests
pip freeze > requirements.txt

# Reproduce the same env later:
pip install -r requirements.txt` },
          { type: 'tip', text: 'Add `.venv/` to your `.gitignore`. Never commit the environment — only the `requirements.txt` that describes it.' },
          { type: 'try', text: 'Create a venv, install `requests`, and run `python -c "import requests; print(requests.__version__)"`. You should see a version number, no errors.' },
        ],
      },
      {
        id: 'l2',
        title: 'Basics: Variables, Loops, Functions',
        blurb: 'The building blocks. Keep them small and obvious.',
        duration: '20 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Python reads like English. Variables don\'t need types declared, loops are readable, and functions are defined with `def`. Keep functions short — if it doesn\'t fit on one screen, split it.' },
          { type: 'code', lang: 'python', caption: 'Variables, a loop, and a function', code: `# Variables — type is inferred
name = "ada"
year = 1815
is_alive = False

# A loop with f-string interpolation
for i in range(3):
    print(f"attempt {i + 1}: hello {name}")

# A function with a docstring and default arg
def greet(who: str, excited: bool = False) -> str:
    """Return a greeting. excite it if asked."""
    msg = f"hello, {who}"
    return msg.upper() + "!" if excited else msg

print(greet("world"))
print(greet("world", excited=True))` },
          { type: 'tip', text: 'Type hints (`who: str`, `-> str`) are optional but worth it. Your editor (and future-you) will catch bugs before you run the code.' },
          { type: 'try', text: 'Write a function `fib(n)` that returns the first `n` Fibonacci numbers as a list. Call it and print the first 10.' },
        ],
      },
      {
        id: 'l3',
        title: 'Data Structures: Lists, Dicts, JSON',
        blurb: 'How AI code moves data around.',
        duration: '18 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Almost everything in AI is a list or a dict. Lists are ordered arrays. Dicts are key-value maps. JSON — the wire format for every API you\'ll call — is just nested dicts and lists. Master these three and you can read 80% of AI code.' },
          { type: 'code', lang: 'python', code: `import json

# A list of dicts — the most common shape in AI code
messages = [
    {"role": "user", "content": "what is 2+2?"},
    {"role": "assistant", "content": "4"},
]

# Access and mutate
messages.append({"role": "user", "content": "and 3+3?"})

# Serialize to a JSON string (for an API body)
payload = json.dumps(messages, indent=2)
print(payload)

# Parse a JSON string back into Python objects
parsed = json.loads(payload)
print(parsed[0]["content"])  # "what is 2+2?"` },
          { type: 'tip', text: 'When an API call fails, the first thing to do is `print(json.dumps(response, indent=2))`. You can\'t debug what you can\'t see.' },
          { type: 'try', text: 'Build a list of 3 people (each a dict with `name` and `age`). Serialize to JSON, write it to `people.json`, read it back, and print the names of anyone over 25.' },
        ],
      },
      {
        id: 'l4',
        title: 'Reading Docs & Errors',
        blurb: 'The real skill. The one that makes you a coder.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Writing code is 20% of the job. The other 80% is reading docs, reading error messages, and reading other people\'s code. Get good at this and you can learn any language or library in a weekend.' },
          { type: 'code', lang: 'text', caption: 'A real Python traceback — read it bottom-up', code: `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    user = fetch_user(user_id)
  File "app.py", line 6, in fetch_user
    return db[id]
KeyError: 42` },
          { type: 'p', text: 'Read from the bottom. The last line (`KeyError: 42`) is what actually went wrong. The lines above tell you where. `KeyError` means a dict lookup failed for key `42`. Fix: check the key exists first, or use `.get(id)` which returns `None` instead of crashing.' },
          { type: 'tip', text: 'Paste the exact error string into a search engine. Someone hit it before you. Stack Overflow, GitHub issues, and docs usually have the answer in the first result.' },
          { type: 'try', text: 'Write code that deliberately divides by zero. Read the traceback. Then write code that catches the error with `try`/`except` and prints a friendly message instead of crashing.' },
        ],
      },
      {
        id: 'l5',
        title: 'Installing & Using Packages',
        blurb: 'pip is your package manager. Use it wisely.',
        duration: '12 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Python\'s superpower is its ecosystem. Need to hit an API? `pip install requests`. Need to crunch data? `pip install pandas`. Don\'t reinvent wheels — find the package, read its README, use it.' },
          { type: 'code', lang: 'bash', code: `# Search and install
pip install requests httpx

# See what's installed
pip list

# Uninstall
pip uninstall requests

# Upgrade
pip install --upgrade requests` },
          { type: 'code', lang: 'python', caption: 'Using the requests package to hit an API', code: `import requests

resp = requests.get("https://api.github.com/repos/zerwiz/learnai")
print(resp.status_code)   # 200
print(resp.json()["name"])  # "learnai"` },
          { type: 'warn', text: 'Always activate your venv before `pip install`. Otherwise you pollute your system Python and things get weird fast.' },
          { type: 'try', text: 'Install `requests`, fetch `https://api.github.com`, and print the value of the `current_user_url` field from the JSON response.' },
        ],
      },
    ],
  },
  {
    id: 't3',
    number: 3,
    slug: 'talking-to-models',
    title: 'Talking to Models',
    tagline: 'The API',
    description:
      'Connect to AI models and make them do things. REST, JSON, prompting, streaming, and error handling — the rail that everything AI rides on.',
    accent: 'cyan',
    icon: 'MessageSquare',
    lessons: [
      {
        id: 'l1',
        title: 'What is an API? REST & JSON',
        blurb: 'How programs talk to each other over the web.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'An API is a menu of things a program will do for you if you ask correctly. REST is the convention: you send an HTTP request to a URL with a JSON body, and you get a JSON response back. That\'s 90% of modern web APIs.' },
          { type: 'code', lang: 'text', caption: 'The shape of a REST request', code: `POST /v1/chat/completions      <- method + path
Host: api.example.com
Content-Type: application/json
Authorization: Bearer sk-...

{                              <- JSON body
  "model": "glm-4.6",
  "messages": [
    {"role": "user", "content": "say hi"}
  ]
}` },
          { type: 'p', text: 'The response is also JSON. It has a status code (200 = ok, 4xx = your fault, 5xx = their fault) and a body. You parse the body, grab the field you need, and move on.' },
          { type: 'tip', text: 'Status codes: 200 success, 400 bad request (you messed up the JSON), 401 unauthorized (bad key), 429 rate limited (slow down), 500 server error (try again).' },
          { type: 'try', text: 'Open the Playground tab on this page and send a chat message. Watch the network tab — that\'s a real REST call to a real model. You\'re already doing it.' },
        ],
      },
      {
        id: 'l2',
        title: 'OpenAI-Compatible Endpoints',
        blurb: 'The one API shape that rules them all.',
        duration: '18 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Almost every model provider — OpenAI, Z.ai, local llama.cpp servers, Ollama — speaks the same "OpenAI-compatible" protocol. Learn it once, point it at any endpoint, swap models freely. It\'s the USB-C of AI.' },
          { type: 'code', lang: 'python', caption: 'Call a chat completion endpoint with requests', code: `import requests

url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {
    "model": "glm-4.6",
    "messages": [
        {"role": "user", "content": "Explain recursion in one line."}
    ],
}

resp = requests.post(url, json=payload, headers=headers)
data = resp.json()
print(data["choices"][0]["message"]["content"])` },
          { type: 'tip', text: 'The `messages` array is a conversation: `system` sets behavior, `user` is the human, `assistant` is prior model replies. Append to it to keep context.' },
          { type: 'try', text: 'Replace YOUR_API_KEY with a real key, run it, and read the model\'s answer. You just built an AI app in 12 lines.' },
        ],
      },
      {
        id: 'l3',
        title: 'Prompting: Writing Good Instructions',
        blurb: 'Garbage in, garbage out. Write prompts that can\'t be misread.',
        duration: '20 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A prompt is an instruction. Vague prompts get vague answers. Good prompts are specific about role, task, format, and constraints. Treat the model like a smart intern who has never seen your codebase.' },
          { type: 'code', lang: 'text', caption: 'Bad prompt vs good prompt', code: `# Bad
"write a function"

# Good
"You are a Python teacher. Write a function called
fib(n) that returns the first n Fibonacci numbers as
a list. Include a one-line docstring. Handle n <= 0
by returning an empty list. Show only the code."` },
          { type: 'p', text: 'Patterns that work: give the model a role, state the exact output format, show an example, add constraints ("only code, no explanation"), and split complex tasks into steps.' },
          { type: 'tip', text: 'If the model keeps ignoring a rule, move that rule to the end of the prompt. Recency bias is real — the last thing the model reads weighs heaviest.' },
          { type: 'try', text: 'Open the Playground chat tab. Ask the model to "write a haiku about git" — then re-ask with a detailed persona and format spec. Compare the two answers.' },
        ],
      },
      {
        id: 'l4',
        title: 'Building a Chat App',
        blurb: 'Wire a model into a real interface.',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A chat app is just a loop: render messages, take user input, append it, call the model, append the reply, re-render. The conversation history is the whole context — you send it back every turn.' },
          { type: 'code', lang: 'python', caption: 'A minimal CLI chat loop', code: `import requests

URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
KEY = "YOUR_API_KEY"

history = [{"role": "system", "content": "You are a concise pair programmer."}]

while True:
    user = input("you > ")
    if user in ("quit", "exit"):
        break
    history.append({"role": "user", "content": user})

    resp = requests.post(
        URL,
        json={"model": "glm-4.6", "messages": history},
        headers={"Authorization": f"Bearer {KEY}"},
    )
    reply = resp.json()["choices"][0]["message"]["content"]
    print("ai  >", reply)
    history.append({"role": "assistant", "content": reply})` },
          { type: 'tip', text: 'Notice we keep `history` and re-send it each turn. That\'s how the model "remembers". Trim old messages when history gets long to save tokens.' },
          { type: 'try', text: 'Run the loop above. Have a 3-turn conversation. The model should remember your name from turn 1 in turn 3.' },
        ],
      },
      {
        id: 'l5',
        title: 'Streaming & Error Handling',
        blurb: 'Make it fast and unbreakable.',
        duration: '20 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Waiting for a full answer is slow. Streaming sends tokens as they\'re generated — the user sees text appear live. Combine with robust error handling and your app feels instant and never crashes.' },
          { type: 'code', lang: 'python', caption: 'Stream tokens with the OpenAI SDK', code: `from openai import OpenAI

client = OpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key="YOUR_API_KEY",
)

stream = client.chat.completions.create(
    model="glm-4.6",
    messages=[{"role": "user", "content": "tell me a story"}],
    stream=True,
)

for chunk in stream:
    delta = chunk.choices[0].delta.content or ""
    print(delta, end="", flush=True)` },
          { type: 'code', lang: 'python', caption: 'Never trust the network — wrap it', code: `import requests, time

def safe_chat(messages, retries=3):
    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(URL, json={"messages": messages}, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            if attempt == retries:
                raise
            time.sleep(attempt * 1.5)  # back off` },
          { type: 'warn', text: 'Always set a `timeout`. Without it, a hung request will freeze your app forever. 30 seconds is a sane default for chat.' },
          { type: 'try', text: 'Turn the streaming example into a generator function `def stream_reply(prompt)` and use it in a chat loop. Watch the text type out token by token.' },
        ],
      },
    ],
  },
  {
    id: 't4',
    number: 4,
    slug: 'building-with-ai',
    title: 'Building with AI',
    tagline: 'The Projects',
    description:
      'Put it all together. Real projects, real deployment, real users. CLI tools, web apps, Cloudflare Pages, and auth that actually works.',
    accent: 'violet',
    icon: 'Rocket',
    lessons: [
      {
        id: 'l1',
        title: 'CLI Tool That Talks to a Model',
        blurb: 'Ship a terminal command powered by AI.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A CLI tool is the simplest thing you can ship. One Python file, an argument, a model call, a printed answer. Users install it, run `ask "what is git rebase"`, and get an answer. That\'s a product.' },
          { type: 'code', lang: 'python', caption: 'ask.py — a tiny AI CLI', code: `import sys, requests

def main():
    if len(sys.argv) < 2:
        print("usage: ask <question>")
        sys.exit(1)
    question = " ".join(sys.argv[1:])

    resp = requests.post(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        json={
            "model": "glm-4.6",
            "messages": [{"role": "user", "content": question}],
        },
        headers={"Authorization": "Bearer YOUR_KEY"},
        timeout=30,
    )
    print(resp.json()["choices"][0]["message"]["content"])

if __name__ == "__main__":
    main()` },
          { type: 'code', lang: 'bash', caption: 'Run it', code: `python ask.py "what is the difference between git merge and rebase?"` },
          { type: 'try', text: 'Build `ask.py`, run it with a real question. Then add a `--system` flag so the user can set a persona.' },
        ],
      },
      {
        id: 'l2',
        title: 'Web App with Model Backend',
        blurb: 'A page that talks to a model. The classic AI web app.',
        duration: '40 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'The shape every AI web app follows: a frontend (HTML/React) collects input, a backend route calls the model, the result renders back. Keep the model call server-side so your API key never reaches the browser.' },
          { type: 'code', lang: 'text', caption: 'The request flow', code: `[ browser ] --POST /api/chat--> [ your server ] --REST--> [ model API ]
     ^                                      |
     +------------- JSON response <---------+` },
          { type: 'code', lang: 'typescript', caption: 'A Next.js API route that proxies to a model (server-side key)', code: `// app/api/chat/route.ts
import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: "disabled" },
  });
  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}` },
          { type: 'warn', text: 'Never put your model API key in frontend code. It will be scraped in seconds. Keep it in `.env` and only read it inside server-side files.' },
          { type: 'try', text: 'Look at the Playground chat tab on this very page — it calls exactly this kind of route. Open devtools and watch `/api/playground/chat`.' },
        ],
      },
      {
        id: 'l3',
        title: 'Deploying to Cloudflare Pages',
        blurb: 'Put it on the internet. Free, fast, global.',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Cloudflare Pages hosts static sites and edge functions for free, globally, fast. Connect your GitHub repo and it auto-deploys on every push to `main`. Set a custom domain and you\'re live.' },
          { type: 'code', lang: 'bash', caption: 'Connect and deploy', code: `# Install the Wrangler CLI
npm install -g wrangler
wrangler login

# Link your project to a Pages project
wrangler pages project create learnai

# Deploy the current directory
wrangler pages deploy . --project-name=learnai` },
          { type: 'code', lang: 'text', caption: 'Add a custom domain in the Cloudflare dashboard', code: `Pages > learnai > Custom domains > Set up
  learn.zerwiz.org  ->  CNAME  ->  learnai.pages.dev` },
          { type: 'tip', text: 'Push to `main`, get a deploy. Push to a branch, get a preview URL for that branch. Share preview URLs in PRs so reviewers see the actual change.' },
          { type: 'try', text: 'Deploy any static HTML to Cloudflare Pages and visit the URL. You\'re on the internet. That\'s deployment.' },
        ],
      },
      {
        id: 'l4',
        title: 'Auth & Going Public',
        blurb: 'Let people in. Keep the bad ones out.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Going public means handling users. The easy path: use a hosted auth provider (GitHub OAuth is perfect for a geek audience). The model call now needs to know WHO is asking, so you can rate-limit and personalize.' },
          { type: 'code', lang: 'typescript', caption: 'Gate a route behind a session', code: `// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // session.user.id is who's asking — log it, rate-limit on it
  const { messages } = await req.json();
  // ... call the model ...
}` },
          { type: 'warn', text: 'Add rate limiting before you go viral. One user with a script can burn your entire API budget in minutes. A simple per-user counter in Redis or even memory works.' },
          { type: 'try', text: 'Add a "login with GitHub" button. After login, show the user\'s avatar in the corner. That tiny loop is the foundation of every real product.' },
        ],
      },
    ],
  },
  {
    id: 't5',
    number: 5,
    slug: 'going-deeper',
    title: 'Going Deeper',
    tagline: 'The Rabbit Hole',
    description:
      'For the freaks who want more. Run models locally, fine-tune, build agents with tools and MCP, and ship an AI project that\'s entirely yours.',
    accent: 'rose',
    icon: 'FlaskConical',
    lessons: [
      {
        id: 'l1',
        title: 'Running Models Locally',
        blurb: 'Your own model. On your own machine. No API key.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'You don\'t need a cloud API to use AI. `llama.cpp` and `Ollama` run open models on your own laptop — fully offline, fully private, fully free. Great for tinkering, prototyping, and learning what\'s under the hood.' },
          { type: 'code', lang: 'bash', caption: 'Ollama — the friendly path', code: `# Install from ollama.com, then pull a model
ollama pull llama3.2

# Chat with it directly
ollama run llama3.2 "explain transformers like I'm five"

# Or hit its OpenAI-compatible endpoint on localhost:11434
curl http://localhost:11434/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model":"llama3.2","messages":[{"role":"user","content":"hi"}]}'` },
          { type: 'tip', text: 'Local models are slower and smaller than cloud ones, but they\'re yours. Point your existing OpenAI-compatible code at `http://localhost:11434/v1` and the same code works — zero changes.' },
          { type: 'try', text: 'Install Ollama, pull a model, and point the chat app from Track 3 at your local endpoint. Same code, local model.' },
        ],
      },
      {
        id: 'l2',
        title: 'Fine-Tuning & Prompt Engineering',
        blurb: 'Bend a model to your will — prompts first, weights later.',
        duration: '35 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Before you fine-tune, exhaust prompt engineering. Most "the model can\'t do X" problems are actually "my prompt is vague" problems. Fine-tuning is expensive, slow, and only worth it when you have thousands of examples and a clear failure mode.' },
          { type: 'code', lang: 'text', caption: 'Prompt engineering ladder — climb it before fine-tuning', code: `1. Be specific (role, task, format, constraints)
2. Show examples (few-shot)
3. Add a system prompt to lock behavior
4. Chain prompts (output of one feeds the next)
5. Give the model tools (let it call functions)
6. ONLY THEN: fine-tune on your data` },
          { type: 'code', lang: 'python', caption: 'Few-shot example — teach by showing', code: `messages = [
    {"role": "system", "content": "Classify sentiment as pos/neg/neu."},
    {"role": "user", "content": "this movie rocks"},
    {"role": "assistant", "content": "pos"},
    {"role": "user", "content": "worst day ever"},
    {"role": "assistant", "content": "neg"},
    {"role": "user", "content": "it is tuesday"},  # the real query
]` },
          { type: 'tip', text: 'Keep a "prompt library" — a file of prompts that worked, with notes on why. You will reuse them more than you expect.' },
          { type: 'try', text: 'Take a prompt that gives mediocre results. Rewrite it climbing the ladder above. Measure: did the output get better? Write down what changed.' },
        ],
      },
      {
        id: 'l3',
        title: 'Agents, Tools & MCP',
        blurb: 'Models that DO things, not just say things.',
        duration: '40 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'A chat model talks. An agent acts. Give a model tools — functions it can call (search the web, run code, read a file) — and it becomes an agent that can complete multi-step tasks on its own. MCP (Model Context Protocol) is the standard way to plug tools in.' },
          { type: 'code', lang: 'text', caption: 'The agent loop', code: `1. user: "find the latest npm release of next and summarize it"
2. model decides: call tool web_search("next npm latest release")
3. your code runs the tool, returns results
4. model reads results, decides: call tool fetch_url(url)
5. your code fetches, returns text
6. model now has enough: writes the summary
7. agent returns the summary to the user` },
          { type: 'code', lang: 'typescript', caption: 'A minimal tool definition', code: `const tools = [{
  type: "function",
  function: {
    name: "web_search",
    description: "Search the web for current information.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "search query" }
      },
      required: ["query"]
    }
  }
}];

// When the model calls web_search, YOU run it and hand back the result.
// The model never executes anything — your code does.` },
          { type: 'warn', text: 'Agents with tools can touch the real world. Sandbox them. A model that can run shell commands can `rm -rf` your home folder if you let it. Always confirm destructive actions with the human.' },
          { type: 'try', text: 'Build a one-tool agent: the model can call `get_weather(city)` which returns hardcoded data. Watch it decide to call the tool, read the result, and answer. That\'s an agent.' },
        ],
      },
      {
        id: 'l4',
        title: 'Build Your Own AI Project',
        blurb: 'The final boss. Ship something that\'s yours.',
        duration: '∞',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'You\'ve learned git, Python, APIs, prompting, deployment, agents. Now build something only you would build. Pick a problem you actually have. Solve it with a model. Ship it. Put it on the internet. Tell people.' },
          { type: 'h', text: 'A recipe for shipping' },
          { type: 'code', lang: 'text', code: `1. Pick a problem you personally have (you'll be motivated)
2. Write the dumbest version that could work (a script)
3. Run it. Break it. Fix it.
4. Wrap it in a tiny web page
5. Deploy to Cloudflare Pages
6. Add one feature users ask for
7. Repeat 6 forever` },
          { type: 'tip', text: 'Ship before you\'re ready. Embarrassing early versions beat perfect never-versions. A ugly thing on the internet teaches you more than a beautiful thing on your hard drive.' },
          { type: 'try', text: 'Right now, in one sentence, write down the AI project you want to build. Open a repo. Make the first commit. The rabbit hole starts here.' },
        ],
      },
    ],
  },
]

export function getTrack(trackId: string): Track | undefined {
  return tracks.find((t) => t.id === trackId)
}

export function getLesson(trackId: string, lessonId: string): { track: Track; lesson: Lesson } | undefined {
  const track = getTrack(trackId)
  if (!track) return undefined
  const lesson = track.lessons.find((l) => l.id === lessonId)
  if (!lesson) return undefined
  return { track, lesson }
}

export const trackStats = {
  tracks: tracks.length,
  lessons: tracks.reduce((n, t) => n + t.lessons.length, 0),
  hours: tracks.reduce(
    (n, t) => n + t.lessons.reduce((m, l) => m + (parseInt(l.duration) || 0), 0),
    0,
  ),
}
