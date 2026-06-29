// src/utils/wordEngine.ts

import {
  YOUNG_LEARNER_WORDS,
  COMMON_WORDS_1000,
  COMMON_WORDS_5000,
  PROFESSIONAL_WORDS,
  PROGRAMMING_KEYWORDS,
  CODE_IDENTIFIERS,
  CLI_COMMANDS,
  NUMBER_EMBEDDED_WORDS,
  TOP_BIGRAMS,
  TOP_TRIGRAMS,
  SLOW_TRANSITION_PAIRS,
  FINGER_CROSSING_PAIRS
} from './wordCorpus';

export type LessonTrack = 'young' | 'adult' | 'professional';

const filterCache = new Map<string, string[]>();

/**
 * Helper deterministic random generator (LCG)
 */
function createRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Filters the full corpus down to words using only allowedChars.
 * Caches results for performance (key: sorted allowed chars joined).
 */
export function filterWordsByKeys(
  corpus: string[],
  allowedChars: string[]
): string[] {
  const cleanAllowed = allowedChars.map(c => c.toLowerCase());
  const cacheKey = [...new Set(cleanAllowed)].sort().join('');
  if (filterCache.has(cacheKey)) {
    return filterCache.get(cacheKey)!;
  }

  const allowedSet = new Set(cleanAllowed);
  const filtered = corpus.filter(word => {
    return word.split('').every(ch => {
      if (ch === ' ' || ch === '\n' || ch === '\r') return true;
      return allowedSet.has(ch.toLowerCase());
    });
  });

  filterCache.set(cacheKey, filtered);
  return filtered;
}

/**
 * Returns a corpus suitable for the track
 */
function getCorpusForTrack(track: LessonTrack, allowedCharsCount: number): string[] {
  if (track === 'young') {
    return YOUNG_LEARNER_WORDS;
  } else if (track === 'professional') {
    return [
      ...PROFESSIONAL_WORDS,
      ...PROGRAMMING_KEYWORDS,
      ...CODE_IDENTIFIERS,
      ...CLI_COMMANDS,
      ...NUMBER_EMBEDDED_WORDS
    ];
  } else {
    // adult
    if (allowedCharsCount > 15) {
      return COMMON_WORDS_5000;
    }
    return COMMON_WORDS_1000;
  }
}

/**
 * Generates pseudo-words for early stages when the word pool is small
 */
function generatePseudoWords(allowedChars: string[], count: number, random: () => number): string[] {
  const cleanChars = allowedChars.filter(c => c !== ' ' && c !== ';');
  if (cleanChars.length === 0) return Array(count).fill('f');

  const vowels = cleanChars.filter(c => 'aeiou'.includes(c.toLowerCase()));
  const consonants = cleanChars.filter(c => !'aeiou'.includes(c.toLowerCase()));

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = Math.floor(random() * 3) + 3; // 3 to 5 chars
    let word = '';
    for (let j = 0; j < len; j++) {
      if (vowels.length > 0 && consonants.length > 0) {
        if (j % 2 === 0) {
          word += consonants[Math.floor(random() * consonants.length)];
        } else {
          word += vowels[Math.floor(random() * vowels.length)];
        }
      } else {
        word += cleanChars[Math.floor(random() * cleanChars.length)];
      }
    }
    result.push(word);
  }
  return result;
}

/**
 * Returns words that can be typed using ONLY the allowed character set.
 */
export function getDrillWords(
  allowedChars: string[],
  focusChars: string[],
  count: number,
  track: LessonTrack
): string[] {
  const seedString = allowedChars.join('') + focusChars.join('') + count + track;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed += seedString.charCodeAt(i);
  }
  const random = createRandom(seed || 98765);

  const corpus = getCorpusForTrack(track, allowedChars.length);
  const filteredCorpus = filterWordsByKeys(corpus, allowedChars);

  const focusSet = new Set(focusChars.map(c => c.toLowerCase()));
  const focusWords = filteredCorpus.filter(word =>
    word.split('').some(ch => focusSet.has(ch.toLowerCase()))
  );

  let reviewWords = filteredCorpus.filter(word =>
    !word.split('').some(ch => focusSet.has(ch.toLowerCase()))
  );
  if (reviewWords.length === 0) {
    reviewWords = filteredCorpus;
  }

  const allNgrams = [
    ...TOP_BIGRAMS,
    ...TOP_TRIGRAMS,
    ...SLOW_TRANSITION_PAIRS,
    ...FINGER_CROSSING_PAIRS
  ];
  const filteredNgrams = filterWordsByKeys(allNgrams as unknown as string[], allowedChars);

  if (filteredCorpus.length < 10) {
    return generatePseudoWords(allowedChars, count, random);
  }

  const result: string[] = [];
  const focusTarget = Math.round(count * 0.6);
  const ngramsTarget = Math.round(count * 0.1);
  const reviewTarget = count - focusTarget - ngramsTarget;

  const pickRandom = (arr: string[]) => {
    if (arr.length === 0) return '';
    return arr[Math.floor(random() * arr.length)];
  };

  for (let i = 0; i < focusTarget; i++) {
    if (focusWords.length > 0) {
      result.push(pickRandom(focusWords));
    } else {
      result.push(pickRandom(filteredCorpus));
    }
  }

  for (let i = 0; i < reviewTarget; i++) {
    result.push(pickRandom(reviewWords));
  }

  for (let i = 0; i < ngramsTarget; i++) {
    if (filteredNgrams.length > 0) {
      result.push(pickRandom(filteredNgrams));
    } else {
      result.push(pickRandom(reviewWords));
    }
  }

  // Shuffle deterministically
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  // Final safety filter
  const allowedSet = new Set(allowedChars.map(c => c.toLowerCase()));
  return result.map(w => {
    return w.split('').filter(ch => ch === ' ' || allowedSet.has(ch.toLowerCase())).join('');
  }).filter(w => w.length > 0);
}

/**
 * Generates a drill string from word array, joining with spaces.
 * Optionally injects n-gram practice words (10% of total).
 */
export function generateDrillText(
  words: string[],
  injectNgrams: boolean,
  allowedChars: string[]
): string {
  if (!injectNgrams) {
    return words.join(' ');
  }

  const allNgrams = [
    ...TOP_BIGRAMS,
    ...TOP_TRIGRAMS,
    ...SLOW_TRANSITION_PAIRS,
    ...FINGER_CROSSING_PAIRS
  ];
  const filteredNgrams = filterWordsByKeys(allNgrams as unknown as string[], allowedChars);
  if (filteredNgrams.length === 0) {
    return words.join(' ');
  }

  const random = createRandom(words.length + allowedChars.length);
  const result = [...words];
  const injectCount = Math.max(1, Math.round(words.length * 0.1));

  for (let i = 0; i < injectCount; i++) {
    const idx = Math.floor(random() * result.length);
    const ngram = filteredNgrams[Math.floor(random() * filteredNgrams.length)];
    result.splice(idx, 0, ngram);
  }

  return result.join(' ');
}
