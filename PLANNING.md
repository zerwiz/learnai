# LearnAI — Courses for AI Geeks & Freaks

## Overview

A hands-on course for AI geeks and freaks — new people getting into coding with AI. We build real things, break them, fix them, and learn by doing. No fluff, no corporate jargon. Just code, models, and curiosity.

## Goals

- Teach beginners how to code with AI models — from zero to building
- Make it practical: every lesson has code they can run, break, and improve
- Cover the full stack: Git, Python, LLMs, APIs, deployment
- Build a community of AI geeks who learn together
- Host everything at `learn.zerwiz.org` via Cloudflare

## Who This Is For

- **AI geeks** — people who want to understand what's under the hood
- **Freaks** — the curious, the stubborn, the ones who tinker at 2 AM
- **Beginners** — no prior coding experience needed, just willingness to try
- **Not for** — people who want a certificate, a lecture, or someone to hold their hand

## Course Tracks

### Track 0: Your Machine — Omarchy, Whisper & Piper

Before any code, you need a machine that works the way you want. This track is for users who don't have Omarchy yet — install the OS, then add voice so you can talk to your computer.

#### Part A: Install Omarchy (the OS)

Omarchy is a beautiful, opinionated Arch Linux by DHH — Hyprland window manager, SDDM login, full disk encryption, snapper snapshots. It boots in under a minute.

