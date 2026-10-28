# ⚔️ APTITUDE RPG

> **Study for placement aptitude exams like you're playing an RPG game.**

APTITUDE RPG is a 100% offline, single-player web application that gamifies aptitude exam preparation. Inspired by Duolingo, Habitica, Pokémon, and classic RPG games, it wraps aptitude problem-solving inside a progression system featuring **XP, Levels, Hearts, Streaks, Skill Trees, Boss Battles, Achievements, Daily Quests**, and a **Cosmetic Shop** — all running locally in your browser with zero installation.

---

## 📸 Preview

| Dashboard | Quiz Screen | Skill Tree |
|-----------|-------------|------------|
| Level bar, Streak 🔥, Hearts ❤️, Daily Quests | Glassmorphism cards, Flying XP ⚡, Combo multiplier | Subtopic nodes with mastery % |

---

## 🚀 How to Launch (Zero Installation Required)

### Option A — Double-Click to Play (Recommended)
1. Download or clone this repository.
2. Open the folder.
3. **Double-click `index.html`** to launch in your browser.

> Works on Chrome, Edge, Brave, Firefox, or any modern browser.  
> No Node.js, no npm, no build step, no internet needed after first load.

### Option B — Run from USB Pendrive
1. Copy the entire folder onto your Pendrive.
2. Plug into any computer.
3. Double-click `index.html` directly from the Pendrive.

### Option C — GitHub Pages (Static Hosting)
Push to GitHub and enable **GitHub Pages** on the `main` branch to get a free online URL:

```
Settings → Pages → Source: Deploy from branch → main → / (root) → Save
```

Your app will be live at: `https://<your-username>.github.io/<repo-name>/`

---

## 📁 File Structure

```
aptitude-rpg/
│
├── index.html      ← Entry point (open this in your browser)
├── styles.css      ← Glassmorphism, animations, custom CSS utilities
├── data.js         ← All game data: questions, skill nodes, achievements, quests, shop items
├── sound.js        ← Web Audio API synthesizer (generates all SFX dynamically, no audio files)
├── app.js          ← Complete React application — all views, game logic, and state
│
└── README.md       ← This file
```

### No build tools. No `node_modules`. No bundler.  
All dependencies are loaded from CDN on first open.

---

## 🎮 Game Features

### ⚡ XP & Level System
| Difficulty | Base XP |
|------------|---------|
| Easy       | +5 XP   |
| Medium     | +10 XP  |
| Hard       | +20 XP  |
| Combo Bonus| +2 XP per streak (capped at +10) |

- Level formula: `XP Required = 100 × 1.25^(Level − 1)`
- Level up triggers: arpeggio sound fanfare + particle confetti burst
- Rank titles: Bronze Scholar → Silver Strategist → Gold Tactician → Platinum Overlord → Diamond Virtuoso → Grandmaster RPG Deity

---

### ❤️ Heart System
- Start with **5 Hearts**
- Lose 1 heart on: wrong answer, using a Hint
- Restore hearts: Shop (costs 50 🪙), daily login, boss battle victory

---

### 🪙 Coin Economy
| Action | Coins |
|--------|-------|
| Correct (Easy/Medium) | +10 🪙 |
| Correct (Hard) | +20 🪙 |
| Boss Battle Win | +Bonus 🪙 |

Coins unlock cosmetic shop items only (avatars, titles, heart refills).

---

### 🌳 RPG Skill Tree (25 Subtopics)

| Category | Subtopics |
|---|---|
| **Arithmetic** | Percentages, Ratio & Proportion, Profit & Loss, Average, Time & Work, Time Speed Distance, Mixtures, Ages, Number System |
| **Logical** | Blood Relations, Seating Arrangement, Coding & Decoding, Series, Direction Sense, Calendar, Clocks, Cubes & Dice |
| **Verbal** | Vocabulary, Grammar, Reading Comprehension, Synonyms, Antonyms, Para Jumbles |
| **Data Interpretation** | Pie Charts, Tables, Line & Bar Graphs, Caselets & Sets |

Each node tracks: Mastery %, Questions Solved, Accuracy, XP Earned.

---

### 🐲 Weekly Boss Battle
- **Boss**: Chronos The Math Overlord (300 HP)
- Answer correctly → Deal 25 damage to the boss
- Wrong answer → Lose 1 Heart (boss counter-attack)
- Reward: **2× XP & 2× Coins** + 🏅 "Raid Commander" achievement
- Live combat log shows critical hits and counter-attacks

---

### 📖 Mistake Journal & Spaced Repetition (SRS)
- Every incorrect answer is **automatically logged**
- SRS review intervals: **1 day → 3 days → 7 days → 14 days → 30 days**
- Longer intervals after each successful review
- Mark questions as "Mastered" to remove them from the review queue

---

### 🏆 Daily Quests
Automatically generated each day:
- Solve 10 questions in any mode
- Get a 5-question correct streak
- Solve 5 Arithmetic questions
- Solve 5 Logical questions
- Solve 3 Verbal questions

Rewards: XP + Gold Coins (claimable once per day).

---

