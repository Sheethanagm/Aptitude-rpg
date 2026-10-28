const DEFAULT_QUESTIONS = [
  // ── ARITHMETIC ──────────────────────────────────────
  {
    id: 'q_arith_01', topic: 'Arithmetic', subtopic: 'Percentages', difficulty: 'easy',
    question: 'If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that the expenditure remains unchanged?',
    options: ['15%', '20%', '25%', '30%'],
    correctIndex: 1,
    explanation: 'Formula: [r / (100 + r)] × 100 = [25 / 125] × 100 = 20% reduction needed.',
    tags: ['percentage', 'expenditure', 'consumption']
  },
  {
    id: 'q_arith_02', topic: 'Arithmetic', subtopic: 'Percentages', difficulty: 'medium',
    question: 'A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?',
    options: ['36%', '44%', '64%', '54%'],
    correctIndex: 2,
    explanation: 'Let number = 15. Expected = 15×(5/3)=25. Got = 15×(3/5)=9. Error = (25−9)/25 × 100 = 64%.',
    tags: ['percentage', 'error', 'fraction']
  },
  {
    id: 'q_arith_03', topic: 'Arithmetic', subtopic: 'Ratio', difficulty: 'easy',
    question: 'Two numbers are in ratio 3:5. If 9 is subtracted from each, the new ratio is 12:23. Find the smaller number.',
    options: ['27', '33', '49', '55'],
    correctIndex: 1,
    explanation: 'Let numbers = 3x, 5x. (3x−9)/(5x−9) = 12/23 → 9x = 99 → x = 11. Smaller = 3×11 = 33.',
    tags: ['ratio', 'algebra']
  },
  {
    id: 'q_arith_04', topic: 'Arithmetic', subtopic: 'Profit & Loss', difficulty: 'medium',
    question: 'A trader sells two items at ₹600 each. On one he gains 20% and on the other he loses 20%. What is his overall percentage result?',
    options: ['No profit no loss', '2% loss', '4% loss', '4% profit'],
    correctIndex: 2,
    explanation: 'Same SP, one at x% gain and x% loss → Overall loss = (x/10)² % = (20/10)² = 4% loss.',
    tags: ['profit', 'loss', 'shortcut']
  },
  {
    id: 'q_arith_05', topic: 'Arithmetic', subtopic: 'Profit & Loss', difficulty: 'hard',
    question: 'By selling 45 lemons for ₹40, a man loses 20%. How many lemons should he sell for ₹24 to gain 20%?',
    options: ['16', '18', '20', '22'],
    correctIndex: 1,
    explanation: 'CP of 45 lemons = 40/0.8 = ₹50. CP per lemon = 10/9. To gain 20%, SP per lemon = (10/9)×1.2 = 4/3. Count = 24÷(4/3) = 18.',
    tags: ['profit', 'loss', 'unit-rate']
  },
  {
    id: 'q_arith_06', topic: 'Arithmetic', subtopic: 'Average', difficulty: 'easy',
    question: 'The average age of 30 students is 15 years. If the teacher is included, average becomes 16 years. What is the teacher\'s age?',
    options: ['40', '46', '48', '50'],
    correctIndex: 1,
    explanation: '30×15 = 450. 31×16 = 496. Teacher age = 496−450 = 46 years.',
    tags: ['average', 'age']
  },
  {
    id: 'q_arith_07', topic: 'Arithmetic', subtopic: 'Time & Work', difficulty: 'medium',
    question: 'A can finish a task in 12 days and B in 18 days. They work together for 4 days, then A leaves. How many more days does B need to finish?',
    options: ['6 days', '8 days', '10 days', '12 days'],
    correctIndex: 1,
    explanation: 'Combined rate = 1/12+1/18 = 5/36. Work in 4 days = 20/36 = 5/9. Remaining = 4/9. B\'s time = (4/9)÷(1/18) = 8 days.',
    tags: ['time-and-work', 'rate']
  },
  {
    id: 'q_arith_08', topic: 'Arithmetic', subtopic: 'Time Speed Distance', difficulty: 'medium',
    question: 'A train 150 m long passes a telegraph post in 12 seconds. What is its speed in km/h?',
    options: ['36 km/h', '45 km/h', '50 km/h', '54 km/h'],
    correctIndex: 1,
    explanation: 'Speed = 150/12 = 12.5 m/s. Convert: 12.5 × 18/5 = 45 km/h.',
    tags: ['speed', 'train']
  },
  {
    id: 'q_arith_09', topic: 'Arithmetic', subtopic: 'Mixtures', difficulty: 'hard',
    question: 'In 60 L of milk-water mixture, ratio of milk:water is 2:1. How much water must be added to make ratio 1:2?',
    options: ['40 L', '60 L', '80 L', '90 L'],
    correctIndex: 1,
    explanation: 'Milk = 40 L, Water = 20 L. Let water added = W. 40/(20+W) = 1/2 → W = 60 L.',
    tags: ['mixtures', 'ratio']
  },
  {
    id: 'q_arith_10', topic: 'Arithmetic', subtopic: 'Ages', difficulty: 'easy',
    question: 'Father is 4× as old as son. In 20 years, he will be 2× as old. What is the son\'s present age?',
    options: ['8 years', '10 years', '12 years', '15 years'],
    correctIndex: 1,
    explanation: 'Son = x, Father = 4x. In 20 years: 4x+20 = 2(x+20) → 2x = 20 → x = 10.',
    tags: ['ages', 'algebra']
  },
  {
    id: 'q_arith_11', topic: 'Arithmetic', subtopic: 'Number System', difficulty: 'medium',
    question: 'Find the largest 4-digit number exactly divisible by 12, 15, 18, and 27.',
    options: ['9680', '9720', '9840', '9910'],
    correctIndex: 1,
    explanation: 'LCM(12,15,18,27) = 540. 9999 ÷ 540 = 18 rem 279. Answer = 9999−279 = 9720.',
    tags: ['lcm', 'divisibility', 'number-system']
  },

  // ── LOGICAL REASONING ────────────────────────────────
  {
    id: 'q_log_01', topic: 'Logical', subtopic: 'Blood Relations', difficulty: 'easy',
    question: 'Pointing to a photo, a man says "I have no brother or sister but that man\'s father is my father\'s son." Whose photo is it?',
    options: ['His nephew', 'His son', 'His father', 'His own'],
    correctIndex: 1,
    explanation: '"My father\'s son" with no siblings = himself. So "that man\'s father = me" → photo is his SON.',
    tags: ['blood-relations', 'deduction']
  },
  {
    id: 'q_log_02', topic: 'Logical', subtopic: 'Blood Relations', difficulty: 'medium',
    question: 'A + B = A is brother of B. A − B = A is sister of B. A × B = A is father of B. Which shows P is uncle of Q?',
    options: ['P + R × Q', 'P × R + Q', 'P − R × Q', 'Q + R × P'],
    correctIndex: 0,
    explanation: 'P + R × Q: P is brother of R, R is father of Q → P is uncle of Q. ✓',
    tags: ['blood-relations', 'symbol-coding']
  },
  {
    id: 'q_log_03', topic: 'Logical', subtopic: 'Seating Arrangement', difficulty: 'medium',
    question: 'A, B, C, D, E sit in a circle facing centre. A is between E and C. B is to immediate right of E. Who sits immediately right of A?',
    options: ['B', 'C', 'D', 'E'],
    correctIndex: 1,
    explanation: 'Clockwise arrangement: E → B → D → C → A → E. Right of A (facing centre) = C.',
    tags: ['seating', 'circular', 'arrangement']
  },
  {
    id: 'q_log_04', topic: 'Logical', subtopic: 'Coding', difficulty: 'easy',
    question: 'In a code, COMPUTER = RFUVQNPC. How is MEDICINE coded?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEDJJOE'],
    correctIndex: 0,
    explanation: 'Reverse the word; inner letters shift +1. Reverse MEDICINE = ENICIDEM → inner letters +1 → EOJDJEFM.',
    tags: ['coding', 'decoding', 'cipher']
  },
  {
    id: 'q_log_05', topic: 'Logical', subtopic: 'Series', difficulty: 'medium',
    question: 'Find next term: 3, 7, 15, 31, 63, ?',
    options: ['95', '115', '127', '143'],
    correctIndex: 2,
    explanation: 'Pattern: term × 2 + 1. 63×2+1 = 127.',
    tags: ['series', 'pattern']
  },
  {
    id: 'q_log_06', topic: 'Logical', subtopic: 'Series', difficulty: 'hard',
    question: 'Find missing: 2, 6, 12, 20, 30, ?, 56',
    options: ['36', '40', '42', '45'],
    correctIndex: 2,
    explanation: 'Terms = n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42, 7×8=56.',
    tags: ['series', 'n(n+1)']
  },
  {
    id: 'q_log_07', topic: 'Logical', subtopic: 'Direction', difficulty: 'easy',
    question: 'A walks 5 km North, turns right and walks 3 km, turns right and walks 5 km. How far and in which direction from start?',
    options: ['3 km East', '3 km West', '5 km South', '8 km North'],
    correctIndex: 0,
    explanation: '(0,0) → N 5km → (0,5) → E 3km → (3,5) → S 5km → (3,0). Distance from origin = 3 km East.',
    tags: ['direction', 'navigation']
  },
  {
    id: 'q_log_08', topic: 'Logical', subtopic: 'Calendar', difficulty: 'medium',
    question: 'If Jan 1, 2004 was Thursday, what day was Jan 1, 2005?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
    correctIndex: 1,
    explanation: '2004 is a leap year (366 days = 52 weeks + 2 odd days). Thursday + 2 = Saturday.',
    tags: ['calendar', 'odd-days', 'leap-year']
  },
  {
    id: 'q_log_09', topic: 'Logical', subtopic: 'Clocks', difficulty: 'hard',
    question: 'What is the angle between clock hands at 3 hours 40 minutes?',
    options: ['120°', '130°', '140°', '150°'],
    correctIndex: 1,
    explanation: 'Angle = |30H − 5.5M| = |30×3 − 5.5×40| = |90 − 220| = 130°.',
    tags: ['clocks', 'angle-formula']
  },
  {
    id: 'q_log_10', topic: 'Logical', subtopic: 'Cubes', difficulty: 'medium',
    question: 'A 3 cm cube is painted red on all sides and cut into 1 cm³ cubes. How many small cubes have exactly 2 sides painted?',
    options: ['8', '12', '18', '24'],
    correctIndex: 1,
    explanation: 'Formula: 12(n−2) = 12(3−2) = 12 cubes. These are on the edges.',
    tags: ['cubes', 'geometry', 'painted']
  },

  // ── VERBAL ────────────────────────────────────────────
  {
    id: 'q_verb_01', topic: 'Verbal', subtopic: 'Vocabulary', difficulty: 'easy',
    question: '"His ________ speeches inspired thousands to vote." Choose the best word.',
    options: ['eloquent', 'lethargic', 'monotonous', 'obscure'],
    correctIndex: 0,
    explanation: 'Eloquent = fluent and persuasive in speaking or writing.',
    tags: ['vocabulary', 'fill-blank']
  },
  {
    id: 'q_verb_02', topic: 'Verbal', subtopic: 'Synonyms', difficulty: 'easy',
    question: 'Choose the synonym of PRAGMATIC.',
    options: ['Theoretical', 'Practical', 'Idealistic', 'Arrogant'],
    correctIndex: 1,
    explanation: 'Pragmatic = sensible and practical, dealing with real situations.',
    tags: ['synonym']
  },
  {
    id: 'q_verb_03', topic: 'Verbal', subtopic: 'Antonyms', difficulty: 'medium',
    question: 'Choose the antonym of CANDID.',
    options: ['Frank', 'Deceitful', 'Honest', 'Outspoken'],
    correctIndex: 1,
    explanation: 'Candid = truthful, honest. Antonym = Deceitful.',
    tags: ['antonym']
  },
  {
    id: 'q_verb_04', topic: 'Verbal', subtopic: 'Grammar', difficulty: 'medium',
    question: 'Find the error: "Neither of the two candidates have submitted their documents on time."',
    options: ['Neither of', 'the two candidates', 'have submitted', 'their documents'],
    correctIndex: 2,
    explanation: '"Neither" is singular → verb must be "has submitted", not "have submitted".',
    tags: ['grammar', 'subject-verb-agreement']
  },
  {
    id: 'q_verb_05', topic: 'Verbal', subtopic: 'Reading', difficulty: 'hard',
    question: 'Passage: "AI does not threaten human creativity; rather, it augments it by handling repetitive tasks." Main conclusion?',
    options: [
      'AI will replace human artists completely.',
      'AI serves as a complementary tool for human creativity.',
      'Repetitive tasks are essential for growth.',
      'Human creativity cannot be augmented.'
    ],
    correctIndex: 1,
    explanation: 'The passage says AI "augments" creativity, making it a complementary tool, not a replacement.',
    tags: ['reading', 'comprehension', 'inference']
  },
  {
    id: 'q_verb_06', topic: 'Verbal', subtopic: 'Para Jumbles', difficulty: 'medium',
    question: 'Arrange logically:\nP: Technology has transformed education.\nQ: Students can now access vast digital libraries.\nR: This shift made remote learning accessible worldwide.\nS: Traditional classrooms are no longer the sole learning space.',
    options: ['P-Q-S-R', 'P-S-Q-R', 'Q-P-S-R', 'S-P-Q-R'],
    correctIndex: 0,
    explanation: 'P (intro) → Q (how?) → S (impact on classrooms) → R (global result).',
    tags: ['para-jumbles', 'coherence']
  },

  // ── DATA INTERPRETATION ──────────────────────────────
  {
    id: 'q_di_01', topic: 'Data Interpretation', subtopic: 'Pie Charts', difficulty: 'medium',
    question: 'Company budget: R&D 25%, Marketing 30%, Salaries 20%, Ops 15%, Others 10%. Total = ₹50,00,000. How much more on R&D+Marketing than Salaries?',
    options: ['₹15,00,000', '₹17,50,000', '₹20,00,000', '₹22,50,000'],
    correctIndex: 1,
    explanation: '(25+30)%−20% = 35%. 35% of ₹50,00,000 = ₹17,50,000.',
    tags: ['pie-chart', 'percentage', 'DI']
  },
  {
    id: 'q_di_02', topic: 'Data Interpretation', subtopic: 'Tables', difficulty: 'easy',
    question: 'Table shows monthly sales:\nProduct A: Jan=120, Feb=150, Mar=180\nProduct B: Jan=90,  Feb=110, Mar=130\nWhat is total Q1 sales of Product A?',
    options: ['410', '450', '480', '500'],
    correctIndex: 1,
    explanation: '120 + 150 + 180 = 450 units.',
    tags: ['tables', 'DI', 'summation']
  },
  {
    id: 'q_di_03', topic: 'Data Interpretation', subtopic: 'Graphs', difficulty: 'medium',
    question: 'Bar graph scores: Physics=80, Chemistry=70, Maths=90, Biology=60. What % contribution does Maths make to total?',
    options: ['25%', '30%', '35%', '40%'],
    correctIndex: 1,
    explanation: 'Total = 300. Maths = 90. 90/300 × 100 = 30%.',
    tags: ['bar-graph', 'DI', 'percentage']
  },
  {
    id: 'q_di_04', topic: 'Data Interpretation', subtopic: 'Caselets', difficulty: 'hard',
    question: 'In an IT dept of 200 employees, 60% know Python, 50% know Java, 30% know both. How many know NEITHER?',
    options: ['20', '40', '60', '80'],
    correctIndex: 1,
    explanation: 'At least one = 60+50−30 = 80%. Neither = 20%. 20% of 200 = 40 employees.',
    tags: ['caselet', 'venn-diagram', 'DI']
  }
];

