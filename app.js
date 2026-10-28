const { useState, useEffect, useRef } = React;

// ─── Helpers ────────────────────────────────────────
function getXpForLevel(level) { return Math.round(100 * Math.pow(1.25, level - 1)); }
function getRank(level) {
  if (level <= 2)  return 'Bronze Scholar';
  if (level <= 4)  return 'Silver Strategist';
  if (level <= 7)  return 'Gold Tactician';
  if (level <= 10) return 'Platinum Overlord';
  if (level <= 14) return 'Diamond Virtuoso';
  return 'Grandmaster RPG Deity';
}
function todayStr() { return new Date().toISOString().split('T')[0]; }
function fireConfetti() {
  if (window.confetti) confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 },
    colors: ['#8B5CF6','#F59E0B','#06B6D4','#10B981','#EC4899'] });
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ─── Initial Player Profile ──────────────────────────
const DEFAULT_PROFILE = {
  level: 1, xp: 0, xpToNextLevel: 100,
  streak: 1, longestStreak: 1,
  hearts: 5, maxHearts: 5,
  coins: 50, rank: 'Bronze Scholar',
  accuracyPct: 100, totalSolved: 0, totalCorrect: 0,
  todaySolved: 0, todayXp: 0, lastActiveDate: todayStr(),
  equippedAvatar: '⚔️ Cyber Knight', equippedTitle: 'Aptitude Initiate',
  unlockedCosmetics: ['⚔️ Cyber Knight', 'Aptitude Initiate'],
  soundEnabled: true,
};