### 🏅 Achievements (10 Badges)
| Badge | Condition |
|-------|-----------|
| 🎯 First Steps | Solve 1st question |
| 🥉 Novice Scholar | Solve 10 questions |
| 🥈 Century Slayer | Solve 100 questions |
| 💎 Flawless Victory | 100% accuracy in a session |
| 🔥 Ignition | 3-day streak |
| ⚡ Unstoppable Flame | 7-day streak |
| 🐲 Raid Commander | Defeat the Boss |
| 🧮 Math Overlord | Solve 20 Arithmetic questions |
| 🧠 Mind Weaver | Solve 20 Logical questions |
| 👑 Grandmaster Scholar | Reach Level 10 |

---

### 🛒 Cosmetic Shop
Spend earned Gold on:
- **Avatars**: ⚔️ Cyber Knight (free) → 🔮 Spell Weaver → 🥷 Shadow Ninja → 🐲 Dragon Slayer → 🤖 Mecha Overlord
- **Titles**: Aptitude Initiate (free) → Logic Overlord → Calculative Deity → Apex Boss Slayer
- **Consumables**: Full Heart Refill (50 🪙)

---

### 🔊 Sound Engine
All SFX are **synthesized dynamically** using the Web Audio API — no MP3 or WAV files required:

| Event | Sound |
|-------|-------|
| Correct Answer | Rising harmonic chime (C5 → E5 → G5 → C6) |
| Wrong Answer | Low sawtooth wave thud |
| Level Up | Ascending 5-note arpeggio fanfare |
| Boss Hit | Percussive impact (sawtooth sweep) |
| Heart Gain | Bright rising sine tone |
| UI Click | Short sine click |

---

### ⚙️ Settings & Data Hub
- **Export Backup**: Downloads full progress as `aptitude_rpg_backup_YYYY-MM-DD.json`
- **Restore Backup**: Upload a backup JSON to restore all data on any device
- **Import Custom Questions**: Upload a JSON array of questions to expand the question bank
- **Sound Toggle**: Enable/disable all SFX
- **Reset Progress**: Wipe all data back to Level 1

---

## ➕ Adding Custom Questions

Create a `.json` file in this format and import it via **Settings → Import Custom Questions**:

```json
[
  {
    "id": "my_q_001",
    "topic": "Arithmetic",
    "subtopic": "Percentages",
    "difficulty": "medium",
    "question": "If a number is reduced by 20%, by what percent should it be increased to get the original number back?",
    "options": ["20%", "25%", "22%", "18%"],
    "correctIndex": 1,
    "explanation": "If reduced by 20%, new value = 80% of original. To recover: (20/80) × 100 = 25% increase needed.",
    "tags": ["percentage", "reverse-percentage"]
  }
]
```

**Required fields**: `id`, `topic`, `subtopic`, `difficulty`, `question`, `options` (array of 4), `correctIndex` (0–3), `explanation`, `tags`

**Valid `topic` values**: `"Arithmetic"`, `"Logical"`, `"Verbal"`, `"Data Interpretation"`  
**Valid `difficulty` values**: `"easy"`, `"medium"`, `"hard"`

---

## 💾 Data Storage

All data is stored in **LocalStorage** (browser-local, no server):

| Key | Contents |
|-----|----------|
| `apt_profile` | Player profile: level, XP, hearts, streak, coins, cosmetics |
| `apt_skills` | Skill node progress: solved, correct, XP per subtopic |
| `apt_ach` | Achievement unlock status and progress |
| `apt_quests` | Daily quest progress and claimed status |
| `apt_mistakes` | Mistake journal entries for SRS review |

> ⚠️ **Data is tied to the browser.** If you switch browsers or computers, export a backup JSON first and restore it on the new device.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (via CDN, no build step) |
| JSX Transpiler | Babel Standalone |
| Styling | Tailwind CSS CDN + Custom CSS (glassmorphism, animations) |
| Sound Engine | Web Audio API (native browser API) |
| Data Persistence | LocalStorage |
| Confetti | canvas-confetti |
| Fonts | Google Fonts (Inter + Outfit) |
| Hosting | Any static host (GitHub Pages, Netlify, Vercel, USB Drive) |

---

## 🗺️ Roadmap (Future Enhancements)

- [ ] **IndexedDB Storage** — larger question banks, richer offline support
- [ ] **AI Question Generator** — auto-generate questions via Gemini/GPT API
- [ ] **Company-Specific Packs** — TCS, Infosys, Wipro, Amazon aptitude filters
- [ ] **Mobile PWA** — installable as an Android/iOS home screen app
- [ ] **Cloud Sync** — optional Google Drive backup
- [ ] **Multiplayer Leaderboard** — competitive XP rankings with friends
- [ ] **Speech Mode** — voice-read questions using Web Speech API

---

## 🤝 Contributing

1. Fork this repository.
2. Add new questions to `data.js` in the `DEFAULT_QUESTIONS` array.
3. Add new achievements in `DEFAULT_ACHIEVEMENTS`.
4. Open a Pull Request with a description of your changes.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ for every student grinding for their dream placement.**

*APTITUDE RPG — Because studying should feel like leveling up.*

</div>