// ── RPG Skill Nodes ──────────────────────────────────────
const DEFAULT_SKILL_NODES = [
  // Arithmetic
  { id: 'sk_arith_01', name: 'Percentages',          category: 'Arithmetic',          icon: '%',  description: 'Increase, decrease, expenditure & error %.' },
  { id: 'sk_arith_02', name: 'Ratio & Proportion',   category: 'Arithmetic',          icon: '⚖️', description: 'Proportional division & scale problems.' },
  { id: 'sk_arith_03', name: 'Profit & Loss',        category: 'Arithmetic',          icon: '📈', description: 'CP, SP, discount & margin calculations.' },
  { id: 'sk_arith_04', name: 'Average',              category: 'Arithmetic',          icon: '📊', description: 'Weighted averages & missing terms.' },
  { id: 'sk_arith_05', name: 'Time & Work',          category: 'Arithmetic',          icon: '⏱️', description: 'Efficiency, pipes & cisterns.' },
  { id: 'sk_arith_06', name: 'Time Speed Distance',  category: 'Arithmetic',          icon: '🚀', description: 'Relative speed, trains & boats.' },
  { id: 'sk_arith_07', name: 'Mixtures',             category: 'Arithmetic',          icon: '🧪', description: 'Concentrations & replacement.' },
  { id: 'sk_arith_08', name: 'Ages',                 category: 'Arithmetic',          icon: '⏳', description: 'Past, present & future age relations.' },
  { id: 'sk_arith_09', name: 'Number System',        category: 'Arithmetic',          icon: '🔢', description: 'LCM, HCF, remainders & divisibility.' },
  // Logical
  { id: 'sk_log_01',   name: 'Blood Relations',      category: 'Logical',             icon: '🧬', description: 'Family tree & coded relations.' },
  { id: 'sk_log_02',   name: 'Seating Arrangement',  category: 'Logical',             icon: '🪑', description: 'Linear & circular puzzles.' },
  { id: 'sk_log_03',   name: 'Coding & Decoding',    category: 'Logical',             icon: '🔐', description: 'Cipher patterns & letter shifts.' },
  { id: 'sk_log_04',   name: 'Series',               category: 'Logical',             icon: '🧩', description: 'Number & alphabetical series.' },
  { id: 'sk_log_05',   name: 'Direction Sense',      category: 'Logical',             icon: '🧭', description: 'Spatial orientation & distance.' },
  { id: 'sk_log_06',   name: 'Calendar',             category: 'Logical',             icon: '📅', description: 'Odd days & day-of-week.' },
  { id: 'sk_log_07',   name: 'Clocks',               category: 'Logical',             icon: '🕰️', description: 'Hands angles & slow/fast clocks.' },
  { id: 'sk_log_08',   name: 'Cubes & Dice',         category: 'Logical',             icon: '🎲', description: 'Painted cube cuts & opposite faces.' },
  // Verbal
  { id: 'sk_verb_01',  name: 'Vocabulary',           category: 'Verbal',              icon: '📚', description: 'Contextual word usage & fill-ins.' },
  { id: 'sk_verb_02',  name: 'Grammar',              category: 'Verbal',              icon: '✍️', description: 'Error spotting & sentence correction.' },
  { id: 'sk_verb_03',  name: 'Reading Comprehension',category: 'Verbal',              icon: '🔍', description: 'Passage inferences & main ideas.' },
  { id: 'sk_verb_04',  name: 'Synonyms',             category: 'Verbal',              icon: '💡', description: 'Words with similar meanings.' },
  { id: 'sk_verb_05',  name: 'Antonyms',             category: 'Verbal',              icon: '☯️', description: 'Words with opposite meanings.' },
  { id: 'sk_verb_06',  name: 'Para Jumbles',         category: 'Verbal',              icon: '🔀', description: 'Sentence ordering & coherence.' },
  // Data Interpretation
  { id: 'sk_di_01',    name: 'Pie Charts',           category: 'Data Interpretation', icon: '🍕', description: 'Sector angles & percentage splits.' },
  { id: 'sk_di_02',    name: 'Tables',               category: 'Data Interpretation', icon: '📋', description: 'Tabular data extraction & comparisons.' },
  { id: 'sk_di_03',    name: 'Line & Bar Graphs',    category: 'Data Interpretation', icon: '📊', description: 'Trends & comparative analysis.' },
  { id: 'sk_di_04',    name: 'Caselets & Sets',      category: 'Data Interpretation', icon: '📑', description: 'Paragraph data & Venn diagrams.' },
];