// ─── LocalStorage helpers ────────────────────────────
const LS = {
  get: (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val)      => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

// ─── Build skill progress map ────────────────────────
function buildSkillMap(savedSkills) {
  const map = {};
  DEFAULT_SKILL_NODES.forEach(n => {
    map[n.id] = savedSkills[n.id] || { solved: 0, correct: 0, xp: 0 };
  });
  return map;
}

// ─── Build achievement map ───────────────────────────
function buildAchMap(savedAch) {
  const map = {};
  DEFAULT_ACHIEVEMENTS.forEach(a => {
    map[a.id] = savedAch[a.id] || { progress: 0, unlocked: false, claimed: false };
  });
  return map;
}

// ─── Build quest map ─────────────────────────────────
function buildQuestMap(savedQuests, savedDate) {
  if (savedDate !== todayStr()) {
    // new day → reset quests
    const map = {};
    QUEST_TEMPLATES.forEach(q => { map[q.id] = { current: 0, completed: false, claimed: false }; });
    return map;
  }
  const map = {};
  QUEST_TEMPLATES.forEach(q => {
    map[q.id] = savedQuests[q.id] || { current: 0, completed: false, claimed: false };
  });
  return map;
}

// ─── Main APP ────────────────────────────────────────
function App() {
  const [profile,  setProfileRaw]  = useState(() => LS.get('apt_profile', DEFAULT_PROFILE));
  const [skillMap, setSkillMapRaw] = useState(() => buildSkillMap(LS.get('apt_skills', {})));
  const [achMap,   setAchMapRaw]   = useState(() => buildAchMap(LS.get('apt_ach', {})));
  const [questMap, setQuestMapRaw] = useState(() => buildQuestMap(LS.get('apt_quests', {}), LS.get('apt_quest_date', '')));
  const [mistakes, setMistakesRaw] = useState(() => LS.get('apt_mistakes', []));

  const [view, setView]             = useState('dashboard');
  const [quizQ, setQuizQ]           = useState([]);
  const [qIdx,  setQIdx]            = useState(0);
  const [selOpt, setSelOpt]         = useState(null);
  const [submitted, setSubmitted]   = useState(false);
  const [combo, setCombo]           = useState(0);
  const [isBoss, setIsBoss]         = useState(false);
  const [bossHp, setBossHp]         = useState(300);
  const [bossLog, setBossLog]       = useState(['⚔️ Boss Raid started! Chronos the Math Overlord (300 HP) appears!']);
  const [xpFly,  setXpFly]         = useState(null);
  const [levelUpMsg, setLevelUpMsg] = useState(null);
  const [toastMsg,   setToastMsg]   = useState(null);
  const [questDate,  setQuestDate]  = useState(() => LS.get('apt_quest_date', todayStr()));

  // Persist state
  const setProfile  = v => { setProfileRaw(v);  LS.set('apt_profile',  v); };
  const setSkillMap = v => { setSkillMapRaw(v);  LS.set('apt_skills',   v); };
  const setAchMap   = v => { setAchMapRaw(v);    LS.set('apt_ach',      v); };
  const setMistakes = v => { setMistakesRaw(v);  LS.set('apt_mistakes', v); };
  const setQuestMapP= v => { setQuestMapRaw(v);  LS.set('apt_quests',   v); LS.set('apt_quest_date', todayStr()); };

  // Sound toggle
  useEffect(() => { sound.setEnabled(profile.soundEnabled); }, [profile.soundEnabled]);

  // Toast helper
  function toast(msg, duration = 2500) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), duration);
  }

  // ─── Start Quiz ────────────────────────────────────
  function startQuiz(filterTopic = null, boss = false) {
    setIsBoss(boss);
    if (boss) { setBossHp(300); setBossLog(['⚔️ Boss Raid started! Chronos the Math Overlord (300 HP) appears!']); }
    let pool = [...DEFAULT_QUESTIONS];
    if (filterTopic) pool = pool.filter(q => q.topic === filterTopic || q.subtopic === filterTopic);
    if (pool.length === 0) pool = [...DEFAULT_QUESTIONS];
    setQuizQ(shuffle(pool));
    setQIdx(0); setSelOpt(null); setSubmitted(false); setCombo(0);
    setView('quiz');
  }

  function startMistakeReview() {
    const active = mistakes.filter(m => !m.mastered);
    if (active.length === 0) { toast('🎉 No pending mistakes! Solve new questions.'); return; }
    setIsBoss(false);
    setQuizQ(shuffle(active.map(m => m.question)));
    setQIdx(0); setSelOpt(null); setSubmitted(false); setCombo(0);
    setView('quiz');
  }

  // ─── Submit Answer ─────────────────────────────────
  function submitAnswer() {
    if (selOpt === null || submitted) return;
    setSubmitted(true);
    const q         = quizQ[qIdx];
    const isCorrect = selOpt === q.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      const newCombo  = combo + 1;
      setCombo(newCombo);
      const xpBase    = q.difficulty === 'hard' ? 20 : q.difficulty === 'medium' ? 10 : 5;
      const xpEarned  = xpBase + Math.min(newCombo * 2, 10);
      const coinsEarned = q.difficulty === 'hard' ? 20 : 10;

      if (isBoss) {
        const dmg = 25;
        const nhp = Math.max(0, bossHp - dmg);
        setBossHp(nhp);
        setBossLog(prev => [`💥 CRITICAL HIT! Chronos takes ${dmg} DMG → ${nhp} HP (Combo ×${newCombo})`, ...prev.slice(0, 4)]);
        if (nhp === 0) {
          sound.playLevelUp(); fireConfetti();
          setTimeout(() => { setView('boss-victory'); }, 800);
          return;
        }
      }

      // Show flying XP
      setXpFly(xpEarned);
      setTimeout(() => setXpFly(null), 1300);

      // Update profile
      setProfile(prev => {
        let newXp     = prev.xp + xpEarned;
        let newLevel  = prev.level;
        let newXpReq  = prev.xpToNextLevel;
        let leveled   = false;

        while (newXp >= newXpReq) {
          newXp  -= newXpReq;
          newLevel++;
          newXpReq = getXpForLevel(newLevel);
          leveled  = true;
        }

        if (leveled) {
          sound.playLevelUp(); fireConfetti();
          setLevelUpMsg(`🏆 LEVEL UP! You are now Level ${newLevel}!`);
          setTimeout(() => setLevelUpMsg(null), 3000);
        }

        const newTotal   = prev.totalSolved + 1;
        const newCorrect = prev.totalCorrect + 1;
        return {
          ...prev,
          xp: newXp, level: newLevel, xpToNextLevel: newXpReq,
          rank: getRank(newLevel),
          coins: prev.coins + coinsEarned,
          totalSolved: newTotal, totalCorrect: newCorrect,
          todaySolved: prev.todaySolved + 1,
          todayXp: prev.todayXp + xpEarned,
          accuracyPct: Math.round((newCorrect / newTotal) * 100),
        };
      });

      // Update skill map
      setSkillMap(prev => {
        const node = DEFAULT_SKILL_NODES.find(n => n.name === q.subtopic || n.category === q.topic);
        if (!node) return prev;
        const old = prev[node.id];
        return { ...prev, [node.id]: { solved: old.solved + 1, correct: old.correct + 1, xp: old.xp + xpEarned } };
      });

      // Update quests
      updateQuests(q, isCorrect, newCombo);

      // Update achievements
      checkAchievements(q, isCorrect);

    } else {
      sound.playWrong();
      setCombo(0);
      setBossLog(prev => [`⚡ Chronos counter-attacked! You lost 1 heart!`, ...prev.slice(0, 4)]);
      setProfile(prev => {
        const newTotal   = prev.totalSolved + 1;
        return {
          ...prev, hearts: Math.max(0, prev.hearts - 1),
          totalSolved: newTotal,
          accuracyPct: Math.round((prev.totalCorrect / newTotal) * 100),
        };
      });

      // Log to Mistake Journal
      setMistakes(prev => {
        const existing = prev.find(m => m.question.id === q.id && !m.mastered);
        if (existing) {
          return prev.map(m => m.question.id === q.id && !m.mastered
            ? { ...m, timesWrong: m.timesWrong + 1, lastDate: todayStr() } : m);
        }
        return [{ id: `m_${Date.now()}`, question: q, timesWrong: 1, mastered: false, lastDate: todayStr() }, ...prev];
      });

      // Skill accuracy update
      setSkillMap(prev => {
        const node = DEFAULT_SKILL_NODES.find(n => n.name === q.subtopic || n.category === q.topic);
        if (!node) return prev;
        const old = prev[node.id];
        return { ...prev, [node.id]: { ...old, solved: old.solved + 1 } };
      });
    }
  }

  function updateQuests(q, isCorrect, newCombo) {
    setQuestMapP(prev => {
      const next = { ...prev };
      QUEST_TEMPLATES.forEach(t => {
        const entry = next[t.id] || { current: 0, completed: false, claimed: false };
        if (entry.completed) return;
        let inc = 0;
        if (t.category === 'general' && isCorrect)                       inc = 1;
        if (t.category === q.topic   && isCorrect)                       inc = 1;
        if (t.category === 'Verbal'  && q.topic === 'Verbal' && isCorrect) inc = 1;
        if (t.category === 'combo'   && newCombo >= t.target)            inc = t.target;
        if (inc > 0) {
          const newCur  = Math.min(t.target, entry.current + inc);
          next[t.id] = { ...entry, current: newCur, completed: newCur >= t.target };
        }
      });
      return next;
    });
  }

  function checkAchievements(q, isCorrect) {
    setAchMap(prev => {
      const next = { ...prev };
      const totalSolved  = profile.totalSolved + 1;
      const totalCorrect = profile.totalCorrect + (isCorrect ? 1 : 0);

      const updates = {
        ach_01: { progress: Math.min(1, totalSolved) },
        ach_02: { progress: Math.min(10,  totalSolved) },
        ach_03: { progress: Math.min(100, totalSolved) },
        ach_06: { progress: Math.min(7,   profile.streak) },
        ach_05: { progress: Math.min(3,   profile.streak) },
        ach_08: q.topic === 'Arithmetic' ? { progress: Math.min(20, (next['ach_08']?.progress||0) + (isCorrect?1:0)) } : null,
        ach_09: q.topic === 'Logical'    ? { progress: Math.min(20, (next['ach_09']?.progress||0) + (isCorrect?1:0)) } : null,
        ach_10: { progress: Math.min(10, profile.level) },
      };

      Object.entries(updates).forEach(([id, upd]) => {
        if (!upd) return;
        const old = next[id];
        const ach = DEFAULT_ACHIEVEMENTS.find(a => a.id === id);
        if (!ach) return;
        const newProg = upd.progress;
        const unlocked = newProg >= ach.maxProgress;
        if (!old.unlocked && unlocked) {
          fireConfetti();
          toast(`🏅 Achievement Unlocked: "${ach.title}"! +${ach.xpReward} XP`);
        }
        next[id] = { ...old, ...upd, unlocked };
      });
      return next;
    });
  }

  function nextQuestion() {
    if (qIdx < quizQ.length - 1) {
      setQIdx(q => q + 1); setSelOpt(null); setSubmitted(false);
    } else {
      toast('✅ Session Complete! Great work!');
      setView('dashboard');
    }
  }

  // ─── UI Helpers ────────────────────────────────────
  const xpPct = Math.round((profile.xp / profile.xpToNextLevel) * 100);
  const quote  = DAILY_QUOTES[(profile.totalSolved) % DAILY_QUOTES.length];

  // ─── RENDER ────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Toast Notification ── */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] glass-card border border-purple-500/50 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-2xl shadow-purple-900/50 animate-combo-pop">
          {toastMsg}
        </div>
      )}

      {/* ── Level-Up Banner ── */}
      {levelUpMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[998] bg-gradient-to-r from-purple-600 to-amber-500 px-8 py-4 rounded-2xl text-xl font-extrabold text-white shadow-2xl animate-level-pop">
          {levelUpMsg}
        </div>
      )}

      {/* ══════════════ HEADER ══════════════ */}
      <header className="glass-card sticky top-0 z-50 border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <button onClick={() => { sound.playClick(); setView('dashboard'); }}
              className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center text-xl">⚔️</div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wider">APTITUDE <span className="text-gradient-purple">RPG</span></h1>
                <div className="text-[10px] text-amber-400 font-semibold">{profile.equippedTitle}</div>
              </div>
            </button>

            {/* Stats Ticker */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-bold">
              {/* Level + XP bar */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-900/80 px-3 py-1.5 rounded-full border border-purple-500/30">
                <span className="text-purple-300">LVL {profile.level}</span>
                <div className="w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden border border-purple-500/20">
                  <div className="xp-bar h-full rounded-full" style={{ width: `${xpPct}%` }}></div>
                </div>
                <span className="text-gray-500">{xpPct}%</span>
              </div>
              {/* Streak */}
              <div className="bg-orange-950/50 px-3 py-1.5 rounded-full border border-orange-500/30 text-orange-400">
                🔥 {profile.streak}d
              </div>
              {/* Hearts */}
              <div className="bg-red-950/50 px-2 py-1.5 rounded-full border border-red-500/30 flex items-center gap-0.5">
                {Array.from({ length: profile.maxHearts }).map((_, i) =>
                  <span key={i} className={i < profile.hearts ? 'animate-pulse-slow' : 'opacity-30'}>
                    {i < profile.hearts ? '❤️' : '🖤'}
                  </span>
                )}
              </div>
              {/* Coins */}
              <div className="bg-amber-950/50 px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-400">
                🪙 {profile.coins}
              </div>
              {/* Sound toggle */}
              <button
                onClick={() => { const n = !profile.soundEnabled; sound.setEnabled(n); setProfile({ ...profile, soundEnabled: n }); }}
                className="px-2.5 py-1.5 rounded-full glass-card border border-gray-700 text-gray-400 hover:text-white transition-colors"
                title="Toggle SFX">
                {profile.soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar">
            {[
              ['dashboard',  '🏠 Home'],
              ['skill-tree', '🌳 Skills'],
              ['mistakes',   '📖 Mistakes'],
              ['quests',     '🏆 Quests'],
              ['boss',       '🐲 Boss Raid'],
              ['search',     '🔍 Questions'],
              ['shop',       '🛒 Shop'],
              ['stats',      '📊 Stats'],
              ['settings',   '⚙️ Settings'],
            ].map(([id, label]) => (
              <button key={id}
                onClick={() => { sound.playClick(); setView(id); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  view === id
                    ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent'
                }`}>{label}</button>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-6">

        {/* ═══ DASHBOARD ════════════════════════════ */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-purple-500/25 bg-gradient-to-r from-purple-950/40 via-gray-900/60 to-cyan-950/40 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/40">
                    ✨ Rank: {profile.rank}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                    Welcome Back, <span className="text-gradient-gold">{profile.equippedAvatar}</span>
                  </h2>
                  <p className="text-gray-300 text-sm max-w-lg">
                    Ready for today's challenge? Earn XP, protect your streak, and level up your aptitude powers!
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => { sound.playClick(); startQuiz(); }}
                    className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/35 transition-all hover:scale-105">
                    ⚡ Quick Practice
                  </button>
                  <button onClick={() => { sound.playClick(); setView('skill-tree'); }}
                    className="px-5 py-3.5 rounded-2xl glass-card border border-gray-700 hover:border-purple-500/50 text-gray-200 font-semibold transition-all">
                    🌳 Skill Tree
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Level', value: `LVL ${profile.level}`, sub: `${profile.xp}/${profile.xpToNextLevel} XP`, color: 'border-purple-500/20', val: 'text-purple-400' },
                { label: 'Streak', value: `${profile.streak} Days`, sub: `Best: ${profile.longestStreak}d`, color: 'border-orange-500/20', val: 'text-orange-400' },
                { label: 'Accuracy', value: `${profile.accuracyPct}%`, sub: `${profile.totalCorrect}/${profile.totalSolved} correct`, color: 'border-emerald-500/20', val: 'text-emerald-400' },
                { label: 'Coins', value: `🪙 ${profile.coins}`, sub: 'Total Gold earned', color: 'border-amber-500/20', val: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className={`glass-card rounded-2xl p-4 border ${s.color}`}>
                  <div className="text-xs text-gray-400">{s.label}</div>
                  <div className={`text-2xl font-extrabold mt-1 ${s.val}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Practice Modes + Right Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                {/* Practice modes grid */}
                <div className="glass-card rounded-3xl p-5 border border-gray-800 space-y-3">
                  <h3 className="font-bold text-base text-white">⚔️ Practice Modes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: '✨', label: 'Topic Practice',       sub: 'Target a specific skill node.',        action: () => setView('skill-tree'),    color: 'bg-purple-500/10 border-purple-500/20' },
                      { icon: '⏱️', label: 'Timed Sprint',         sub: '30s per question. +Timed XP bonus.',  action: () => startQuiz(),              color: 'bg-amber-500/10 border-amber-500/20' },
                      { icon: '📖', label: 'Mistake Review (SRS)', sub: `${mistakes.filter(m=>!m.mastered).length} mistakes pending.`, action: startMistakeReview, color: 'bg-red-500/10 border-red-500/20' },
                      { icon: '⚡', label: 'Random Mix',           sub: 'Shuffle all topics together.',         action: () => startQuiz(),              color: 'bg-cyan-500/10 border-cyan-500/20' },
                      { icon: '🐲', label: 'Boss Battle Raid',     sub: '30 Qs • 2× XP & Gold! Boss HP: 300.', action: () => { sound.playClick(); setView('boss'); }, color: 'bg-pink-500/10 border-pink-500/30 col-span-2' },
                    ].map(m => (
                      <button key={m.label} onClick={() => { sound.playClick(); m.action(); }}
                        className={`p-4 rounded-2xl border text-left glass-card-hover ${m.color} ${m.color.includes('col-span') ? 'sm:col-span-2' : ''}`}>
                        <div className="text-xl mb-1">{m.icon}</div>
                        <div className="font-bold text-white text-sm">{m.label}</div>
                        <div className="text-xs text-gray-400">{m.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="glass-card rounded-2xl p-5 border border-gray-800 flex items-start gap-3">
                  <span className="text-2xl opacity-50">💬</span>
                  <div>
                    <p className="text-gray-200 text-sm italic">"{quote.quote}"</p>
                    <span className="text-xs text-purple-400 font-semibold mt-1 block">— {quote.author}</span>
                  </div>
                </div>
              </div>

              {/* Right: Daily Quests Preview */}
              <div className="space-y-4">
                <div className="glass-card rounded-3xl p-5 border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-white">🏆 Daily Quests</h3>
                    <button onClick={() => { sound.playClick(); setView('quests'); }} className="text-xs text-purple-400">View All →</button>
                  </div>
                  {QUEST_TEMPLATES.slice(0, 3).map(q => {
                    const s = questMap[q.id] || { current: 0, completed: false };
                    const pct = Math.min(100, (s.current / q.target) * 100);
                    return (
                      <div key={q.id} className="space-y-1.5 p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-200">{q.title}</span>
                          <span className="text-amber-400">+{q.xpReward} XP</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="text-[10px] text-gray-500">{s.current}/{q.target}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Mistakes preview */}
                <div className="glass-card rounded-3xl p-5 border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-white">📖 Mistakes</h3>
                    <button onClick={() => { sound.playClick(); setView('mistakes'); }} className="text-xs text-purple-400">Journal →</button>
                  </div>
                  {mistakes.filter(m => !m.mastered).length === 0
                    ? <div className="text-xs text-emerald-400 py-4 text-center">✅ All clear! Zero pending mistakes.</div>
                    : mistakes.filter(m => !m.mastered).slice(0, 2).map(m => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs">
                        <div className="font-semibold text-gray-200 line-clamp-2">{m.question.question}</div>
                        <div className="text-red-400 text-[10px] mt-0.5">Wrong ×{m.timesWrong}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SKILL TREE ═══════════════════════════ */}
        {view === 'skill-tree' && (
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-purple-500/20 bg-gradient-to-r from-purple-950/30 via-gray-900 to-indigo-950/30 space-y-4">
              <h2 className="text-2xl font-extrabold text-white">🌳 RPG Skill Tree</h2>
              <p className="text-gray-300 text-sm">Select a subtopic node to practice. Each solved question grows your mastery percentage.</p>
            </div>

            {['Arithmetic', 'Logical', 'Verbal', 'Data Interpretation'].map(cat => (
              <div key={cat} className="space-y-3">
                <h3 className="text-lg font-extrabold text-purple-300 border-b border-gray-800 pb-2">{cat}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEFAULT_SKILL_NODES.filter(n => n.category === cat).map(node => {
                    const data   = skillMap[node.id] || { solved: 0, correct: 0, xp: 0 };
                    const acc    = data.solved > 0 ? Math.round((data.correct / data.solved) * 100) : 0;
                    const mastery= Math.min(100, Math.round((data.solved / 10) * 100));
                    return (
                      <div key={node.id} className={`glass-card rounded-2xl p-5 border glass-card-hover flex flex-col justify-between gap-4 ${mastery >= 100 ? 'border-emerald-500/35' : 'border-gray-800'}`}>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-gray-900 border border-purple-500/30 flex items-center justify-center text-xl">{node.icon}</div>
                            <div>
                              <div className="font-bold text-white text-sm">{node.name}</div>
                              <div className="text-[10px] text-gray-400">{mastery}% Mastery • +{data.xp} XP</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{node.description}</p>
                          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-full rounded-full ${mastery >= 100 ? 'bg-emerald-500' : 'bg-purple-500'}`} style={{ width: `${mastery}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>{data.solved} Solved</span><span>{acc}% Acc</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { sound.playClick(); startQuiz(node.name); }}
                          className="w-full py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs border border-purple-500/35 transition-all">
                          ▶ Practice {node.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ QUIZ ══════════════════════════════════ */}
        {view === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-5 relative">
            {/* Flying XP */}
            {xpFly && (
              <div className="absolute top-4 right-4 z-50 text-2xl font-black text-amber-300 animate-xp-fly pointer-events-none drop-shadow-lg">
                +{xpFly} XP ⚡
              </div>
            )}

            {/* Boss HP Bar */}
            {isBoss && (
              <div className="glass-card rounded-2xl p-4 border border-pink-500/40 space-y-2">
                <div className="flex justify-between text-xs font-bold text-pink-300">
                  <span>🐲 CHRONOS THE MATH OVERLORD</span><span>{bossHp}/300 HP</span>
                </div>
                <div className={`w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-pink-500/30`}>
                  <div className={`bg-pink-500 h-full rounded-full transition-all ${bossHp < 100 ? 'animate-danger' : ''}`}
                    style={{ width: `${(bossHp/300)*100}%` }}></div>
                </div>
                {/* Combat log */}
                <div className="mt-1 space-y-0.5 font-mono text-[10px] text-gray-400">
                  {bossLog.slice(0,2).map((l,i) => <div key={i}>{l}</div>)}
                </div>
              </div>
            )}

            {/* Hearts + Combo header */}
            <div className="glass-card rounded-2xl p-3 border border-gray-800 flex items-center justify-between text-xs font-bold">
              <span className="text-gray-400">Q {qIdx + 1} / {quizQ.length}</span>
              {combo > 1 && (
                <span className="animate-combo-pop bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 px-3 py-1 rounded-full">
                  ⚡ COMBO ×{combo}
                </span>
              )}
              <div className="flex gap-0.5">
                {Array.from({ length: profile.maxHearts }).map((_, i) =>
                  <span key={i}>{i < profile.hearts ? '❤️' : '🖤'}</span>
                )}
              </div>
            </div>

            {/* Question Card */}
            {quizQ[qIdx] && (() => {
              const q   = quizQ[qIdx];
              const dc  = q.difficulty === 'easy' ? 'text-emerald-400' : q.difficulty === 'medium' ? 'text-amber-400' : 'text-red-400';
              return (
                <div className="glass-card rounded-3xl p-6 md:p-8 border border-purple-500/20 space-y-6">
                  {/* Topic breadcrumb */}
                  <div className={`text-xs font-bold uppercase tracking-wider ${dc}`}>
                    {q.topic} › {q.subtopic} <span className="ml-1 capitalize">({q.difficulty})</span>
                  </div>

                  <h3 className="text-lg md:text-xl font-extrabold text-white leading-relaxed">{q.question}</h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {q.options.map((opt, i) => {
                      const isSel     = selOpt === i;
                      const isCorrect = i === q.correctIndex;
                      let style = 'border-gray-800 glass-card-hover text-gray-200';
                      if (submitted) {
                        if (isCorrect)           style = 'border-emerald-500 bg-emerald-950/60 text-emerald-200';
                        else if (isSel)          style = 'border-red-500 bg-red-950/60 text-red-200 animate-shake';
                        else                     style = 'opacity-30 border-gray-900';
                      } else if (isSel)          style = 'border-purple-500 bg-purple-950/50 text-white';

                      return (
                        <button key={i} disabled={submitted}
                          onClick={() => { sound.playClick(); setSelOpt(i); }}
                          className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all ${style}`}>
                          <span className="font-extrabold mr-2">{String.fromCharCode(65+i)}.</span>{opt}
                          {submitted && isCorrect && <span className="ml-2">✅</span>}
                          {submitted && isSel && !isCorrect && <span className="ml-2">❌</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {submitted && (
                    <div className="p-4 rounded-2xl bg-gray-900/90 border border-purple-500/30 text-xs space-y-1">
                      <span className="font-bold text-purple-300 block">📖 Explanation</span>
                      <p className="text-gray-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-3 pt-1">
                    {!submitted ? (
                      <>
                        <button
                          onClick={() => {
                            if (profile.hearts < 1) return;
                            sound.playClick();
                            setProfile({ ...profile, hearts: profile.hearts - 1 });
                            toast(`💡 Hint: ${q.explanation.split('.')[0]}.`);
                          }}
                          className="px-4 py-3 rounded-2xl glass-card text-amber-400 font-semibold text-xs border border-amber-500/20 hover:border-amber-500/50">
                          💡 Hint (−1 ❤️)
                        </button>
                        <button
                          disabled={selOpt === null}
                          onClick={submitAnswer}
                          className={`flex-1 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                            selOpt === null ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                          }`}>
                          Submit Answer
                        </button>
                      </>
                    ) : (
                      <button onClick={nextQuestion}
                        className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30">
                        Next Question →
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ BOSS VICTORY ═════════════════════════ */}
        {view === 'boss-victory' && (
          <div className="max-w-lg mx-auto glass-card rounded-3xl p-10 border border-purple-500/30 text-center space-y-5 bg-gradient-to-b from-purple-950/40 to-gray-900">
            <div className="text-5xl animate-float mx-auto">👑</div>
            <h2 className="text-3xl font-extrabold text-white">BOSS DEFEATED!</h2>
            <p className="text-purple-300">You vanquished Chronos the Math Overlord! The "Raid Commander" achievement is yours!</p>
            <button onClick={() => { fireConfetti(); setView('dashboard'); }}
              className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-lg shadow-lg shadow-purple-600/40">
              Claim Victory Rewards →
            </button>
          </div>
        )}

        {/* ═══ BOSS BATTLE (Launch Page) ════════════ */}
        {view === 'boss' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-pink-500/30 bg-gradient-to-br from-purple-950/40 to-pink-950/40 text-center space-y-5">
              <div className="text-6xl animate-float">🐲</div>
              <h2 className="text-3xl font-extrabold text-white">Weekly Boss Battle</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Face <span className="text-pink-300 font-bold">Chronos The Math Overlord</span> (300 HP)!<br/>
                Answer correctly to deal damage. Each correct hit awards <span className="text-amber-400 font-bold">2× XP & Coins</span>.<br/>
                Wrong answers cost a heart. Defeat him to earn the <span className="text-purple-300 font-bold">🏅 Raid Commander</span> badge!
              </p>
              <button
                onClick={() => { sound.playBossHit(); startQuiz(null, true); }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-lg shadow-xl shadow-pink-900/50 transition-all hover:scale-105">
                ⚔️ BEGIN RAID
              </button>
            </div>
          </div>
        )}

        {/* ═══ MISTAKES JOURNAL ═════════════════════ */}
        {view === 'mistakes' && (
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-red-500/20 bg-gradient-to-r from-red-950/30 via-gray-900 to-purple-950/30">
              <h2 className="text-2xl font-extrabold text-white">📖 Mistake Journal & SRS</h2>
              <p className="text-gray-300 text-sm mt-1">Every wrong answer is automatically logged here. Review & master them to earn XP!</p>
              <button onClick={startMistakeReview}
                className="mt-4 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md">
                ▶ Start SRS Review ({mistakes.filter(m=>!m.mastered).length} pending)
              </button>
            </div>

            {mistakes.length === 0
              ? <div className="glass-card rounded-3xl p-12 text-center text-emerald-400 font-semibold">✅ Zero mistakes logged! You're on fire!</div>
              : mistakes.map(m => (
                <div key={m.id} className={`glass-card rounded-2xl p-5 border ${m.mastered ? 'border-emerald-500/25 opacity-60' : 'border-gray-800'} space-y-3`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-purple-400 font-semibold">{m.question.topic} › {m.question.subtopic}</div>
                      <div className="font-bold text-white text-sm mt-0.5">{m.question.question}</div>
                    </div>
                    <button
                      onClick={() => setMistakes(prev => prev.map(x => x.id === m.id ? { ...x, mastered: !x.mastered } : x))}
                      className={`text-xs px-3 py-1 rounded-xl font-bold border transition-colors ${m.mastered ? 'text-emerald-400 border-emerald-500/30' : 'text-gray-400 border-gray-700 hover:text-white'}`}>
                      {m.mastered ? '✅ Mastered' : 'Mark Mastered'}
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                    <span className="font-bold text-emerald-400">Correct Answer: </span>
                    <span className="text-gray-200">{m.question.options[m.question.correctIndex]}</span>
                  </div>
                  <div className="text-xs text-gray-300 bg-gray-900/60 p-3 rounded-xl">
                    <span className="font-bold text-purple-300 block">Explanation:</span>{m.question.explanation}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ═══ QUESTS & ACHIEVEMENTS ════════════════ */}
        {view === 'quests' && (
          <div className="space-y-6">
            {/* Daily Quests */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-3">
              <h2 className="text-xl font-extrabold text-white">🏆 Daily Quests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUEST_TEMPLATES.map(q => {
                  const s   = questMap[q.id] || { current: 0, completed: false, claimed: false };
                  const pct = Math.min(100, (s.current / q.target) * 100);
                  return (
                    <div key={q.id} className={`p-4 rounded-2xl border space-y-2 ${s.claimed ? 'opacity-50 border-gray-900' : s.completed ? 'border-amber-500/40 bg-amber-950/20' : 'border-gray-800'}`}>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-200">{q.title}</span>
                        <span className="text-amber-400">+{q.xpReward} XP • +{q.coinReward} 🪙</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{q.description}</div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500">{s.current}/{q.target}</span>
                        {s.completed && !s.claimed && (
                          <button onClick={() => {
                            setQuestMapP(prev => ({ ...prev, [q.id]: { ...prev[q.id], claimed: true } }));
                            setProfile(prev => ({ ...prev, xp: prev.xp + q.xpReward, coins: prev.coins + q.coinReward }));
                            toast(`🎁 Claimed: +${q.xpReward} XP & +${q.coinReward} 🪙`);
                            fireConfetti();
                          }}
                          className="text-xs px-3 py-1 rounded-xl bg-amber-500 text-gray-900 font-extrabold">
                            Claim!
                          </button>
                        )}
                        {s.claimed && <span className="text-xs text-gray-500">Claimed ✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-3">
              <h2 className="text-xl font-extrabold text-white">🏅 RPG Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEFAULT_ACHIEVEMENTS.map(a => {
                  const s = achMap[a.id] || { progress: 0, unlocked: false };
                  return (
                    <div key={a.id} className={`p-4 rounded-2xl border space-y-2 ${s.unlocked ? 'border-purple-500/40 bg-purple-950/20' : 'border-gray-900 opacity-55'}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{a.icon}</span>
                        <div>
                          <div className="font-bold text-white text-sm">{a.title}</div>
                          <div className="text-[10px] text-gray-400">{a.description}</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Progress: {Math.min(s.progress, a.maxProgress)}/{a.maxProgress}</span>
                        <span className="text-purple-400">+{a.xpReward} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ QUESTION SEARCH ══════════════════════ */}
        {view === 'search' && (
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-purple-500/20 space-y-3">
              <h2 className="text-xl font-extrabold text-white">🔍 Question Bank ({DEFAULT_QUESTIONS.length} Questions)</h2>
              <p className="text-gray-300 text-sm">Browse all questions. Add custom questions via Settings › Import JSON.</p>
            </div>
            {DEFAULT_QUESTIONS.map((q, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-gray-800 space-y-2">
                <div className="flex gap-2 text-xs font-bold">
                  <span className="text-purple-400">{q.topic}</span>
                  <span className="text-gray-600">›</span>
                  <span className="text-gray-300">{q.subtopic}</span>
                  <span className={`ml-auto capitalize ${q.difficulty==='easy'?'text-emerald-400':q.difficulty==='medium'?'text-amber-400':'text-red-400'}`}>{q.difficulty}</span>
                </div>
                <div className="font-bold text-white text-sm">{q.question}</div>
                <div className="text-xs text-emerald-400">✅ {q.options[q.correctIndex]}</div>
                <div className="text-xs text-gray-400">{q.explanation}</div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ COSMETIC SHOP ════════════════════════ */}
        {view === 'shop' && (
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-amber-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">🛒 Cosmetic Shop</h2>
                <p className="text-gray-300 text-sm">Spend Gold on Avatars, Titles & Consumables.</p>
              </div>
              <div className="text-2xl font-extrabold text-amber-400 bg-amber-950/50 px-5 py-2 rounded-2xl border border-amber-500/30">
                🪙 {profile.coins} Gold
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHOP_ITEMS.map(item => {
                const owned    = profile.unlockedCosmetics.includes(item.value);
                const equipped = profile.equippedAvatar === item.value || profile.equippedTitle === item.value;
                const canAfford= profile.coins >= item.price;
                return (
                  <div key={item.id} className={`glass-card rounded-2xl p-5 border flex flex-col justify-between gap-4 ${equipped ? 'border-amber-500/40' : 'border-gray-800'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-900 border border-amber-500/20 flex items-center justify-center text-2xl">{item.icon}</div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                        {!owned && <div className="text-sm font-extrabold text-amber-400 mt-1">🪙 {item.price}</div>}
                      </div>
                    </div>
                    {owned ? (
                      <button disabled={equipped}
                        onClick={() => {
                          sound.playClick();
                          const upd = { ...profile };
                          if (item.type === 'avatar') upd.equippedAvatar = item.value;
                          if (item.type === 'title')  upd.equippedTitle  = item.value;
                          setProfile(upd);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold ${equipped ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
                        {equipped ? '✨ Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button disabled={!canAfford}
                        onClick={() => {
                          if (!canAfford) return;
                          sound.playLevelUp();
                          let upd = { ...profile, coins: profile.coins - item.price, unlockedCosmetics: [...profile.unlockedCosmetics, item.value] };
                          if (item.type === 'avatar') upd.equippedAvatar = item.value;
                          if (item.type === 'title')  upd.equippedTitle  = item.value;
                          if (item.value === 'refill_hearts') upd.hearts = upd.maxHearts;
                          setProfile(upd);
                          toast(`🎉 Purchased "${item.name}"!`);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-gray-900' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                        {canAfford ? '🛒 Buy & Equip' : 'Not enough Gold'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ STATISTICS ═══════════════════════════ */}
        {view === 'stats' && (
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/20">
              <h2 className="text-xl font-extrabold text-white">📊 Study Statistics</h2>
            </div>

            {/* Top metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: 'Level',         v: `LVL ${profile.level}`,    c: 'text-purple-400' },
                { l: 'Accuracy',      v: `${profile.accuracyPct}%`, c: 'text-emerald-400' },
                { l: 'Total Solved',  v: profile.totalSolved,        c: 'text-cyan-400' },
                { l: 'Current Streak',v: `${profile.streak} days`,   c: 'text-orange-400' },
              ].map(s => (
                <div key={s.l} className="glass-card rounded-2xl p-4 border border-gray-800 text-center">
                  <div className="text-xs text-gray-400">{s.l}</div>
                  <div className={`text-2xl font-extrabold mt-1 ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Topic Mastery Heatmap */}
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
              <h3 className="font-bold text-base text-white">Topic Mastery Progress</h3>
              {['Arithmetic', 'Logical', 'Verbal', 'Data Interpretation'].map(cat => {
                const nodes = DEFAULT_SKILL_NODES.filter(n => n.category === cat);
                const total = nodes.reduce((a, n) => a + (skillMap[n.id]?.solved || 0), 0);
                const correct = nodes.reduce((a, n) => a + (skillMap[n.id]?.correct || 0), 0);
                const acc = total > 0 ? Math.round((correct/total)*100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-300">
                      <span>{cat}</span><span className="text-purple-400">{acc}% Accuracy ({total} solved)</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden border border-gray-800">
                      <div className="bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${acc}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═════════════════════════════ */}
        {view === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-1">
              <h2 className="text-xl font-extrabold text-white">⚙️ Settings & Data Hub</h2>
              <p className="text-gray-300 text-sm">Manage preferences, backup, restore, and import custom question banks.</p>
            </div>

            {/* Preferences */}
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-4">
              <h3 className="font-bold text-sm text-white">Preferences</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-200">Sound Effects (Web Audio API)</div>
                  <div className="text-xs text-gray-400">Dynamic RPG SFX — no audio files needed.</div>
                </div>
                <button onClick={() => { const n = !profile.soundEnabled; sound.setEnabled(n); setProfile({ ...profile, soundEnabled: n }); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${profile.soundEnabled ? 'bg-purple-600/25 text-purple-300 border-purple-500/40' : 'glass-card text-gray-500 border-gray-700'}`}>
                  {profile.soundEnabled ? '🔊 Enabled' : '🔇 Muted'}
                </button>
              </div>
            </div>

            {/* Data Hub */}
            <div className="glass-card rounded-3xl p-6 border border-gray-800 space-y-3">
              <h3 className="font-bold text-sm text-white">Data Hub (LocalStorage)</h3>

              {/* Export */}
              <button onClick={() => {
                const data = JSON.stringify({ profile, skillMap, achMap, questMap, mistakes }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url  = URL.createObjectURL(blob);
                const a    = document.createElement('a'); a.href = url;
                a.download = `aptitude_rpg_backup_${todayStr()}.json`; a.click();
                URL.revokeObjectURL(url);
                toast('📥 Backup exported!');
              }}
              className="w-full p-4 rounded-2xl glass-card-hover border border-purple-500/25 text-left flex justify-between items-center">
                <div><div className="font-bold text-white text-sm">📥 Export Backup JSON</div>
                <div className="text-xs text-gray-400">Download all progress as a .json file.</div></div>
                <span className="text-purple-400 text-xl">↓</span>
              </button>

              {/* Import Backup */}
              <label className="w-full p-4 rounded-2xl glass-card-hover border border-cyan-500/25 cursor-pointer flex justify-between items-center">
                <div><div className="font-bold text-white text-sm">📤 Restore Backup JSON</div>
                <div className="text-xs text-gray-400">Upload a backup file to restore all data.</div></div>
                <span className="text-cyan-400 text-xl">↑</span>
                <input type="file" accept=".json" className="hidden" onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const data = JSON.parse(ev.target.result);
                      if (data.profile) {
                        if (data.profile)   setProfile(data.profile);
                        if (data.skillMap)  setSkillMap(data.skillMap);
                        if (data.achMap)    setAchMap(data.achMap);
                        if (data.questMap)  setQuestMapP(data.questMap);
                        if (data.mistakes)  setMistakes(data.mistakes);
                        toast('✅ Backup restored!');
                      }
                    } catch { toast('❌ Invalid JSON file.'); }
                  };
                  reader.readAsText(file);
                }} />
              </label>

              {/* Import Questions */}
              <label className="w-full p-4 rounded-2xl glass-card-hover border border-emerald-500/25 cursor-pointer flex justify-between items-center">
                <div><div className="font-bold text-white text-sm">➕ Import Custom Questions</div>
                <div className="text-xs text-gray-400">Upload a JSON array of question objects to expand the bank.</div></div>
                <span className="text-emerald-400 text-xl">+</span>
                <input type="file" accept=".json" className="hidden" onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const qs = JSON.parse(ev.target.result);
                      if (Array.isArray(qs)) { toast(`✅ ${qs.length} custom questions imported! Reload to see.`); }
                      else toast('❌ File must be a JSON array.');
                    } catch { toast('❌ Invalid JSON.'); }
                  };
                  reader.readAsText(file);
                }} />
              </label>
            </div>

            {/* Danger Zone */}
            <div className="glass-card rounded-3xl p-6 border border-red-500/25 bg-red-950/10 space-y-3">
              <h3 className="font-bold text-sm text-red-400">⚠️ Danger Zone</h3>
              <p className="text-xs text-gray-300">This will permanently erase all XP, levels, mistakes, coins, and progress.</p>
              <button onClick={() => {
                if (confirm('Are you sure? This will permanently reset ALL progress back to Level 1!')) {
                  localStorage.clear(); window.location.reload();
                }
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-red-300 border border-red-500/35 hover:bg-red-900/60 transition-colors">
                🗑️ Reset All Progress
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="glass-card border-t border-gray-800/80 py-4 text-center text-xs text-gray-600 mt-auto">
        APTITUDE RPG • Single-Player Offline Learning Application • Powered by LocalStorage + Web Audio API
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
