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
  | { type: 'table'; header: string[]; rows: string[][]; caption?: string }
  | { type: 'warn'; text: string }
  | { type: 'try'; text: string }
  | { type: 'table'; header: string[]; rows: string[][]; caption?: string }

export type Access = 'free' | 'member'

export type Lesson = {
  id: string
  /** 'free' is readable by anyone forever. 'member' is the paid ground. */
  access: Access
  title: string
  blurb: string
  duration: string
  difficulty: Difficulty
  blocks: LessonBlock[]
}

export type Track = {
  id: string
  /** 'free' = this whole track is the minimal public ground. */
  access: Access
  number: number
  slug: string
  title: string
  tagline: string
  description: string
  accent: 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan'
  icon: string
  lessons: Lesson[]
}

// ── New tracks: Phase 0 port from the hoard (AIGF courses) ──

export const tracks: Track[] = [
  {
    id: 't1',
    access: 'member',
    number: 8,
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
        access: 'free',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
    access: 'member',
    number: 9,
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
        access: 'free',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
    access: 'member',
    number: 10,
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
        access: 'free',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
    access: 'member',
    number: 11,
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
        access: 'free',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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
    access: 'member',
    number: 12,
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
        access: 'free',
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
        access: 'member',
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
        access: 'member',
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
        access: 'member',
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

  // ─────────────────────────────────────────────────────────────
  // PORTED 2026-09-28 from the hoard — the six authored AIGF courses.
  // Source of truth: ~/Documents/ymirhome/svartalfaheim/whynotproductions/
  //   workspace/aigf/courses/  (CRS-000, CRS-100, CRS-300, CRS-200, CRS-050, CRS-400)
  // Every lesson title, blurb, tip, warn, try and code block below is converted
  // from that markdown. Nothing is invented; see each track's citation comment.
  // ─────────────────────────────────────────────────────────────

  // From: aigf/courses/course-your-machine-and-your-voice.md — CRS-000, "TRACK 0 — Your Machine"
  {
    id: 't0',
    access: 'free',
    number: 1,
    slug: 'your-machine',
    title: 'Your Machine',
    tagline: 'The Ground You Stand On',
    description:
      'Every step here was performed on a real machine and the outcome was recorded. Where something went wrong, the failure is written down too, because the failures are the lesson. You end with a working Linux machine with AI coding tools, a local model, and version control — from a bare stick of USB.',
    accent: 'cyan',
    icon: 'Cpu',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'Know Your Hardware',
        blurb: 'Before you download anything, know what you are driving.',
        duration: '20 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Before you download anything, know what you are driving.' },
          { type: 'p', text: 'CPU, RAM, GPU, and free disk. On Linux: `lscpu`, `free -h`, `lspci | grep -i vga`, `df -h`.' },
          { type: 'p', text: 'The single question that decides everything: **do you have an NVIDIA GPU?**' },
          { type: 'p', text: 'Yes → you can run Whisper on the GPU (~1.0 s for an 11-second clip) and local LLMs.' },
          { type: 'p', text: 'No (Intel/AMD) → everything still works, on the CPU. Whisper small.en on CPU is ~5.5 s for the same clip. That is fine. You will simply wait five seconds.' },
          { type: 'p', text: 'Decide your disk: a **full-disk install** wipes the machine; a **free-space install** sits alongside your existing OS. Choose honestly now.' },
          { type: 'try', text: 'Write down your GPU model and your free disk space. You will need both.' },
        ],
      },
      {
        id: 'l2',
        access: 'free',
        title: 'Write the USB',
        blurb: 'Download the ISO, verify it, and write it to the right stick.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Omarchy is Arch-based. You install it from a USB stick.' },
          { type: 'code', lang: 'text', code: `1. Download the ISO from <https://omarchy.org/>.
2. Verify it if a signature is offered — an unverified ISO is how machines die.
3. Write it:` },
          { type: 'code', lang: 'bash', caption: 'Write the image — Linux, or macOS/Windows', code: `# Linux
sudo dd if=omarchy-*.iso of=/dev/sdX bs=4M status=progress oflag=direct
# macOS / Windows
balenaEtcher` },
          { type: 'p', text: '**The `of=` line is the dangerous one.** `/dev/sdX` is not `/dev/sda` by habit — check it. Writing the image to your internal disk erases it.' },
          { type: 'warn', text: 'Use a **wired** keyboard or a 2.4 GHz dongle. Bluetooth keyboards cannot reach the full-disk-encryption prompt, and you will be locked out of your own machine with no one to blame but the dongle you did not buy.' },
          { type: 'try', text: '`lsblk` before you write. Write down which device is the USB. Then write.' },
        ],
      },
      {
        id: 'l3',
        access: 'free',
        title: 'BIOS, Then the Wizard',
        blurb: 'Disable Secure Boot, pick the disk, and get a desktop that boots in under a minute.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: '1. Reboot into BIOS (F12 / F2 / Del / Esc, depending on your machine).' },
          { type: 'p', text: '2. **Disable Secure Boot and TPM.** Required. If you skip this, the installer will fail later and the error will not explain why.' },
          { type: 'p', text: '3. Set the USB as the first boot device. Save and reboot.' },
          { type: 'p', text: 'The wizard then asks for: keyboard layout, hostname, username and password, disk selection, encryption. Answer honestly; the password is the only key to your encrypted disk.' },
          { type: 'h', text: 'What you got for it, and why it is worth it' },
          { type: 'p', text: 'Boots in under a minute.' },
          { type: 'p', text: 'Hyprland window manager (tiled, keyboard-driven, fast).' },
          { type: 'p', text: '**snapper** — automatic filesystem snapshots, so a bad update is a reboot away from working, not a reinstall.' },
          { type: 'try', text: 'Finish the install and boot to the desktop. Take a photo of the first-boot screen. You will want it later.' },
        ],
      },
      {
        id: 'l4',
        access: 'free',
        title: 'The Terminal Without Fear',
        blurb: 'Six commands that carry you the whole course.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Six commands that carry you the whole course:' },
          { type: 'table', header: ["Command", "What it does"], rows: [["pwd", "where am I"], ["ls", "what is here"], ["cd <dir>", "move"], ["mkdir <name>", "make a directory"], ["cat <file>", "read a file"], ["sudo", "run one command as the machine's administrator"]] },
          { type: 'p', text: '`pacman` is the package manager: `sudo pacman -Syu` updates the system.' },
          { type: 'p', text: '`Ctrl+C` stops anything running. It is the universal escape.' },
          { type: 'p', text: '`Tab` completes filenames. Use it.' },
          { type: 'try', text: 'Make a directory `~/scratch`, `cd` into it, make a file, `cat` it.' },
        ],
      },
      {
        id: 'l5',
        access: 'free',
        title: 'Git, GitHub, and Never Breaking Main Again',
        blurb: 'Git is how your work is remembered. Learn it before you write anything big.',
        duration: '35 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Git is how your work is remembered. Learn it before you write anything big.' },
          { type: 'code', lang: 'bash', caption: 'Your first repository, locally', code: `git config --global user.name  "Your Name"
git config --global user.email "you@example.com"

mkdir my-first-repo && cd my-first-repo
git init
echo "# my first repo" > README.md
git add README.md
git commit -m "first commit"` },
          { type: 'p', text: 'Create an empty repo on GitHub, then connect and push:' },
          { type: 'code', lang: 'bash', caption: 'Connect and push', code: `git remote add origin git@github.com:YOU/my-first-repo.git
git push -u origin main` },
          { type: 'h', text: 'SSH keys — GitHub will not take a password any more' },
          { type: 'code', lang: 'bash', caption: 'Make a key and prove it works', code: `ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub     # paste into GitHub → Settings → SSH keys
ssh -T git@github.com         # expect: "Hi USER!"` },
          { type: 'h', text: 'The branch law, learned once and never forgotten' },
          { type: 'p', text: '`main` is finished, working work. **Never type directly on it.**' },
          { type: 'p', text: 'Branch: `git switch -c my-feature`' },
          { type: 'p', text: 'Commit small, commit often: `git add <file>` — name the file, never `git add -A`.' },
          { type: 'p', text: 'Open a pull request; a human merges it.' },
          { type: 'try', text: 'Push your first repo to your own GitHub, from a branch, through a PR. Say the word.' },
        ],
      },
      {
        id: 'l6',
        access: 'free',
        title: 'Your AI Coding Tools',
        blurb: 'Three seats, all free or open, all running on your own machine.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Three seats, all free or open, all running on your own machine:' },
          { type: 'table', header: ["Tool", "What it is", "Install"], rows: [["opencode", "the terminal coding agent", "npm i -g opencode-ai (or your distro's package)"], ["pi", "a second agent seat, provider-agnostic", "npm i -g @earendil-works/pi-coding-agent"], ["Zed", "the editor — fast, keyboard-first", "from <https://zed.dev>"]] },
          { type: 'p', text: 'Also worth having:' },
          { type: 'p', text: '**lazygit** — a terminal UI for git. `sudo pacman -S lazygit`. It turns "which commit did I break?" from archaeology into a list you can click.' },
          { type: 'p', text: '**`fzf`** — fuzzy find for everything.' },
          { type: 'p', text: '**`btop`** — what is eating your machine, live.' },
          { type: 'try', text: 'Open Zed, create a folder, and let your agent build a small thing in it. Read every line it wrote. That last habit is the whole course.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-your-machine-and-your-voice.md — CRS-000, "TRACK 1 — Your Voice"
  {
    id: 't6',
    access: 'member',
    number: 2,
    slug: 'your-voice',
    title: 'Your Voice',
    tagline: 'The Machine Listens',
    description:
      'Push-to-talk dictation and spoken replies, on the GPU where possible. Because it is the difference between typing and talking, you make the machine listen and answer — and you learn where the GPU is worth it and where it is not.',
    accent: 'violet',
    icon: 'Mic',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'Why Voice',
        blurb: 'A 300-word request that took two minutes of typing takes fifteen seconds of talking.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Typing is precise and slow-talking. Dictation is fast and imprecise. You will use both. The win is that a 300-word request that took you two minutes of typing takes fifteen seconds of talking.' },
          { type: 'p', text: 'The stack is two engines and one switcher:' },
          { type: 'code', lang: 'text', code: `speech ──► Whisper (STT) ──► text ──► your AI tool ──► text ──► Piper (TTS) ──► speech` },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: 'Piper: The Machine Answers (TTS)',
        blurb: 'Piper belongs on the CPU. The lesson learned the hard way, with numbers.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'code', lang: 'bash', caption: 'Install Piper in its own venv', code: `python3 -m venv ~/.piper-venv
source ~/.piper-venv/bin/activate
pip install piper-tts` },
          { type: 'p', text: 'Voices live in `~/.local/share/piper-voices/`. Download the ones you like.' },
          { type: 'p', text: 'One sentence, out loud:' },
          { type: 'code', lang: 'bash', caption: 'Say one line', code: `echo "The machine speaks." | piper --model en_US-amy-medium --output_file -` },
          { type: 'h', text: 'The lesson the hard way — Piper belongs on the CPU' },
          { type: 'p', text: 'Creating a CUDA context costs about a second per process. Piper is one-shot: you send text, it makes audio, it exits. The GPU\'s tiny inference gain is eaten whole by that context cost. Measured on an RTX A5000:' },
          { type: 'table', header: ["Engine", "CPU", "GPU", "Winner"], rows: [["Whisper small.en (11 s clip)", "~5.5 s", "~1.0 s", "GPU, ~5×"], ["Piper (one sentence)", "2.0 s", "3.1 s", "CPU"]] },
          { type: 'p', text: 'So: Whisper on the GPU, Piper on the CPU. Flip it yourself with `voice piper gpu on` if you ever run a resident Piper server.' },
          { type: 'try', text: 'Say one sentence to the machine. It is weird the first ten times. Then it is not.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'Whisper: The Machine Listens (STT)',
        blurb: 'whisper.cpp — C++, fast, runs on the GPU. The CUDA flag is the whole trick.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'whisper.cpp — C++, fast, runs on the GPU.' },
          { type: 'code', lang: 'bash', caption: 'Build whisper.cpp with CUDA', code: `git clone https://github.com/ggerganov/whisper.cpp
cd whisper.cpp
cmake -B build -DGGML_CUDA=on     # the CUDA flag is the whole trick
cmake --build build --config Release -j` },
          { type: 'p', text: 'Models go in `~/whisper.cpp/models/`: `tiny.en`, `base.en`, `small.en` (default), and larger if you have the VRAM. Bigger is not always better for dictation — `small.en` is the sweet spot for English on a normal laptop.' },
          { type: 'p', text: 'Whisper writes to the clipboard or types the text out, so it lands wherever your cursor is — in the agent, in Zed, in a search box.' },
          { type: 'try', text: 'Dictate one paragraph into a text editor. Then dictate it again faster. Note where it breaks; that is your ceiling.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Hold to Talk',
        blurb: 'A daemon on evdev, bound to Alt+H, run as a user systemd service.',
        duration: '35 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A daemon that listens for a key, records while you hold it, transcribes on release.' },
          { type: 'p', text: '**Linux uses evdev**, not a desktop shortcut, because the key must work while any window has focus.' },
          { type: 'p', text: 'Bind it to **Alt+H** (hold) — a combo nothing else wants.' },
          { type: 'p', text: 'Run it as a **user systemd service** so it starts with your session:' },
          { type: 'code', lang: 'ini', caption: '~/.config/systemd/user/whisper-ptt.service', code: `[Unit]
Description=Hold-to-talk dictation
[Service]
ExecStart=%h/.local/bin/whisper-ptt.py
Restart=on-failure
[Install]
WantedBy=default.target` },
          { type: 'code', lang: 'bash', caption: 'Enable and start it', code: `systemctl --user enable --now whisper-ptt.service` },
          { type: 'warn', text: '**The one that bites:** the daemon must be in the **`input` group** to read the keyboard device. New installs are not, and hold-to-talk is simply silent — no error, no clue. Fix: `newgrp input` (or log out and back in), then `systemctl --user restart whisper-ptt.service`. If dictation produces nothing, this is why, nine times in ten.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'The Switcher',
        blurb: 'One command for the whole stack, so you never dig for a path again.',
        duration: '15 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'One command for the whole stack, so you never dig for a path again:' },
          { type: 'code', lang: 'bash', code: `voice show                    # current voice, model, GPU state, free VRAM
voice list                    # installed voices and models
voice amy | voice lessac      # switch the TTS voice
voice small.en | tiny.en      # switch the STT model
voice whisper gpu on|off
voice piper gpu on|off
voice test                    # say a test line` },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'Sharing the GPU With Your LLM',
        blurb: 'A local model can hold 12–15 GB of VRAM resident. They can fight. Here is the ward.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A local model server can hold 12–15 GB of VRAM resident. Your dictation wants a few hundred MB. They can fight.' },
          { type: 'p', text: 'The ward, as a small shared library every voice script calls:' },
          { type: 'p', text: '1. Ask `nvidia-smi` how much VRAM is free.' },
          { type: 'p', text: '2. If it is tight, call the model server\'s unload endpoint (key from a `chmod 600` env file — never inline) to free it.' },
          { type: 'p', text: '3. Use the GPU if **≥ 900 MiB** is free; otherwise fall back to CPU silently.' },
          { type: 'p', text: 'The model reloads itself on the next request, so the LLM is disturbed for seconds, not killed.' },
          { type: 'try', text: 'With a model resident, dictate. Notice that it still works. You have just made a 16 GB laptop behave like a workstation.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'Keybindings',
        blurb: 'Five keys in ~/.config/hypr/bindings.lua. The table is the test.',
        duration: '20 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'In `~/.config/hypr/bindings.lua`:' },
          { type: 'table', header: ["Key", "Action"], rows: [["Alt+H (hold)", "push-to-talk dictation"], ["F10", "read the selection aloud"], ["SUPER+CTRL+X", "toggle dictation on/off"], ["SUPER+CTRL+Y", "next TTS voice"], ["SUPER+SHIFT+T", "open the theme picker"]] },
          { type: 'p', text: 'Reload with `hyprctl reload`, then check for typos with `hyprctl configerrors`.' },
          { type: 'try', text: 'Bind all five. Reload. Press them until each one does what this table says — the table is the test.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-your-coding-desk.md — CRS-100
  {
    id: 't8',
    access: 'member',
    number: 3,
    slug: 'your-coding-desk',
    title: 'Your Coding Desk',
    tagline: 'The Flow',
    description:
      'A coding setup is not a list of programs. It is a flow: you read code, you run it, you ask an agent to change it, you look at what changed, you commit. Every tool below owns exactly one station in that flow. The beginner installs all of them and uses none. The journeyman uses the right one without thinking.',
    accent: 'emerald',
    icon: 'LayoutGrid',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'Pick Your Editor, Then Learn Two Keys',
        blurb: 'Zed\'s two AI surfaces — and the mistake everyone makes.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'The editor is where you spend your eyes. Two serious choices on Linux:' },
          { type: 'table', header: ["Editor", "Why", "Cost to learn"], rows: [["Zed", "fast, keyboard-first, built-in agent panel, project-wide search", "low — it is modern and opinionated"], ["Neovim", "you already live in the terminal, you want total control", "high — months, then forever"]] },
          { type: 'p', text: 'This course assumes **Zed**, because that is the desk this material is written from. Nothing here is *against* Neovim; the stations are the same.' },
          { type: 'h', text: 'Zed\'s two surfaces for AI — and the mistake everyone makes' },
          { type: 'code', lang: 'text', code: `language_models  ──►  agent.default_model  ──►  Zed's own Agent panel
agent_servers    ──►  external agents (opencode, …)` },
          { type: 'p', text: '`language_models` = the **providers and models** Zed\'s agent can call.' },
          { type: 'p', text: '`agent_servers` = **external agent programs** Zed can hand work to.' },
          { type: 'p', text: 'If you want Zed\'s agent to run a **local** model (Ollama, LM Studio, llama.cpp), the model must be in `language_models`. This is the part almost everyone gets wrong, and the symptom is always the same: the Agent panel shows no local model.' },
          { type: 'p', text: '**The lesson earned the hard way:** Zed\'s AI config is **strict and version-sensitive**. Get one field name wrong and the *entire* `language_models` block fails to load — silently. No error, no models, no clue.' },
          { type: 'warn', text: 'Change one field at a time, and check after each. If everything vanishes, you have one bad key. Undo the last change first.' },
          { type: 'h', text: 'The two keys to learn on day one' },
          { type: 'p', text: '`Ctrl+Shift+P` — the command palette. Everything Zed can do is in here, and searching it is faster than remembering shortcuts.' },
          { type: 'p', text: '`Ctrl+Shift+E` — the project file picker.' },
          { type: 'p', text: 'If you only learn two shortcuts, learn those two. The rest you will look up, and that is fine.' },
          { type: 'try', text: 'Open the command palette and run *Settings: Open Settings JSON*. Read the file. Config is just a file, and a file you have read is a file you can fix.' },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: 'The Terminal Is the Workbench',
        blurb: 'A multiplexer keeps them all in one window — and they survive closing it.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Your editor is one pane. Your real work spans three: editor, terminal, and the thing that is running. A **multiplexer** keeps them all in one window, and — this is the part that changes your life — **they survive closing the window**.' },
          { type: 'p', text: 'Start a session, detach, close the laptop, come back tomorrow, reattach. Nothing died.' },
          { type: 'table', header: ["Tool", "Use it when"], rows: [["tmux", "the classic; you already know it, or want no novelty"], ["herdr", "you also drive AI agents in panes and want their sessions to survive"], ["waveterm", "you want terminals, files and docs in one programmable surface"]] },
          { type: 'h', text: 'The layout of a real session' },
          { type: 'code', lang: 'text', code: `pane 1  editor
pane 2  shell           ← run the tests
pane 3  agent           ← ask for the change
pane 4  lazygit         ← see exactly what changed` },
          { type: 'p', text: 'Four panes, one glance, zero windows. That is the whole trick.' },
          { type: 'p', text: '**The keybinding law:** bind the multiplexer to a key that *opens and closes* the session. `ctrl-alt-h` here. A key you must *hold* is a key you will stop using by Thursday.' },
          { type: 'try', text: 'Start a session, make four panes, detach, close the terminal window entirely, then reattach. The panes are still there. That is the lesson.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'See What Changed (lazygit)',
        blurb: 'Your agent just rewrote eleven files. git diff will not tell you whether the change is right.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Your agent just rewrote eleven files. `git diff` will not tell you whether the change is *right*. lazygit will.' },
          { type: 'code', lang: 'bash', caption: 'Install and open lazygit', code: `sudo pacman -S lazygit     # or: brew install lazygit
lazygit` },
          { type: 'h', text: 'What it gives you, and why each matters' },
          { type: 'p', text: '**Status list** — every changed file, staged or not. Nothing is invisible.' },
          { type: 'p', text: '**Diff pane** — line-by-line, coloured, with the ability to *stage hunk by hunk*. You approve the change, not the file.' },
          { type: 'p', text: '**History** — every commit, with its message. Your memory of the project.' },
          { type: 'p', text: '**Undo/redo of commits** — the panic button, without panic.' },
          { type: 'h', text: 'The habit it installs' },
          { type: 'p', text: 'Never `git add -A`. Open lazygit, look, and stage the hunks you meant. A scratch file written thirty seconds ago gets swept in by `-A` and shipped. It has happened here. It cost a history rewrite.' },
          { type: 'try', text: 'Have an agent change three files. Open lazygit. Stage two hunks and leave the third. Commit. You have just done code review.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Find Things Instantly',
        blurb: 'Two tools that pay for themselves in the first hour.',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Two tools that pay for themselves in the first hour:' },
          { type: 'code', lang: 'bash', caption: 'Install the find-and-read shelf', code: `sudo pacman -S fzf fd ripgrep bat` },
          { type: 'p', text: '**`fd`** — find files, fast, and it ignores `.git` and `node_modules` for you.' },
          { type: 'p', text: '**`ripgrep` (`rg`)** — search *inside* files, fast.' },
          { type: 'p', text: '**`fzf`** — fuzzy-find anything: files, git branches, history, processes.' },
          { type: 'p', text: '**`bat`** — `cat` that shows line numbers and colours. When an error says "line 412", you want line numbers.' },
          { type: 'h', text: 'The one-liner worth memorising' },
          { type: 'code', lang: 'bash', code: `git branch -a | fzf | xargs git checkout` },
          { type: 'p', text: 'Tab-complete branch names forever. You will never fat-finger a branch again.' },
          { type: 'try', text: 'Find every file in a project mentioning a word, open the top result in your editor, without touching the mouse.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'Know What Your Machine Is Doing',
        blurb: 'Three lessons in three commands: btop, nvidia-smi, journalctl.',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'code', lang: 'bash', code: `btop            # CPU, RAM, disk, network, live
nvidia-smi      # GPU: what is resident, how much VRAM is free
systemctl --user status <service>   # is my service actually running
journalctl --user -u <service> -f  # watch its logs live` },
          { type: 'h', text: 'Three lessons in three commands' },
          { type: 'p', text: '1. **"It is slow" is almost always memory or VRAM, not CPU.** Look before you guess.' },
          { type: 'p', text: '2. **A service that starts with the machine is a `systemd --user` unit**, and it is restarted the same way you started it. This is how the hold-to-talk daemon in `CRS-000` works.' },
          { type: 'p', text: '3. **Read the logs before you change anything.** Half of all debugging is reading the thing\'s own account of itself.' },
          { type: 'try', text: 'Run `btop` while your agent works. Watch the CPU spike. You will learn to read a machine\'s mood in a week.' },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'Never Run an Agent as Root',
        blurb: 'Agents run as you, never as root. That pause is a feature.',
        duration: '20 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A coding agent **executes commands, edits files and installs packages.** Running it as root is handing it a loaded gun and pointing it at your whole filesystem. A hallucinated `rm -rf /` or `chmod -R 777 /` is not a bug you can undo.' },
          { type: 'p', text: 'It also breaks in a way that wastes an evening: as root, `~` becomes `/root`, so **all your config, API keys and session history vanish** and a second, empty config is created. You will spend an hour wondering where your settings went.' },
          { type: 'p', text: '**The law:** agents run as *you*, never as root. If a command needs root, the agent stops and asks you. That pause is a feature.' },
          { type: 'try', text: 'Notice that every service in this course runs as a *user* service, in your own session, with your own permissions. Nothing here needs root.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'The Whole Desk, Once',
        blurb: 'Your checklist before you call the desk finished.',
        duration: '20 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Your checklist before you call the desk finished:' },
          { type: 'code', lang: 'text', code: `[ ] editor installed, command palette muscle-memory built
[ ] AI providers configured in the editor's language_models block
[ ] multiplexer bound to one key; session survives a closed window
[ ] four-pane layout: editor / shell / agent / lazygit
[ ] fd, rg, fzf, bat installed
[ ] btop and nvidia-smi on muscle memory
[ ] agents run as your user, never root` },
          { type: 'try', text: 'Work a full day on this desk without opening a second application window. The day you do that is the day it became a desk.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-working-with-agents.md — CRS-300
  {
    id: 't10',
    access: 'member',
    number: 4,
    slug: 'working-with-coding-agents',
    title: 'Working With Coding Agents',
    tagline: 'The Colleague',
    description:
      'A coding agent is the fastest colleague you will ever have, and the least experienced. It never sleeps, never sulks, and will confidently do the wrong thing at 3 AM. Everything in this course is about the two things that make that manageable: how you ask, and how you check.',
    accent: 'amber',
    icon: 'Bot',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'What an Agent Actually Is',
        blurb: 'Strip away the marketing and it is a loop. That is the whole diagnostic.',
        duration: '20 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Strip away the marketing and it is a loop:' },
          { type: 'code', lang: 'text', code: `you give a goal  →  it reads files  →  it proposes a change  →  it runs a command
      ↑                                                                    ↓
      └──────────── it observes the result and decides again ───────────────┘` },
          { type: 'p', text: 'Everything else — the tools, the "skills", the "sub-agents" — is ways of improving one of those four steps. Knowing the loop is what turns a disappointing agent into a diagnosable one: *bad goal? bad context? bad tools? bad feedback?*' },
          { type: 'p', text: 'That question has an answer every single time. That is the whole diagnostic.' },
          { type: 'try', text: 'Next time an agent disappoints you, do not rerun the prompt. Ask which of the four steps failed. It is almost never the last one.' },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: 'The Brief: Six Parts, Every Time',
        blurb: 'A good request is not longer. It is complete. Six parts, in this order.',
        duration: '35 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A good request is not longer. It is **complete**. Six parts, in this order:' },
          { type: 'p', text: '1. **The area** — where the work lives (`src/components/site/hero.tsx`).' },
          { type: 'p', text: '2. **The goal** — what must be true when you are done.' },
          { type: 'p', text: '3. **The constraints** — what must *not* change. (Never rewrite what you did not ask about. Never hardcode a value. Never store a secret.)' },
          { type: 'p', text: '4. **The context you have** — the error text, the screenshot, the log line.' },
          { type: 'p', text: '5. **The deliverable** — the file, the PR, the report. Something tangible.' },
          { type: 'p', text: '6. **The check** — the exact command or page that proves it worked.' },
          { type: 'h', text: 'Compare' },
          { type: 'p', text: '✗ *"fix the login page"*' },
          { type: 'p', text: '✓ *"`src/components/pages/login-content.tsx` — the sign-in form must validate the email before submitting. Don\'t touch the visual design. The error is `TypeError: Cannot read properties of undefined (reading \'email\')`, thrown on submit in Chrome. Deliver: the fixed file plus a PR. Verify: submit an invalid email and confirm the message appears."*' },
          { type: 'p', text: 'The second one can be handed to a stranger — or a sub-agent — with no further conversation. That is the test of a brief.' },
          { type: 'h', text: 'The three sentences that improve almost every request' },
          { type: 'p', text: '*"Read these files first."* — stops it guessing at your code.' },
          { type: 'p', text: '*"Don\'t change anything outside the area."* — stops the collateral damage.' },
          { type: 'p', text: '*"Show me what you changed and how to verify it."* — stops the uncheckable.' },
          { type: 'try', text: 'Take your last request to an agent. Add parts 1, 2, 5 and 6. Compare the result. You have just measured the value of a brief.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'Context Is the Fuel',
        blurb: 'A hallucinated fact is nearly always a missing fact. Ask "what did I not give it?"',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'An agent cannot read what you did not give it. Three ways to feed it:' },
          { type: 'p', text: '1. **Name the file.** `src/lib/course-data.ts` beats "the course data thing".' },
          { type: 'p', text: '2. **Paste the error, whole.** Not a paraphrase. The stack trace, the exact wording. Half of all failures are a mistyped word in an error message.' },
          { type: 'p', text: '3. **Show the shape, not the world.** A small example of the input and the expected output beats four hundred lines of context.' },
          { type: 'p', text: '**The lesson learned here the hard way:** a hallucinated fact is nearly always a *missing fact*. The agent did not invent the API out of nothing — you never told it the API, and it filled the gap with something plausible. When an agent is confidently wrong, the first question is not "why is it stupid" but **"what did I not give it?"**' },
          { type: 'try', text: 'When an agent is wrong, before you correct it, list what you assumed it knew. There will be a gap. There always is.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Loop With It, Don\'t Deleg Blindly',
        blurb: 'The mid-course correction is the cheapest correction in the world.',
        duration: '25 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'The wrong way: give a huge task, walk away, come back to a diff you have to read from scratch. That is not delegation — that is gambling with your afternoon.' },
          { type: 'p', text: 'The right way, in rounds:' },
          { type: 'code', lang: 'text', code: `you:     the goal + the area
agent:   reads, proposes, changes, runs the check
you:     look at the diff, correct the direction early
agent:   finishes, shows the check output
you:     verify independently, then merge` },
          { type: 'p', text: '**The mid-course correction is the cheapest correction in the world.** Ten minutes of steering after round one beats an hour of reading someone else\'s architecture after round five.' },
          { type: 'p', text: '**The standing order on a real task:** *"Read the area first and tell me your plan before you change anything."* One sentence of plan costs you nothing and catches a wrong assumption before it becomes nine files.' },
          { type: 'try', text: 'On your next real task, ask for the plan first. Compare the result.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'Never Trust, Verify',
        blurb: 'The agent will tell you it worked. It may be lying, and it does not know it.',
        duration: '35 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'The agent will tell you it worked. It may be lying, and it does not know it.' },
          { type: 'h', text: 'Your verification ladder — climb it every time' },
          { type: 'p', text: '1. **Did it run the check?** Read the actual output. Not "it passed" — the lines.' },
          { type: 'p', text: '2. **Is the build clean?** Build, lint, types. All three, every time.' },
          { type: 'p', text: '3. **Does the page work?** Open it. Click it. A green test suite and a broken page are both possible.' },
          { type: 'p', text: '4. **Is the diff the size you expected?** A one-line fix that changed nine files is a finding. Read every one.' },
          { type: 'p', text: '5. **Does it still work on the other case?** The thing it broke that it did not mention is the normal outcome.' },
          { type: 'h', text: 'The three laws that follow, learned here' },
          { type: 'p', text: '*An agent that runs no check has not finished.* "I made the change" is not "it works".' },
          { type: 'p', text: '*Never merge on the agent\'s word.* Verification is not optional and it is never delegated — not even to a cleverer agent. If you cannot verify it, it is not done.' },
          { type: 'p', text: '*The human seals the merge.* Always. That is not distrust; it is the last point where a human judgement is worth more than a machine\'s.' },
          { type: 'try', text: 'Take a change an agent just made and verify it with the *other* case — the input it was not given. See what it forgot.' },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'Skills: Teaching the Machine Your Ways',
        blurb: 'A written procedure the agent loads when the task calls for it. The law section is why.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A **skill** is a written procedure the agent loads when the task calls for it — your way of deploying, your house style, your release ritual. Once written, it is not knowledge you must repeat; it is a door the agent opens by itself.' },
          { type: 'p', text: 'A good skill is short and has four parts:' },
          { type: 'code', lang: 'text', code: `name        what it is called
when        the trigger — when should the agent reach for this?
steps       what to do, in order, as commands
the law      what must never happen (and why)` },
          { type: 'p', text: '**The law section is what makes a skill worth writing.** "Never push to `main`" prevents more damage than three steps of advice.' },
          { type: 'p', text: '**Where they live, and why it matters:** a skill is a file, so it is reviewable, diffable, and versioned with the code. A habit you had to explain aloud to a colleague is a skill you have not written yet.' },
          { type: 'try', text: 'Find a task you explained to an agent more than once. Write it as a skill this week. Watch the second time.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'Tools: Teaching the Machine Your Hands',
        blurb: 'Adding every tool available is not power; it is noise. Four good tools beat twenty.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'A **tool** is a capability the agent does not have by default — a shell, a database, a search, an API. If the agent cannot see it, it cannot use it, and it will guess instead.' },
          { type: 'h', text: 'The classes you will meet' },
          { type: 'p', text: '**Shell / file tools** — read, write, run. The baseline. Enough for most work.' },
          { type: 'p', text: '**MCP servers** — a standard way to hand an agent a capability it lacks: tickets, a database, issue trackers, your own services. Same tool, many agents.' },
          { type: 'p', text: '**API keys** — the price of admission. A key is a secret: it lives in the environment, never in the repository, never in a prompt.' },
          { type: 'p', text: '**Web / fetch** — reading a live page beats recalling it from memory.' },
          { type: 'h', text: 'The order to add them, and it is the right order' },
          { type: 'p', text: '1. Nothing extra. Get good at asking.' },
          { type: 'p', text: '2. Shell and files. Most work is covered.' },
          { type: 'p', text: '3. One MCP server for the thing you do every day.' },
          { type: 'p', text: '4. Everything else, only when a real blocked task names the tool you lack.' },
          { type: 'p', text: '**Adding every tool available is not power; it is noise.** An agent with twenty tools tries the wrong one. Four good tools beat twenty.' },
          { type: 'try', text: 'List the tools your agent has. For each, ask: *when does this help?* If you cannot answer in a sentence, the tool is decoration.' },
        ],
      },
      {
        id: 'l8',
        access: 'member',
        title: 'Sub-Agents: The Shape of the Work Decides',
        blurb: 'Parallel work goes into separate worktrees on separate branches. Always.',
        duration: '30 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Sometimes one agent is the wrong number. Use more when the work is **parallel or isolated**; use one when it is **tight and coherent**.' },
          { type: 'table', header: ["The work", "The shape", "The right call"], rows: [["one bug, one file", "tight", "one agent, now"], ["four independent pages", "parallel", "four sub-agents, isolated worktrees"], ["a research question", "read-only", "one sub-agent, no writes"], ["a refactor across 30 files", "coherent", "one agent, staged, with checks"]] },
          { type: 'p', text: '**The isolation law:** parallel work goes into **separate worktrees on separate branches.** Two agents in the same directory is not teamwork; it is a race, and the loser is whichever file got overwritten. `git worktree add` costs one line and prevents a class of disaster entirely.' },
          { type: 'p', text: '**The law for the dispatcher:** a sub-agent inherits the brief and *nothing else*. It cannot see the conversation you had. Whatever it does not know, it will invent. This is why Lesson 300.2 comes first.' },
          { type: 'try', text: 'Take a four-part task. Give each part its own worktree and its own brief. Merge them in order. The four changes never touched.' },
        ],
      },
      {
        id: 'l9',
        access: 'member',
        title: 'The Working Agreement',
        blurb: 'Everything above, as ten lines you can keep above your desk.',
        duration: '20 min',
        difficulty: 'intermediate',
        blocks: [
          { type: 'p', text: 'Everything above, as ten lines you can keep above your desk:' },
          { type: 'code', lang: 'text', code: `1.  The brief has six parts. All six.
2.  Read first, plan out loud, then change.
3.  Smallest area, named files, nothing else touched.
4.  Never hardcode a value; never commit a secret.
5.  The agent must run the check; read the real output.
6.  You verify yourself. The ladder is not optional.
7.  Explain it once → write it as a skill.
8.  Parallel work gets its own worktree.
9.  Never \`git add -A\`. Never merge to main. Never force.
10. The human seals the merge. Always.` },
          { type: 'try', text: 'Print it. Put it where you will read it every day for a month. In thirty days you will not need it. That is the point.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-github-and-shipping.md — CRS-200
  {
    id: 't9',
    access: 'member',
    number: 5,
    slug: 'github-and-getting-code-shipped',
    title: 'GitHub and Getting Code Shipped',
    tagline: 'The Delivery Chain',
    description:
      'Writing code is half the job. The other half is: it lives somewhere, someone looked at it, and it reached production without anyone typing a scary word. That chain is commit → branch → push → pull request → review → merge → deploy. Learn it once and you can ship anything.',
    accent: 'rose',
    icon: 'GitPullRequest',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'The Account and the Key',
        blurb: 'One account, yours, for you. An SSH key, so you never type a password.',
        duration: '20 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'One account, yours, for you. Never a shared login, never a shared token.' },
          { type: 'p', text: 'Set your identity **per machine**, so commits are signed by you:' },
          { type: 'code', lang: 'bash', code: `git config --global user.name  "Your Name"
git config --global user.email "you@example.com"` },
          { type: 'p', text: 'An **SSH key**, so you never type a password:' },
          { type: 'code', lang: 'bash', caption: 'Make a key and paste it into GitHub', code: `ssh-keygen -t ed25519 -C "you@example.com"     # accept the default path
cat ~/.ssh/id_ed25519.pub` },
          { type: 'p', text: 'Paste that line into GitHub → Settings → SSH and GPG keys.' },
          { type: 'code', lang: 'bash', caption: 'Prove it', code: `ssh -T git@github.com        # "Hi <you>! You've successfully authenticated"` },
          { type: 'try', text: '`ssh -T git@github.com` and read the greeting. That is the whole test.' },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: '`gh`: GitHub From Your Keyboard',
        blurb: 'The web UI is for browsing. `gh` is for working. `gh pr create` is the skill.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'The web UI is for browsing. `gh` is for working.' },
          { type: 'code', lang: 'bash', code: `gh auth login
gh repo create my-project --private --push
gh pr create --title "Add the kanban" --body "why, and what to check"
gh pr status
gh pr checkout 42          # pull someone else's PR down and run it
gh pr merge 42
gh repo view --web         # open in the browser` },
          { type: 'p', text: '**`gh pr create` is the skill.** A good body answers three questions and nothing else:' },
          { type: 'p', text: '1. **What** changed — one sentence.' },
          { type: 'p', text: '2. **Why** — the problem it solves.' },
          { type: 'p', text: '3. **How to verify it** — the exact commands or the exact page to look at.' },
          { type: 'p', text: 'If you cannot write (3), the change is not finished. You do not know yet whether it works.' },
          { type: 'try', text: 'Take a repo of yours, make the smallest possible change, and open a real PR against yourself. Do it once for practice.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'The Branch Law',
        blurb: '`main` is finished, working work. You never type on it.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'This is the one rule of the whole course:' },
          { type: 'p', text: '**`main` is finished, working work. You never type on it.**' },
          { type: 'code', lang: 'bash', caption: 'The whole chain in five commands', code: `git switch main && git pull
git switch -c fix-kanban-drag
# ... work ...
git add src/components/kanban.tsx
git commit -m "fix: kanban drag loses position on drop"
git push -u origin fix-kanban-drag
gh pr create` },
          { type: 'p', text: '**Why the law, learned the expensive way:** a local merge on a verbal "yes" is a decision, not a delivery. It bypasses the review surface entirely, so there is nothing for anyone to look at afterwards — and when it breaks, there is no record of why. Every change leaves by **pull request**, or it did not leave.' },
          { type: 'h', text: 'The commit-message shape' },
          { type: 'code', lang: 'text', code: `type: what changed

why this, in a sentence` },
          { type: 'p', text: 'Types: `feat`, `fix`, `docs`, `refactor`, `chore`. Small commits, each one runnable. A commit that fixes three unrelated things is three commits.' },
          { type: 'warn', text: 'Stage **named files**. Never `git add -A`. A scratch file written seconds earlier — a backup, a decrypted copy, a log — gets swept into a commit and pushed. It has happened, and the repair was a history rewrite.' },
          { type: 'try', text: 'Branch, commit, push, open the PR, read your own body as if you were the reviewer. Can you verify it from the PR alone? If not, go fix the PR.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Pull Requests Are the Delivery',
        blurb: 'A PR is not bureaucracy. It is the artifact that review lives in.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A PR is not bureaucracy. It is the artifact that:' },
          { type: 'p', text: 'shows exactly what changed, line by line;' },
          { type: 'p', text: 'records why, in words, permanently;' },
          { type: 'p', text: 'runs the checks (build, lint, tests) on *every* push;' },
          { type: 'p', text: 'gives review a place to live;' },
          { type: 'p', text: 'is the only thing that can be merged.' },
          { type: 'p', text: '**Review as a reader, not a formatter.** Two questions that catch most bugs:' },
          { type: 'p', text: '1. *"What could break?"* — the failure nobody mentioned.' },
          { type: 'p', text: '2. *"How do I know this works?"* — the verification, right there.' },
          { type: 'try', text: 'Open a PR on your own repo, then review it as if someone else wrote it. Find one thing to improve. That is a real skill, and this is how you get it.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'Secrets Never Go In The Repo',
        blurb: 'A secret is referenced by path, never written down. Prevention is the whole lesson.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'The rule is short and absolute:' },
          { type: 'p', text: '**A secret is referenced by path, never written down.**' },
          { type: 'p', text: 'Private values live in a `.env` file that is **git-ignored**, on the server, never in the repository.' },
          { type: 'p', text: 'Your repo ships `.env.example` — the **keys**, with no values:' },
          { type: 'code', lang: 'text', code: `DATABASE_URL=
GITHUB_TOKEN=` },
          { type: 'p', text: 'Add `.env` and any real secret file to `.gitignore` **before** the first commit, not after.' },
          { type: 'p', text: '**A secret that reaches a public repository is already leaked**, even if you delete it in the next commit — it is in the history forever. Rotating the credential is the only real repair. Prevention is the whole lesson.' },
          { type: 'p', text: '**Third-party checks are the ward you cannot forget:** a pre-commit hook and a CI step that *refuse* a commit containing a key. A human forgets at 2 AM; a script does not.' },
          { type: 'try', text: 'Write your `.gitignore` first, add `.env`, then create a throwaway `.env` with a fake value and confirm the hook refuses it.' },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'Deploy: The Same Chain, One Time More',
        blurb: 'Build, push, merge, release, verify, record. Six steps, every time.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Deployment is the PR chain, repeated:' },
          { type: 'p', text: '1. **Build** — the exact command that runs in production runs on your machine first. If it does not build locally, it will not build there.' },
          { type: 'p', text: '2. **Push** — to the branch, through the PR.' },
          { type: 'p', text: '3. **Merge** — a human merges. Never a force-push to the working branch.' },
          { type: 'p', text: '4. **Release** — deploy the merged commit, not your laptop.' },
          { type: 'p', text: '5. **Verify** — open the real site. Not localhost. The real one.' },
          { type: 'p', text: '6. **Record** — one dated line: what changed, why, which files.' },
          { type: 'p', text: '**The unit law:** a service is a **service manager unit**, not a command you remember to type. It starts on boot, it restarts when it crashes, and it is stopped the same way every time. `systemctl status <unit>` is your first diagnostic, always.' },
          { type: 'warn', text: 'Never stop a service you did not start. On a shared server, the other services are other people\'s day.' },
          { type: 'try', text: 'Describe your deploy in one line — build, push, merge, restart, verify. If any of the five words is missing, that is your next lesson.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'When It Breaks in Production',
        blurb: 'Read the logs first. Roll back before you debug. Write it down.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: '1. **Read the logs first.** Always first. The thing usually knows.' },
          { type: 'p', text: '2. **Roll back before you debug.** A previous working version beats an interesting broken one, every time.' },
          { type: 'p', text: '3. **Then diagnose.** A short, written hunt beats forty minutes of guessing.' },
          { type: 'p', text: '4. **Write down what happened** — one dated entry, append-only. The next person (often you, at 2 AM) is the one who needs it.' },
          { type: 'p', text: 'A record is not paperwork. It is the difference between fixing a bug and fixing it *forever*.' },
          { type: 'try', text: 'Break something on purpose on a throwaway service. Roll it back. Write the four lines. That is your first runbook.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-your-first-project.md — CRS-050
  {
    id: 't7',
    access: 'member',
    number: 6,
    slug: 'your-first-real-project',
    title: 'Your First Real Project',
    tagline: 'From Folder to Repository',
    description:
      'Everything so far was about your machine. This is about your work. The beginner\'s project is code in a folder. The journeyman\'s project is a repository with a shape: a written contract at the root, a plan on the shelf, an architecture nobody has to guess, a changelog that cannot lie, an agent that knows the house rules, and a registry that says where it lives and how it ships.',
    accent: 'cyan',
    icon: 'FolderGit2',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'The Empty Folder, Named Properly',
        blurb: 'The five things that must exist on day one. `.gitignore` before the first commit, not after.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A project starts before it has code. Start it right and the code writes itself.' },
          { type: 'p', text: '**One folder, named for the project — never `new-project`, never `test2`.** A name you will not be embarrassed by in a URL two years from now is worth ten minutes of thought.' },
          { type: 'h', text: 'The five things that must exist on day one' },
          { type: 'code', lang: 'text', code: `my-project/
├── AGENTS.md          ← the contract
├── README.md          ← what this is, how to run it
├── docs/              ← plans, decisions, fixes
├── .gitignore         ← before the first commit, not after
└── .env.example       ← the keys, with no values` },
          { type: 'p', text: 'That is the skeleton. Everything else is a consequence of it.' },
          { type: 'h', text: '`.gitignore`, on day one, not after the accident' },
          { type: 'code', lang: 'gitignore', code: `node_modules/
.next/
dist/
build/
.env
.env.local
*.log
.DS_Store` },
          { type: 'warn', text: 'Write `.gitignore` and `.env.example` **before the first commit**. Adding them afterwards requires history surgery to undo a leaked key, and a leaked key is leaked forever. Prevention is one minute; the repair is an afternoon and a rotation.' },
          { type: 'h', text: 'Initialize properly, on a branch, from the start' },
          { type: 'code', lang: 'bash', code: `mkdir my-project && cd my-project
git init
git remote add origin git@github.com:YOU/my-project.git
git commit --allow-empty -m "chore: start the project"` },
          { type: 'try', text: 'Create the folder, write `.gitignore`, and make the empty first commit. That is a real project. Everything else is detail.' },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: '`AGENTS.md`: The Contract at the Root',
        blurb: 'The single highest-value file in the repository, and the one beginners skip.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'The single highest-value file in the repository, and the one beginners skip.' },
          { type: 'p', text: '`AGENTS.md` is read **by every agent that touches this code, every time**. It is the difference between an agent that follows your architecture and one that invents its own. It is also the fastest onboarding document a human will ever read.' },
          { type: 'h', text: 'Six sections, and only six' },
          { type: 'code', lang: 'markdown', code: `# <Project Name>

## What this is
One paragraph. A newcomer who knows nothing must now know what this thing does.

## The first law
The one rule that is never broken. One sentence, unarguable.

## Architecture
Where things live, and why. A map, not an essay.

## Commands
| Task | Command |
|---|---|
| install | \`npm ci\` |
| test    | \`npm test\` |
| build   | \`npm run build\` |
| lint    | \`npm run lint\` |

## The laws
Numbered, short, checkable. Not philosophy — rules a reviewer can point at.` },
          { type: 'h', text: 'What makes it work rather than merely exist' },
          { type: 'p', text: '**It is short.** A contract nobody reads is a contract that binds no one. Ten lines beats ten pages.' },
          { type: 'p', text: '**It is specific.** "Write good code" is decoration. "Never commit a secret; reference it by path" is a rule you can point at a diff.' },
          { type: 'p', text: '**It is a first draft.** Write it on day one with three sentences. Rewrite it when the project teaches you something. It is a living file, not a monument.' },
          { type: 'p', text: '**The naming law, if you want an agent to work *well* rather than merely correctly:** name your directories, components and processes for the thing they actually do. A file called `auth-service` teaches an agent more in one glance than a page of prose — and in six months it will teach *you*, at 2 AM, more than you remember writing.' },
          { type: 'try', text: 'Write a ten-line `AGENTS.md` for your new project. Then check: could a stranger follow the Commands table and get a working build? If not, the table is wrong.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'The Shape of a Real Codebase',
        blurb: 'There is no single truth, but there is a shape that has survived. Three rules keep it from rotting.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'There is no single truth, but there is a shape that has survived. Learn it, then bend it:' },
          { type: 'code', lang: 'text', code: `my-project/
├── AGENTS.md
├── README.md
├── docs/                     ← plans, decisions, fixes
├── src/                      ← the code
│   ├── app/  or  pages/      ← entry points and routes
│   ├── components/           ← UI, grouped by feature
│   ├── lib/                  ← pure logic, no UI, no I/O surprises
│   └── api/                  ← the seams where the outside world enters
├── tests/                    ← mirrors src/ exactly
├── scripts/                  ← things a human or an agent runs by name
└── .agents/ or .claude/      ← agent-facing: skills, plans, sub-agents` },
          { type: 'h', text: 'Three rules that keep this from rotting' },
          { type: 'p', text: '1. **`lib/` is pure.** No UI imports, no network calls hidden in a helper. The moment `lib/` starts reaching out, nothing is testable and nothing is safe.' },
          { type: 'p', text: '2. **`tests/` mirrors `src/`.** If the code is `src/lib/parse.ts`, the test is `tests/lib/parse.test.ts`. When they drift, coverage lies to you.' },
          { type: 'p', text: '3. **Group by feature, not by type.** `components/checkout/` beats `components/` full of unrelated files. Related code lives together, or gets misunderstood together.' },
          { type: 'p', text: '**The `.agents/` directory — where the machine\'s craft lives.** Skills (written procedures), sub-agent definitions (a named specialist with a brief), plans (written thinking). This is the part of a project the agents read, and it is usually the part beginners leave empty.' },
          { type: 'try', text: 'Sketch your project\'s shape on paper before writing a line of code. Ten minutes of structure saves a week of refactoring.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Plans on the Shelf',
        blurb: 'Plans are append-only. A correction is a new entry that cites the old one. Never rewrite, never delete.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A plan is a **written answer to "what are we doing and why"**, saved where the next reader will find it.' },
          { type: 'p', text: 'The rule, and it is the one that changes everything:' },
          { type: 'p', text: '**Plans are append-only. A correction is a new entry that cites the old one. Never rewrite, never delete.**' },
          { type: 'p', text: 'When the plan changes — and it will — you add a dated section. The old thinking stays visible, because *why you changed your mind* is the most valuable sentence in any engineering record.' },
          { type: 'code', lang: 'markdown', code: `# Plan 07 — Real course data

**Status:** complete
**Date:** 2026-09-28

## Decision
The home page reads courses from the LearnAI API, server-side, at build time.

## 2026-09-28 — correction
We first planned to vendor the JSON by hand. Wrong: it went stale in four days.
Superseded by the webhook + daily revalidate approach, which is the current
plan above.` },
          { type: 'p', text: '**The test:** six months from now, can a reader see what you tried, what you chose, and why you changed it? If yes, the plan worked.' },
          { type: 'try', text: 'Write the plan for your project\'s first real feature *before* you build it. Two pages. Date it. You will not build the thing twice.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'Decisions and Architecture, Written Down',
        blurb: 'Architecture is not what you built. It is what you promised, so that the next person knows the rules.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Plans say *what*. Two more records say *why not*.' },
          { type: 'h', text: 'Architecture — one document, a map a newcomer can hold in their head' },
          { type: 'code', lang: 'markdown', code: `# Architecture

## The shape
A Next.js app. Pages in src/app, pure logic in src/lib, UI in src/components.

## The data
SQLite via Prisma. Schema in prisma/schema.prisma. One source of truth.

## The boundaries
- lib/ is pure: no UI, no network.
- All outside data enters through src/api or src/lib/db.ts. Nowhere else.

## The choices we made
| Decision | Chose | Over | Because |
|---|---|---|---|
| Rendering | server components | client-everything | faster, less JS |
| Data | SQLite | Postgres | one file, no server to run |` },
          { type: 'p', text: '**Decision records** — one file per decision that could reasonably have gone the other way. The table above is the same idea, compressed. Keep whichever fits.' },
          { type: 'p', text: '**Architecture is not what you built. It is what you promised, so that the next person knows the rules they must not break.**' },
          { type: 'try', text: 'Draw your project\'s architecture in one page, with a *because* next to every box. A box without a reason is a box someone will "improve" someday.' },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'The Changelog Is Append-Only, and So Is Everything',
        blurb: 'Append. Date every entry. Never rewrite, never delete, never "clean up" a record.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'A project\'s memory is the most valuable thing in it, and memory is destroyed by two habits: rewriting and tidying.' },
          { type: 'p', text: '**The law, without exception:**' },
          { type: 'p', text: '**Append. Date every entry. Never rewrite, never delete, never "clean up" a record. To correct something, add a new dated entry that cites the old one.**' },
          { type: 'code', lang: 'markdown', code: `## 2026-09-28 — real course data on the home page

**What:** the Academy section now renders the 5 LearnAI tracks server-side.
**Why:** the previous cards were invented and did not match any real course.
**Files:** src/components/site/academy.tsx, content/tracks.json, docs/fixes/academy/2026-09-28-real-tracks.md
**Verify:** bun run build && open /` },
          { type: 'p', text: 'Each entry answers: **what, why, which files, how to verify.** A future reader can act on it without you.' },
          { type: 'p', text: '**A fix note is a smaller, sharper thing** — one file per fix, in `docs/fixes/<component>/`, never rewritten, saying what broke, why, and what changed. When the same bug comes back a year later, that file is the reason it takes ten minutes to fix instead of two days.' },
          { type: 'p', text: '**A note is a load-bearing artifact, not clutter.** Every migration, clone and backup **must carry them all.** A move that drops a record has not saved space — it has lost history.' },
          { type: 'try', text: 'Add today\'s first entry to your project\'s changelog. One line of what and why is enough. Do it now, not "later" — later is where changelogs die.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'The README and the Registry',
        blurb: 'A registry names the key and never the token. A tool must never guess a remote.',
        duration: '25 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: '**`README.md`** answers, in order: what this is · why it exists · how to install and run it · how to test it · where to get help. Five blocks. A newcomer should be running it inside five minutes.' },
          { type: 'h', text: 'The project registry — where does this thing live?' },
          { type: 'p', text: 'One entry per project, in one place, so no tool has to guess:' },
          { type: 'code', lang: 'yaml', code: `my-project:
  path: ~/CodeP/my-project
  git:
    host: github.com
    owner: YOU
    repo: my-project
    remote: git@github.com:YOU/my-project.git
    default_branch: main
    auth: reference-only      # a key name, never a value` },
          { type: 'p', text: '**`auth: reference-only` is the law again:** a registry names the *key* (`GITHUB_TOKEN`) and never the token. This is what lets your deploy tooling, your agent fleet and your worktree tool all read one file safely.' },
          { type: 'p', text: '**Corollary:** a tool must never *guess* a remote. It reads the registry. If the project is not in the registry, the tool stops and asks.' },
          { type: 'try', text: 'Add your project to a registry file with its `git{}` block. Watch how much manual error that one entry deletes.' },
        ],
      },
      {
        id: 'l8',
        access: 'member',
        title: 'Giving the Project Its Agents and Skills',
        blurb: 'An agent gets a narrow area, a clear deliverable, and a hard boundary.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'Now the project can teach.' },
          { type: 'p', text: '**A skill is a procedure the agent loads when the job calls for it.** Four parts, always:' },
          { type: 'code', lang: 'text', code: `name        what it is
when        the trigger — when should the agent reach for this?
steps       what to do, in order, as real commands
the law      what must never happen, and why` },
          { type: 'p', text: 'The **law** section is what makes it worth writing. "Never push to `main`" prevents more damage than any step of advice ever could.' },
          { type: 'p', text: '**An agent definition is a named specialist with a brief.** In a real project you will want two or three, not thirty:' },
          { type: 'table', header: ["The agent", "The brief"], rows: [["the smith", "builds features in isolation, opens PRs, never merges"], ["the reviewer", "reads the diff, finds what breaks, never edits"], ["the keeper", "updates docs, changelog and registry; writes no code"]] },
          { type: 'p', text: '**The rule that keeps a small fleet sane:** an agent gets a **narrow area, a clear deliverable, and a hard boundary.** An agent with "fix the site" has no plan. An agent with "the Academy section must show real track data; do not touch the hero; deliver a PR" finishes in one round.' },
          { type: 'p', text: '**Work in isolation.** Complex work goes to a separate **worktree** on its own branch, so a failure can never reach the working tree:' },
          { type: 'code', lang: 'bash', code: `git worktree add ../my-project-feature -b feature/real-tracks` },
          { type: 'h', text: 'The loop, complete and permanent' },
          { type: 'code', lang: 'text', code: `plan written  →  agent builds in a worktree  →  agent opens a PR
     →  a human reviews  →  a human merges  →  changelog entry appended` },
          { type: 'p', text: 'Every stage leaves a record. Every stage has a gate. Every merge has a name on it.' },
          { type: 'try', text: 'Write one skill for your project — the task you explained to an agent more than once. Name its trigger. Name its law. That is a real asset, and it is the first one your repository will ever own.' },
        ],
      },
      {
        id: 'l9',
        access: 'member',
        title: 'The Whole First Project, Once',
        blurb: 'The build order, in the order you should actually do it.',
        duration: '30 min',
        difficulty: 'beginner',
        blocks: [
          { type: 'p', text: 'The build order, in the order you should actually do it:' },
          { type: 'code', lang: 'text', code: `[ ] 1. Name the folder. git init. .gitignore BEFORE the first commit.
[ ] 2. README with install / run / test.
[ ] 3. .env.example — the keys, no values. Real secrets stay in the environment.
[ ] 4. AGENTS.md — ten lines: what, first law, architecture, commands, laws.
[ ] 5. docs/ — the plan for the first feature, written before building it.
[ ] 6. The code, in the agreed shape. lib/ pure, tests/ mirroring.
[ ] 7. Skills — one procedure, written down, with its law.
[ ] 8. Two agents with narrow briefs. One builds, one reviews. Neither merges.
[ ] 9. Registry entry, git{} block, auth by reference.
[ ] 10. Changelog entry for everything above, dated, append-only.` },
          { type: 'p', text: '**The whole sequence is one afternoon**, and it is the difference between a folder and a project. Everything after this is faster, because the project explains itself.' },
          { type: 'try', text: 'Run all ten on a real, small project today. Not a tutorial — a real one. Then open the repository cold in six months\' time and see whether it still explains itself. That is the only test that counts.' },
        ],
      },
    ],
  },

  // From: aigf/courses/course-managing-the-work.md — CRS-400
  {
    id: 't11',
    access: 'member',
    number: 7,
    slug: 'managing-the-work-in-the-codebase',
    title: 'Managing the Work in the Codebase',
    tagline: 'The Machinery',
    description:
      'Most projects do not fail because the code was hard. They fail because the work was invisible: three people in the same branch, an issue nobody closed, a merge that happened at midnight and surprised everyone. This course builds the machinery once, so it costs nothing when the team grows.',
    accent: 'emerald',
    icon: 'ClipboardList',
    lessons: [
      {
        id: 'l1',
        access: 'free',
        title: 'The Ledger, or Nothing Is Real',
        blurb: 'If it is not written down, it did not happen. Three ledgers are enough to run a project.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Before any tool: **the rule that makes coordination possible.**' },
          { type: 'p', text: '**If it is not written down, it did not happen.**' },
          { type: 'p', text: 'Not in your head. Not in a chat scrollback. Not in a colleague\'s memory of a Tuesday. Written down, dated, in a place the next person will look.' },
          { type: 'h', text: 'Three ledgers, and they are enough to run a project' },
          { type: 'table', header: ["Ledger", "What it holds", "Append?"], rows: [["Issues", "what needs doing, and why", "closed, never deleted"], ["Commits / PRs", "what changed, and when", "immutable"], ["Changelog", "what this means for the user", "append-only, dated"]] },
          { type: 'p', text: '**Issues are the work queue. Commits are the truth. The changelog is the story told to users.** When those three disagree, you have a coordination problem — and the disagreement is always visible if all three are maintained.' },
          { type: 'p', text: '**The discipline that makes it work, and it is one line:** an issue is not finished until it is **closed by its own pull request**. Not "done, closing it manually." The PR closes it. That single rule is what keeps the queue honest — because a stale open issue is a question someone can always ask.' },
          { type: 'try', text: 'Open your project\'s oldest five issues and answer honestly: is each one still true? Close what is finished. Delete none of them — close them.' },
        ],
      },
      {
        id: 'l2',
        access: 'member',
        title: 'The Branch Is the Unit of Work',
        blurb: 'A branch is not just version control — it is a conversation.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Every piece of work gets its own branch, and the branch name says what it is.' },
          { type: 'code', lang: 'text', code: `main                          ← finished, working, protected
fix/kanban-drag-position      ← a fix
feat/real-course-tracks       ← a feature
chore/deps-bump-2026-09       ← maintenance` },
          { type: 'p', text: '**The law, and it is the same law from `CRS-200`:** you never work on `main`. `main` is a *result*, never a *workspace*.' },
          { type: 'p', text: '**Why the branch-per-unit matters more than it looks.** A branch is not just version control — it is a **conversation**. Anyone can ask: what is in flight? who owns it? how long has it been open? A branch list answers all three. A shared working tree answers none of them, and two people editing it is not collaboration — it is a race, with a merge conflict as the trophy.' },
          { type: 'h', text: 'The lifecycle, which never changes' },
          { type: 'code', lang: 'text', code: `issue opened  →  branch cut from main  →  work in small commits
   →  push  →  PR opened (closes the issue)
   →  review + checks  →  a human merges  →  branch deleted  →  changelog entry` },
          { type: 'p', text: 'Seven steps. The PR **closes the issue** — that is the link. And **nobody merges their own work on a shared project**, least of all an agent.' },
          { type: 'warn', text: 'A branch that lives for three weeks is not a feature, it is a second project. If a branch is open long enough that main has moved far, close it and re-cut from the new main. Rebasing onto a stale main is not a small chore; it is a second afternoon of work.' },
          { type: 'try', text: 'Name a branch by what it *does*, not by ticket number alone. Someone reading the branch list in six months should understand the project from it.' },
        ],
      },
      {
        id: 'l3',
        access: 'member',
        title: 'Isolation: Worktrees',
        blurb: 'A failed or abandoned piece of work never reaches the working tree. It simply is not merged.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Two people — or two agents — cannot safely edit the same directory. Isolation is the answer, and on a git project it is one line:' },
          { type: 'code', lang: 'bash', code: `git worktree add ../project-real-tracks -b feat/real-course-tracks` },
          { type: 'p', text: 'Now there are two full working directories on two branches, side by side. Nobody collides, and either can be abandoned with one `git worktree remove` without touching the other.' },
          { type: 'p', text: '**The law that follows from it:**' },
          { type: 'p', text: '**A failed or abandoned piece of work never reaches the working tree. It simply is not merged.** That is the entire safety model — no rollback theatre, no "we stashed it and hoped".' },
          { type: 'h', text: 'Where you need it' },
          { type: 'p', text: '- two agents working in parallel;' },
          { type: 'p', text: '- a long-running experiment you might throw away;' },
          { type: 'p', text: '- a production hotfix you are building while the feature branch sits in review;' },
          { type: 'p', text: '- reviewing someone else\'s work *running*, not just reading.' },
          { type: 'p', text: 'That last one is the underrated use: `git worktree add /tmp/review-42` then check out the PR branch and **run the thing**. Reading a diff tells you what changed. Running it tells you what breaks.' },
          { type: 'try', text: 'Make two worktrees of the same repo on two branches, edit one file in each, and see that neither disturbed the other. Then remove one.' },
        ],
      },
      {
        id: 'l4',
        access: 'member',
        title: 'Pull Requests as the Unit of Review',
        blurb: 'A PR should be reviewable in one sitting. A 3,000-line PR is approved by fatigue.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'The PR is where the work becomes reviewable. Everything about its shape is designed to make review cheap.' },
          { type: 'p', text: '**The body answers three questions, and a reviewer who cannot answer them from the PR alone will not review it:**' },
          { type: 'p', text: '1. **What** changed — one sentence.' },
          { type: 'p', text: '2. **Why** — the problem, in a sentence.' },
          { type: 'p', text: '3. **How to verify** — the exact command, the exact page, the exact thing to click.' },
          { type: 'p', text: 'Then the **law of size**: *a PR should be reviewable in one sitting.* Under roughly 400 changed lines. A 3,000-line PR is not reviewed, it is *approved by fatigue* — which is worse than no review, because it looks like a review happened.' },
          { type: 'p', text: '**The law learned the hard way:** a local merge on a verbal "yes" is a decision, not a delivery. It bypasses the review surface, so there is nothing to look at afterwards — and when it breaks, there is no record of why.' },
          { type: 'h', text: 'What a review actually is, in order of value' },
          { type: 'p', text: '1. *"What could break?"* — the failure nobody mentioned.' },
          { type: 'p', text: '2. *"How do I know this works?"* — the verification, present in the PR.' },
          { type: 'p', text: '3. Style, naming, structure — last, and only if 1 and 2 are answered.' },
          { type: 'p', text: '**A PR without a verification step is not finished.** You do not know yet whether it works; the author wrote it and *believes* it works. Those are different, and the gap between them is where bugs live.' },
          { type: 'try', text: 'Take your last PR and ask a colleague to review it using only the PR. Every question they must ask out loud is a gap in the body. Fix the body.' },
        ],
      },
      {
        id: 'l5',
        access: 'member',
        title: 'The Review Surface',
        blurb: 'An author does not review their own change, and does not merge it. The value of the gate is in it being a gate.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Reviews need somewhere to live, or they happen in a chat window and evaporate.' },
          { type: 'h', text: 'The rules that make a review surface worth using' },
          { type: 'p', text: '**One place.** Every PR for the project appears in it. A review surface that only catches some PRs is worse than none — it teaches false confidence.' },
          { type: 'p', text: '**Nothing merges without a human.** Always. A bot may recommend; a human seals. A tool that force-merges has removed the last check that mattered.' },
          { type: 'p', text: '**A checklist, so the reviewer is not relying on mood.** A short standing list — does it build, does the test pass, is the verification present, is anything outside the stated area touched — is worth more than a long prose rubric.' },
          { type: 'p', text: '**The size check is automated.** A guard that refuses an enormous PR is more reliable than your discipline on a Friday.' },
          { type: 'p', text: '**The conflict-of-interest law:** an author does not review their own change, and does not merge it. Not on a small team, not "just this once". The value of the gate is entirely in it being a gate.' },
          { type: 'try', text: 'Write your project\'s review checklist — five lines, the checks that must pass before any merge. Put it where the reviewer will see it, not in a document nobody opens.' },
        ],
      },
      {
        id: 'l6',
        access: 'member',
        title: 'Working With Agents in the Flow',
        blurb: 'An agent is a fast contributor, and the whole flow applies to it — more, because the failure modes differ.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'An agent is a *fast contributor*, and the whole flow above applies to it without one exception. In fact it applies **more**, because the failure modes are different.' },
          { type: 'h', text: 'Where an agent sits in the flow' },
          { type: 'code', lang: 'text', code: `issue  →  agent builds in a worktree  →  agent opens a PR
      →  automated checks  →  a human reviews  →  a human merges` },
          { type: 'p', text: 'The agent never reviews its own work. Never merges. Never closes the issue by hand — the PR does that.' },
          { type: 'h', text: 'Three rules that keep the fleet honest' },
          { type: 'p', text: '1. **A narrow brief.** *What area, what goal, what must not change, what deliverable, what check.* "Fix the site" is not a brief; "the Academy section shows real tracks, do not touch the hero, deliver a PR" is one round of work.' },
          { type: 'p', text: '2. **A plan before changes.** *"Read the area and tell me your plan before you edit anything."* One sentence of plan catches a wrong assumption before it becomes nine files.' },
          { type: 'p', text: '3. **Parallel means isolated.** Two agents, two worktrees, two branches. Never two agents in one directory — the loser is whichever file was overwritten.' },
          { type: 'p', text: '**The unlooked-for win:** the agent writes the boring parts. The drafter of the PR body, the summariser of the diff, the author of the changelog entry. Those are perfect tasks — mechanical, verifiable, and they remove the excuses for *not* documenting.' },
          { type: 'try', text: 'Give your next agent task a brief with all five parts, and end the task with the agent writing the changelog entry. Then check the entry before you merge. That check is the whole gate.' },
        ],
      },
      {
        id: 'l7',
        access: 'member',
        title: 'Cadence: How a Project Stays Honest',
        blurb: 'Coordination fails on rhythm, not on principle. WIP limit: one.',
        duration: '35 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'p', text: 'Coordination fails on rhythm, not on principle. Three rhythms, one of each:' },
          { type: 'h', text: 'Per task (minutes to a day)' },
          { type: 'p', text: '- the branch exists before the first edit' },
          { type: 'p', text: '- commits are small and named, never `git add -A`' },
          { type: 'p', text: '- the PR is opened when the work is done — not held "until I tidy up"' },
          { type: 'p', text: '- the issue is closed by its PR' },
          { type: 'h', text: 'Per day' },
          { type: 'p', text: '- a short standup, written: *in flight · blocked · done*. Fifteen minutes, three lines, no meeting. Blocked means **blocked on a named person or thing** — an unowned blocker is not a blocker, it is a wish.' },
          { type: 'p', text: '- rebase or re-cut any branch more than a few days behind main' },
          { type: 'h', text: 'Per week or release' },
          { type: 'p', text: '- a walk of the open branches: what is nearly done, what is abandoned' },
          { type: 'p', text: '- the changelog composed from the merged PRs' },
          { type: 'p', text: '- anything stale is **closed, not carried**. A queue of ten abandoned branches is not a backlog; it is noise with a deadline.' },
          { type: 'h', text: 'The board, if you use one' },
          { type: 'p', text: 'Three columns is enough, and a board with nine columns is a board nobody trusts:' },
          { type: 'code', lang: 'text', code: `| To do | In progress | In review | Done |` },
          { type: 'p', text: '**WIP limit: one item in progress per person.** Not a bureaucratic rule — the single most effective one. A second item in progress is a lie about capacity, and the lie is always paid for at the release.' },
          { type: 'try', text: 'Write down everything currently open in your project — branches, PRs, issues, half-done features. Close, finish, or re-date each one. The list you cannot account for *is* the coordination problem.' },
        ],
      },
      {
        id: 'l8',
        access: 'member',
        title: 'When It Goes Wrong',
        blurb: 'Three failures, each with the fix that works. Roll back before you debug.',
        duration: '35 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'h', text: '1. The conflict nobody saw coming' },
          { type: 'p', text: 'Two long branches both touched one file.' },
          { type: 'p', text: '- *Prevention:* short branches; rebase onto current main early and often.' },
          { type: 'p', text: '- *Repair:* rebase, resolve **in small steps**, run the tests after each file. A merge resolved in one afternoon without running anything is a merge that will fail in production.' },
          { type: 'h', text: '2. The abandoned branch' },
          { type: 'p', text: 'Someone went quiet for a month; the branch remains, the PR is stale, and nobody knows if the work matters.' },
          { type: 'p', text: '- *Prevention:* an expiry date on every PR. Two weeks, then close by default.' },
          { type: 'p', text: '- *Repair:* close it, write down what it was, and cut a fresh branch from main if it is still wanted. Carrying stale branches is how mainlines rot.' },
          { type: 'h', text: '3. The merge that surprised everyone' },
          { type: 'p', text: 'A change reached production through a path nobody reviewed.' },
          { type: 'p', text: '- *Prevention:* the gate is a gate. Protected branches refuse a direct push — make that a machine refusal, not a habit.' },
          { type: 'p', text: '- *Repair:* stop the line, roll back to the last good version, then ask the one question: *which step was skipped?* The answer is a fix to the process, not a fix to the person.' },
          { type: 'warn', text: 'Roll back **before** you debug. A previous working version always beats an interesting broken one. Then investigate, calmly, with the system back to normal.' },
          { type: 'try', text: 'Pick the last production surprise. Write the four lines — what broke, why it got through, what gate will catch it next time, and by when. That is the first runbook in most projects, and it is the beginning of a real process.' },
        ],
      },
      {
        id: 'l9',
        access: 'member',
        title: 'The Whole Flow, Once',
        blurb: 'Run this as a checklist on your next five tasks. By the fifth you will not be able to work without it.',
        duration: '30 min',
        difficulty: 'advanced',
        blocks: [
          { type: 'code', lang: 'text', code: `THE QUEUE
[ ] Every piece of work is an issue, with a reason.
[ ] An issue is closed by its own PR — never by hand.

THE BRANCH
[ ] One branch per unit of work, named for what it does.
[ ] Never work on main. It is a result, not a workspace.
[ ] Parallel work gets its own worktree; abandoned work touches nothing.

THE PR
[ ] What, why, how to verify — all three in the body.
[ ] Small enough to review in one sitting.
[ ] Checks run on every push; a guard refuses the oversized.

THE REVIEW
[ ] One surface, and every PR appears on it.
[ ] A standing checklist, not a mood.
[ ] No author reviews or merges their own change.
[ ] A human merges. Always.

THE AGENTS
[ ] Narrow brief, plan before changes, worktree for anything parallel.
[ ] Agents never review, never merge, never close issues by hand.

THE RHYTHM
[ ] Written standup: in flight · blocked · done.
[ ] Weekly walk of open branches; stale is closed, not carried.
[ ] One item in progress per person. WIP limit.
[ ] Changelog composed from the merged PRs.` },
          { type: 'try', text: 'Run this as a checklist on your next five tasks — solo. It feels bureaucratic and slow for the first one, and by the fifth you will not be able to work without it. Then the team gets it for free.' },
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

/** Total minutes of authored lesson time, summed from each lesson's duration. */
export const trackStats = {
  tracks: tracks.length,
  lessons: tracks.reduce((n, t) => n + t.lessons.length, 0),
  minutes: tracks.reduce(
    (n, t) => n + t.lessons.reduce((m, l) => m + (parseInt(l.duration) || 0), 0),
    0,
  ),
}

/** The same total in whole hours, rounded down - the only honest public figure. */
export const trackStatsHours = Math.floor(trackStats.minutes / 60)

/** A lesson anyone may read forever, with no account. The minimal ground. */
export function isFreeLesson(lesson: Lesson): boolean {
  return lesson.access === 'free'
}

/** Tracks the public may read end to end. */
export const freeTracks = tracks.filter((t) => t.access === 'free')
