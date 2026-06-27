export interface Lesson {
  id: number;
  title: string;
  description: string;
  target: string;
  focusKeys: string[];
  phase: 'home-row' | 'extensions' | 'coordination' | 'numbers-symbols' | 'advanced';
}

// Generates a progressive 500-stage touch typing curriculum
// Starting with home row, individual key sessions, reviews, and dynamic word drills
export const generateCurriculum = (): Lesson[] => {
  const list: Lesson[] = [];
  
  // Progression characters list
  const seq = [
    // Home row keys
    'f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h',
    // Top row keys
    'r', 'u', 'e', 'i', 'w', 'o', 'q', 'p', 't', 'y',
    // Bottom row keys
    'v', 'm', 'c', ',', 'x', '.', 'z', '/', 'b', 'n'
  ];

  let currentCompletedChars: string[] = [];
  let stageCount = 1;

  // Words list categorized for drills
  const allWordPool = [
    "f", "j", "d", "k", "s", "l", "a", "g", "h", "fad", "dad", "lad", "glass", "gash", "dash",
    "has", "had", "ask", "salad", "asdf", "jkl;", "sad", "fall", "all", "shall", "flask", "add",
    "he", "her", "his", "red", "run", "rug", "mud", "radar", "rural", "sugar", "guard", "fruit",
    "kid", "like", "lake", "line", "life", "wife", "wild", "work", "word", "world", "lord", "proud",
    "queen", "quiet", "quack", "page", "pack", "park", "past", "path", "play", "plan", "plant", "term",
    "time", "take", "talk", "task", "tool", "their", "there", "they", "them", "then", "this", "that",
    "cat", "car", "can", "cry", "cold", "come", "call", "city", "class", "clear", "close", "clean",
    "man", "men", "map", "mind", "more", "make", "must", "much", "many", "move", "most", "milk",
    "very", "voice", "visit", "value", "view", "vote", "vent", "vast", "vest", "vivid", "vapor",
    "box", "boy", "but", "big", "bad", "bed", "bag", "bit", "bet", "buy", "bye", "bus", "blue",
    "new", "now", "not", "net", "nut", "zip", "zoo", "zero", "zone", "quiz", "lazy", "maze", "craze"
  ];

  // Helper to filter words that only contain currently completed letters (or space)
  const getDrillWords = (allowed: string[], count = 6): string => {
    const allowedSet = new Set([...allowed, ' ', ';', ',', '.']);
    const matches = allWordPool.filter(w => {
      return w.split('').every(char => allowedSet.has(char));
    });
    const pool = matches.length > 5 ? matches : ['f', 'j', 'd', 'k', 's', 'l', 'a', 'g'];
    
    // Build a drill target string
    const result: string[] = [];
    for (let i = 0; i < count * 2; i++) {
      const randWord = pool[Math.floor(Math.random() * pool.length)];
      result.push(randWord);
    }
    return result.join(' ');
  };

  // Build the curriculum stages progressively up to 500
  for (let step = 0; step < seq.length; step++) {
    const char = seq[step];
    currentCompletedChars.push(char);

    // 1. Individual character stage
    list.push({
      id: stageCount,
      title: `Stage ${stageCount}: Introducing '${char.toUpperCase()}'`,
      description: `Focus on index key '${char.toUpperCase()}' matching drills.`,
      target: Array(8).fill(`${char}${char}${char}`).join(' ') + ` ${char} ${char} ` + Array(4).fill(`${char}${char}`).join(' '),
      focusKeys: [char],
      phase: step < 10 ? 'home-row' : step < 20 ? 'extensions' : 'coordination'
    });
    stageCount++;

    // 2. Space matching with character stage
    list.push({
      id: stageCount,
      title: `Stage ${stageCount}: Space Coordination with '${char.toUpperCase()}'`,
      description: `Develop muscle rhythms pairing '${char.toUpperCase()}' with Space.`,
      target: `${char} ${char} ${char}${char} ${char} ${char}${char}${char} ${char} ${char} ${char}${char}`,
      focusKeys: [char, ' '],
      phase: step < 10 ? 'home-row' : step < 20 ? 'extensions' : 'coordination'
    });
    stageCount++;

    // 3. Review Stage (Cumulative review of current completed characters)
    if (currentCompletedChars.length > 1) {
      const reviews = currentCompletedChars.slice(-4); // Last 4 completed keys
      const revTarget = Array(12).fill(0).map(() => {
        const c1 = reviews[Math.floor(Math.random() * reviews.length)];
        const c2 = reviews[Math.floor(Math.random() * reviews.length)];
        return `${c1}${c2}${c1}`;
      }).join(' ');

      list.push({
        id: stageCount,
        title: `Stage ${stageCount}: Review Drill (${reviews.join(', ').toUpperCase()})`,
        description: `Review muscle memories for last completed keys.`,
        target: revTarget,
        focusKeys: reviews,
        phase: step < 10 ? 'home-row' : step < 20 ? 'extensions' : 'coordination'
      });
      stageCount++;
    }

    // 4. Words Drill Stage (Only using currently completed characters)
    if (currentCompletedChars.length >= 3) {
      list.push({
        id: stageCount,
        title: `Stage ${stageCount}: Cumulative Word Drill`,
        description: `Drill combinations using letters: ${currentCompletedChars.join(', ').toUpperCase()}`,
        target: getDrillWords(currentCompletedChars),
        focusKeys: currentCompletedChars,
        phase: step < 10 ? 'home-row' : step < 20 ? 'extensions' : 'coordination'
      });
      stageCount++;
    }
  }

  // Padding up to 500 steps with targeted advanced word sentences
  const sentenceTemplates = [
    "the quick brown fox jumps over the lazy dog",
    "pack my box with five dozen liquor jugs",
    "a quick movement of the enemy will jeopardize six gunboats",
    "all matching keys should be typed carefully with high accuracy",
    "keep your fingers steady on home row asdf and jkl; keys",
    "practice touch typing daily to build core muscle memory",
    "accurate speed comes naturally when focusing on correctness first"
  ];

  while (stageCount <= 500) {
    const sentence = sentenceTemplates[stageCount % sentenceTemplates.length];
    list.push({
      id: stageCount,
      title: `Stage ${stageCount}: Speed Endurance Run`,
      description: "Build speed threshold using full progressive standard sentences.",
      target: sentence,
      focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      phase: 'advanced'
    });
    stageCount++;
  }

  return list.slice(0, 500);
};

export const lessons = generateCurriculum();