// ── Achievements ─────────────────────────────────────────
const DEFAULT_ACHIEVEMENTS = [
  { id: 'ach_01', icon: '🎯', title: 'First Steps',         description: 'Solve your first question.',              maxProgress: 1,    xpReward: 25,  coinReward: 20 },
  { id: 'ach_02', icon: '🥉', title: 'Novice Scholar',      description: 'Solve 10 questions.',                     maxProgress: 10,   xpReward: 50,  coinReward: 50 },
  { id: 'ach_03', icon: '🥈', title: 'Century Slayer',      description: 'Solve 100 questions.',                    maxProgress: 100,  xpReward: 250, coinReward: 200 },
  { id: 'ach_04', icon: '💎', title: 'Flawless Victory',    description: 'Score 100% on a quiz (min 5 questions).', maxProgress: 1,    xpReward: 100, coinReward: 100 },
  { id: 'ach_05', icon: '🔥', title: 'Ignition',            description: 'Maintain a 3-day streak.',                maxProgress: 3,    xpReward: 75,  coinReward: 50 },
  { id: 'ach_06', icon: '⚡', title: 'Unstoppable Flame',   description: 'Maintain a 7-day streak.',                maxProgress: 7,    xpReward: 200, coinReward: 150 },
  { id: 'ach_07', icon: '🐲', title: 'Raid Commander',      description: 'Defeat the Weekly Boss Battle.',          maxProgress: 1,    xpReward: 500, coinReward: 300 },
  { id: 'ach_08', icon: '🧮', title: 'Math Overlord',       description: 'Solve 20 Arithmetic questions.',          maxProgress: 20,   xpReward: 300, coinReward: 200 },
  { id: 'ach_09', icon: '🧠', title: 'Mind Weaver',         description: 'Solve 20 Logical questions.',             maxProgress: 20,   xpReward: 300, coinReward: 200 },
  { id: 'ach_10', icon: '👑', title: 'Grandmaster Scholar', description: 'Reach Player Level 10.',                  maxProgress: 10,   xpReward: 400, coinReward: 300 },
];