**What you need:**
- A USB stick (8 GB+)
- A wired keyboard or 2.4 GHz dongle keyboard (Bluetooth won't work at the encryption prompt)
- A machine with Secure Boot and TPM disabled in BIOS

**Steps:**

```bash
# 1. Download the Omarchy ISO
#    https://omarchy.org/ — grab the latest ISO

# 2. Write it to a USB stick
#    On Linux:
    sudo dd if=omarchy-*.iso of=/dev/sdX bs=4M status=progress oflag=direct
#    On Mac/Windows: use balenaEtcher
#    On Linux: use caligula (https://github.com/ifd3f/caligula)

# 3. Boot from the USB
#    Enter BIOS (usually F2, F12, Del, or Esc at startup)
#    Disable Secure Boot and TPM
#    Set USB as first boot device
#    Save and reboot

# 4. Run the installer
#    The wizard asks:
#    - Keyboard layout
#    - Hostname
#    - Username and password
#    - Disk selection (full-disk wipes the drive; free-space installs alongside another OS)
#    - Encryption (on by default — highly recommended)
#    Answer the questions, confirm, and wait 1–5 minutes.

# 5. First boot
#    Enter your encryption password at startup
#    Complete the personal setup (username, password, keyboard)
#    You're in — Hyprland desktop, ready to go
```

**After install — what you get:**
- Hyprland window manager (smooth, animated, keyboard-driven)
- SDDM login screen
- Quickshell bar (system info, workspace switcher)
- Alacritty / Foot terminal
- Git, curl, jq already installed
- Full disk encryption + snapper snapshots (rollback any time)

**Troubleshooting:**
- Stuck at boot? Check Secure Boot is off, USB is properly written
- No desktop after login? Make sure you booted the ISO, not a live USB without persistence
- Need help? #omarchy-help on the community Discord (https://omarchy.org/discord)

#### Part B: Install Whisper (speech-to-text)

Whisper lets you dictate into your computer — speak and get text. Runs on CPU or GPU.

```bash
# 1. Install build dependencies
    sudo pacman -S git cmake ffmpeg ninja extra-cmake-modules

# 2. Clone whisper.cpp
    cd ~/CodeP
    git clone https://github.com/ggerganov/whisper.cpp.git
    cd whisper.cpp

# 3. Build with CUDA (GPU acceleration)
    mkdir -p build && cd build
    cmake .. -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON
    cmake --build . --config Release -j$(nproc)

# 4. Download a model (start with small.en — good balance of speed/accuracy)
    cd ../models
    bash ./download-ggml-model.sh small.en
    # Model saves to: ~/whisper.cpp/models/ggml-small.en.bin

# 5. Test it
    ./build/bin/whisper-cli -m ../models/ggml-small.en.bin -f samples/jfk.wav
    # Should print the transcribed text

# 6. Set up dictation script
    # Create: ~/whisper-dictate.sh (start/stop/toggle dictation)
    # Create: ~/.config/whisper-dictate.conf (MODEL=, GPU=on|off)
    # Create: ~/.local/bin/whisper-ptt.py (evdev hold-to-talk daemon)
    # Create: ~/.config/systemd/user/whisper-ptt.service (auto-start)

# 7. Add your user to the input group (for PTT daemon)
    sudo usermod -aG input $USER
    # Log out and back in for this to take effect

# 8. Start the PTT daemon
    systemctl --user daemon-reload
    systemctl --user enable --now whisper-ptt.service
```

**Keybindings to set up (in your Hyprland bindings):**
- `F9` (hold) — push-to-talk dictation
- `SUPER+CTRL+X` — toggle dictation on/off

**GPU note:** Whisper on GPU is ~5× faster than CPU. If you have an NVIDIA card, keep GPU on. If not, CPU is fine.

#### Part C: Install Piper (text-to-speech)

Piper lets your computer speak — highlight text, press a key, and it reads it aloud.

```bash
# 1. Create a Python virtual environment
    python -m venv ~/.piper-venv
    source ~/.piper-venv/bin/activate

# 2. Install Piper and GPU support
    pip install piper-tts onnxruntime-gpu
    # (If no NVIDIA GPU, just: pip install piper-tts)

# 3. Download voices
    # Voices are .onnx files, stored in ~/.local/share/piper-voices/
    # Popular English voices:
    #   en_US-amy-medium    — female, natural
    #   en_US-lessac-medium  — male, clear
    #   en_US-libritts_r-medium — 904 speakers to choose from
    # Download: https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US
    # Save as: ~/.local/share/piper-voices/en_US-<name>-medium.onnx

# 4. Test it
    source ~/.piper-venv/bin/activate
    echo "Hello, world" | piper --model en_US-amy-medium

# 5. Set up the speak scripts
    # Create: ~/.local/bin/speak (reads stdin aloud)
    # Create: ~/.local/bin/speak-selection (reads highlighted text — bound to F10)
    # Create: ~/.config/piper-speak.conf (VOICE=en_US-amy-medium)

# 6. Set up voice switching
    # Create: ~/.local/bin/voice (unified switcher for Piper + Whisper)
    # Commands: voice show, voice list, voice amy, voice lessac, voice small.en
```

**Keybindings to set up (in your Hyprland bindings):**
- `F10` — read selected text aloud
- `SUPER+CTRL+Y` — switch TTS voice (cycle through installed voices)
- `ALT+G` — speak (legacy alias)

**GPU note:** Piper runs faster on CPU for one-shot speech. GPU context creation costs ~1 second, which eats the gain. Keep `CUDA=off` in `~/.config/piper-cuda.conf` (the default).

#### Part D: The Unified Voice Switcher

One command to control everything:

```bash
# Create: ~/.local/bin/voice
# (The unified switcher — see the full script in the repo)

voice show          # current voice, model, GPU state, VRAM
voice list          # all installed voices and models
voice amy           # switch to Amy voice
voice lessac        # switch to Lessac voice
voice small.en      # switch Whisper to small.en model
voice whisper gpu on|off
voice piper gpu on|off
voice gpu on|off    # both engines
voice test          # speak a test line
```

---

### Track 1: Git & GitHub — The Foundation

Every coder needs this first. Before models, before Python — learn to move code around.

- Making a new repo (GitHub CLI, web UI)
- Cloning repos (SSH vs HTTPS, branches)
- Forking repos (your own copy, upstream vs origin)
- Syncing a fork with the original
- Branching & pull requests (never push to main)
- Small, focused PRs — one thing at a time

### Track 2: Python for AI — The Language

Python is the lingua franca of AI. Learn it the right way.

- Setup: Python, pip, virtual environments
- Basics: variables, loops, functions, classes
- Working with data: lists, dicts, JSON
- Reading docs and error messages (the real skill)
- Installing and using packages

### Track 3: Talking to Models — The API

Connect to AI models and make them do things.

- What is an API? (REST, JSON, requests)
- OpenAI-compatible endpoints (the llama.cpp rail)
- Prompting: writing good instructions
- Building a simple chat app
- Streaming responses, handling errors

### Track 4: Building with AI — The Projects

Put it all together. Real projects, real learning.

- A CLI tool that talks to a model
- A web app with a model backend
- Deploying to Cloudflare Pages
- Adding authentication, making it public

### Track 5: Going Deeper — The Rabbit Hole

For the freaks who want more.

- Running models locally (llama.cpp, Ollama)
- Fine-tuning, prompt engineering
- Agents, tools, MCP
- Building your own AI project from scratch

## Steps

### Phase 1: Foundation

- [ ] Set up the repo structure (tracks as folders)
- [ ] Write the home page (`index.html`) for `learn.zerwiz.org`
- [ ] Create Track 0 — Omarchy install + Whisper + Piper (for users without Omarchy)
- [ ] Create the Git & GitHub track (Track 1)
- [ ] Set up Cloudflare DNS and Pages deployment

### Phase 2: Core Content

- [ ] Write Python track (Track 2)
- [ ] Write API track (Track 3)
- [ ] Add hands-on exercises for each lesson
- [ ] Create a "try it now" section with live examples

### Phase 3: Projects & Deployment

- [ ] Build project track (Track 4)
- [ ] Deploy the course site to `learn.zerwiz.org`
- [ ] Add navigation between tracks
- [ ] Mobile-friendly design

### Phase 4: Advanced & Community

- [ ] Write deep-dive track (Track 5)
- [ ] Add a community section (links, discussions)
- [ ] Collect feedback, iterate
- [ ] Add more projects as we go

## Files to Create/Modify

- `PLANNING.md` — this file
- `README.md` — course overview and quick start
- `index.html` — the home page at `learn.zerwiz.org`
- `tracks/` — one folder per course track
- `exercises/` — hands-on code for each lesson
- Cloudflare DNS records for `learn.zerwiz.org`

## Notes

- Use static HTML for the site — simple, fast, free on Cloudflare
- Every lesson has runnable code — no theory without practice
- Keep it lightweight and mobile-friendly
- Write for beginners but don't talk down — geeks respect honesty

---

## Git Workflow — Making, Cloning, and Forking Repos

### Making a New Repo

```bash
# Create a new repo on GitHub first (web UI or CLI)
gh repo create learnai --public --description "AI learning experiments"

# Then clone it locally
git clone git@github.com:zerwiz/learnai.git
cd learnai

# Or initialize an existing folder
git init
git remote add origin git@github.com:zerwiz/learnai.git
git branch -M main
git add .
git commit -m "initial commit"
git push -u origin main
```

### Cloning a Repo

```bash
# SSH (recommended — uses your key)
git clone git@github.com:zerwiz/learnai.git

# HTTPS (prompts for token)
git clone https://github.com/zerwiz/learnai.git

# Clone a specific branch
git clone -b dev git@github.com:zerwiz/learnai.git
```

### Forking a Repo

```bash
# Fork via GitHub CLI (creates fork under your account)
gh fork zerwiz/learnai --clone=true

# Or manually via web UI, then clone your fork
git clone git@github.com:zerwiz/learnai.git
cd learnai

# Add the upstream (original) remote
gh remote add upstream git@github.com:zerwiz/learnai.git

# Verify remotes
git remote -v
# origin  → your fork
# upstream → original repo
```

### Syncing a Fork

```bash
# Fetch upstream changes
git fetch upstream

# Switch to your fork's main
git checkout main

# Rebase your fork onto upstream
git rebase upstream/main

# Push to your fork
git push origin main
```

### Branching & PRs

```bash
# Create a feature branch
git checkout -b feature/my-idea

# Work, commit, push
git add .
git commit -m "add learning module"
git push -u origin feature/my-idea

# Open a PR via CLI
gh pr create --title "Add learning module" --body "Description of changes"

# Review and merge via GitHub web UI
```

### Key Principles

- **Never push to `main` directly** — always work on a branch
- **Fork first** when contributing to repos you don't own
- **Keep `origin` as your fork**, `upstream` as the original
- **Rebase, don't merge**, to keep history clean
- **Small, focused PRs** — one feature or fix per pull request