// ── Daily Quests Template ────────────────────────────────
const QUEST_TEMPLATES = [
  { id: 'qst_01', title: 'Daily Warmup',      description: 'Solve 10 questions in any mode.',        target: 10, xpReward: 50,  coinReward: 30,  category: 'general' },
  { id: 'qst_02', title: 'Sharpshooter',      description: 'Get 5 correct answers in a row.',        target: 5,  xpReward: 40,  coinReward: 25,  category: 'combo' },
  { id: 'qst_03', title: 'Arithmetic Grind',  description: 'Solve 5 Arithmetic questions.',           target: 5,  xpReward: 35,  coinReward: 20,  category: 'Arithmetic' },
  { id: 'qst_04', title: 'Logic Challenge',   description: 'Solve 5 Logical questions.',              target: 5,  xpReward: 35,  coinReward: 20,  category: 'Logical' },
  { id: 'qst_05', title: 'Verbal Prowess',    description: 'Solve 3 Verbal questions correctly.',     target: 3,  xpReward: 30,  coinReward: 15,  category: 'Verbal' },
];

// ── Daily Motivational Quotes ────────────────────────────
const DAILY_QUOTES = [
  { quote: "Success in aptitude exams is about consistency and pattern recognition, not genius.", author: "Aptitude RPG" },
  { quote: "Every level up here is a step closer to cracking your dream placement.", author: "RPG Mentor" },
  { quote: "Mistakes are just raw XP waiting to be harvested.", author: "Grandmaster Scholar" },
  { quote: "Logic is the sword of the mind. Keep it sharp every single day.", author: "Cyber Knight" },
  { quote: "Consistency transforms average minds into legend-level scholars.", author: "Game Engine" },
  { quote: "The only way to learn mathematics is to do mathematics.", author: "Paul Halmos" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
];

// ── Shop Items ───────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 'shop_avatar_01', name: '⚔️ Cyber Knight',   type: 'avatar', price: 0,   icon: '⚔️', description: 'Default warrior of logic.',             value: '⚔️ Cyber Knight' },
  { id: 'shop_avatar_02', name: '🔮 Spell Weaver',   type: 'avatar', price: 100, icon: '🔮', description: 'Master of formulas and magic.',          value: '🔮 Spell Weaver' },
  { id: 'shop_avatar_03', name: '🥷 Shadow Ninja',   type: 'avatar', price: 200, icon: '🥷', description: 'Silent, swift, and accurate.',            value: '🥷 Shadow Ninja' },
  { id: 'shop_avatar_04', name: '🐲 Dragon Slayer',  type: 'avatar', price: 350, icon: '🐲', description: 'Conqueror of weekly boss raids.',          value: '🐲 Dragon Slayer' },
  { id: 'shop_avatar_05', name: '🤖 Mecha Overlord', type: 'avatar', price: 500, icon: '🤖', description: 'Futuristic AI computation engine.',        value: '🤖 Mecha Overlord' },
  { id: 'shop_title_01',  name: 'Aptitude Initiate', type: 'title',  price: 0,   icon: '📜', description: 'Starting rank title.',                    value: 'Aptitude Initiate' },
  { id: 'shop_title_02',  name: 'Logic Overlord',    type: 'title',  price: 120, icon: '⚡', description: 'Master of deduction.',                    value: 'Logic Overlord' },
  { id: 'shop_title_03',  name: 'Calculative Deity', type: 'title',  price: 250, icon: '🧮', description: 'Flawless arithmetic executor.',            value: 'Calculative Deity' },
  { id: 'shop_title_04',  name: 'Apex Boss Slayer',  type: 'title',  price: 400, icon: '🏆', description: 'Legendary conqueror.',                    value: 'Apex Boss Slayer' },
  { id: 'shop_item_01',   name: 'Full Heart Refill', type: 'item',   price: 50,  icon: '❤️', description: 'Instantly restore all 5 hearts.',         value: 'refill_hearts' },
];
