export interface Lesson {
  id: number;
  title: string;
  description: string;
  target: string;
  focusKeys: string[];
  phase: 'home-row' | 'extensions' | 'coordination' | 'numbers-symbols' | 'advanced';
}

export const lessons: Lesson[] = [
  // Phase 1: Home Row (1 to 5)
  {
    id: 1,
    title: "Stage 1: Index Anchors",
    description: "Master the index anchors F, J, and Space.",
    target: "fff jjj fff jjj fjf jfj f f j j ff jj fj jf fjf jfj f j f j",
    focusKeys: ["f", "j", " "],
    phase: "home-row"
  },
  {
    id: 2,
    title: "Stage 2: Middle Row Core",
    description: "Introduce middle finger keys D and K.",
    target: "fff jjj ddd kkk fdf jkj fdk jfd f j d k fd jk fjd kjf d k d k",
    focusKeys: ["d", "k"],
    phase: "home-row"
  },
  {
    id: 3,
    title: "Stage 3: Ring Row Core",
    description: "Introduce ring finger keys S and L.",
    target: "sss lll fds jkl saf jkl s s l l as df jk l; asdf jkl; s l s l",
    focusKeys: ["s", "l"],
    phase: "home-row"
  },
  {
    id: 4,
    title: "Stage 4: Pinky Row Core",
    description: "Introduce pinky finger keys A and Semicolon.",
    target: "aaa ;;; asdf jkl; a; a; sa; sd; l; k; ask fad dad lad; a ; a ;",
    focusKeys: ["a", ";"],
    phase: "home-row"
  },
  {
    id: 5,
    title: "Stage 5: Home Row Extensions",
    description: "Stretch index fingers to hit G and H.",
    target: "ggg hhh fgh jhg gas has gad had fad; dash flash glad gash; g h g h",
    focusKeys: ["g", "h"],
    phase: "home-row"
  },
  // Phase 2: Vertical Extensions (6 to 15)
  {
    id: 6,
    title: "Stage 6: Top Row Index Extensions",
    description: "Introduce top row index keys R and U.",
    target: "rrr uuu fur jug rug mud rut jut radar rural sugar guard; r u r u",
    focusKeys: ["r", "u"],
    phase: "extensions"
  },
  {
    id: 7,
    title: "Stage 7: Top Row Middle Extensions",
    description: "Introduce top row middle keys E and I.",
    target: "eee iii red kid ride like hide seek deer desk risk side; e i e i",
    focusKeys: ["e", "i"],
    phase: "extensions"
  },
  {
    id: 8,
    title: "Stage 8: Top Row Ring Extensions",
    description: "Introduce top row ring keys W and O.",
    target: "www ooo who how low row slow word work gold wood wide; w o w o",
    focusKeys: ["w", "o"],
    phase: "extensions"
  },
  {
    id: 9,
    title: "Stage 9: Top Row Pinky Extensions",
    description: "Introduce top row pinky keys Q and P.",
    target: "qqq ppp quit pick push quad quick speed squad proud equip; q p q p",
    focusKeys: ["q", "p"],
    phase: "extensions"
  },
  {
    id: 10,
    title: "Stage 10: Bottom Row Index Extensions",
    description: "Introduce bottom row index keys V and M.",
    target: "vvv mmm move very view make move game save wave heavy; v m v m",
    focusKeys: ["v", "m"],
    phase: "extensions"
  },
  {
    id: 11,
    title: "Stage 11: Bottom Row Middle Extensions",
    description: "Introduce bottom row middle keys C and Comma.",
    target: "ccc ,,, come, cave, face, rock, rice, deck, clock, luck,; c , c ,",
    focusKeys: ["c", ","],
    phase: "extensions"
  },
  {
    id: 12,
    title: "Stage 12: Bottom Row Ring Extensions",
    description: "Introduce bottom row ring keys X and Period.",
    target: "xxx ... next. flex. exam. index. fixed. mixed. axis. relax. x . x .",
    focusKeys: ["x", "."],
    phase: "extensions"
  },
  {
    id: 13,
    title: "Stage 13: Bottom Row Pinky Extensions",
    description: "Introduce bottom row pinky keys Z and Slash.",
    target: "zzz /// zero/zone/size/lazy/maze/crazy/haze/prize/quiz/ z / z /",
    focusKeys: ["z", "/"],
    phase: "extensions"
  },
  {
    id: 14,
    title: "Stage 14: Top Row Inner Index Extensions",
    description: "Introduce top row inner index keys T and Y.",
    target: "ttt yyy toy try yellow today they that study youth trust; t y t y",
    focusKeys: ["t", "y"],
    phase: "extensions"
  },
  {
    id: 15,
    title: "Stage 15: Bottom Row Inner Index Extensions",
    description: "Introduce bottom row inner index keys B and N.",
    target: "bbb nnn baby bank burn band hand body book blue bean brown; b n b n",
    focusKeys: ["b", "n"],
    phase: "extensions"
  },
  // Phase 3: Shifts & Coordination (16 to 22)
  {
    id: 16,
    title: "Stage 16: Capitalization (Left Shift)",
    description: "Practice Left Shift holding key with right-hand keys.",
    target: "You Unit Ink Oak Pen Hill Jar Key Log New Map Yes You Unit Oak",
    focusKeys: ["left shift"],
    phase: "coordination"
  },
  {
    id: 17,
    title: "Stage 17: Capitalization (Right Shift)",
    description: "Practice Right Shift holding key with left-hand keys.",
    target: "Queen Wood East Red Time Ask Sun Day Fox Green Zoo Cat Van Big",
    focusKeys: ["right shift"],
    phase: "coordination"
  },
  {
    id: 18,
    title: "Stage 18: Pinky Isolation (Left Hand)",
    description: "Coordinate and strengthen left pinky keys Q, A, Z, Left Shift.",
    target: "aqua lazy pizza quiz area zero zeal abstract attacks actual area",
    focusKeys: ["q", "a", "z"],
    phase: "coordination"
  },
  {
    id: 19,
    title: "Stage 19: Pinky Isolation (Right Hand)",
    description: "Coordinate and strengthen right pinky keys P, Semicolon, Slash, Right Shift.",
    target: "apply purple prompt puppy copy paper party plain play prepare;",
    focusKeys: ["p", ";", "/"],
    phase: "coordination"
  },
  {
    id: 20,
    title: "Stage 20: Ring Isolation (Left Hand)",
    description: "Coordinate and strengthen left ring finger keys W, S, X.",
    target: "west wax show sweet swing swap syntax system swiss switch;",
    focusKeys: ["w", "s", "x"],
    phase: "coordination"
  },
  {
    id: 21,
    title: "Stage 21: Ring Isolation (Right Hand)",
    description: "Coordinate and strengthen right ring finger keys O, L, Period.",
    target: "look loop tool pool cool scroll old school load normal oil.",
    focusKeys: ["o", "l", "."],
    phase: "coordination"
  },
  {
    id: 22,
    title: "Stage 22: Essential N-Grams",
    description: "Practice high-frequency letter combinations.",
    target: "the mother hand enter sand reaction at these green open there;",
    focusKeys: ["t", "h", "e", "i", "n", "a", "r", "o", "s"],
    phase: "coordination"
  },
  // Phase 4: Numbers & Symbols (23 to 30)
  {
    id: 23,
    title: "Stage 23: Index Number Stretch",
    description: "Master number keys 4, 7, 5, 6.",
    target: "4756 47 56 65 74 456 754 4567 7654 page 45 line 67 room 54",
    focusKeys: ["4", "7", "5", "6"],
    phase: "numbers-symbols"
  },
  {
    id: 24,
    title: "Stage 24: Middle Number Stretch",
    description: "Master number keys 3, 8.",
    target: "38 83 338 883 3883 3478 room 38 class 83 page 383 year 838",
    focusKeys: ["3", "8"],
    phase: "numbers-symbols"
  },
  {
    id: 25,
    title: "Stage 25: Ring Number Stretch",
    description: "Master number keys 2, 9.",
    target: "29 92 229 992 2992 2398 page 29 room 92 unit 292 flight 922",
    focusKeys: ["2", "9"],
    phase: "numbers-symbols"
  },
  {
    id: 26,
    title: "Stage 26: Pinky Number Stretch",
    description: "Master number keys 1, 0.",
    target: "10 101 100 1010 1000 page 10 room 100 unit 101 section 100",
    focusKeys: ["1", "0"],
    phase: "numbers-symbols"
  },
  {
    id: 27,
    title: "Stage 27: Common Punctuation",
    description: "Practice apostrophe, quotes, and question marks.",
    target: "Is it true? \"Yes,\" she said. It's fine. Don't worry. Who's there?",
    focusKeys: ["'", "\"", "?"],
    phase: "numbers-symbols"
  },
  {
    id: 28,
    title: "Stage 28: Core Symbols",
    description: "Practice hyphen, equal, and plus keys.",
    target: "1 + 2 = 3; 10 - 5 = 5; total = base - cost + tax; value = 100;",
    focusKeys: ["-", "=", "+"],
    phase: "numbers-symbols"
  },
  {
    id: 29,
    title: "Stage 29: Structural Brackets",
    description: "Practice bracket and brace keys.",
    target: "[item] {key: val} [{items}] [1, 2] {name: \"user\"} {[x, y]}",
    focusKeys: ["[", "]", "{", "}"],
    phase: "numbers-symbols"
  },
  {
    id: 30,
    title: "Stage 30: Code Symbols",
    description: "Practice comparison, slash, and pipe keys.",
    target: "a < b; c > d; list | filter; path\\to\\file; value < max | flag",
    focusKeys: ["<", ">", "\\", "|"],
    phase: "numbers-symbols"
  },
  // Phase 5: Advanced (31 to 35)
  {
    id: 31,
    title: "Stage 31: The Speed Row",
    description: "Real high-frequency words for fast speed runs.",
    target: "the and of to in is you that it he was for on are as with his",
    focusKeys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    phase: "advanced"
  },
  {
    id: 32,
    title: "Stage 32: Paragraphs and Punctuation",
    description: "Mix punctuation, shifts, and letters in full sentences.",
    target: "The quick brown fox jumps over the lazy dog. Is it very fast? Yes!",
    focusKeys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ".", ",", ";", "\"", "'"],
    phase: "advanced"
  },
  {
    id: 33,
    title: "Stage 33: Coder Drills",
    description: "Real-world programming language syntax structures.",
    target: "const user = { id: 1 }; if (err) return; std::cout << val;",
    focusKeys: ["const", "let", "function", "=", "{", "}", ";", "(", ")"],
    phase: "advanced"
  },
  {
    id: 34,
    title: "Stage 34: Numbers & Calculations",
    description: "Mixed equations, phone numbers, and math inputs.",
    target: "12 + 34 = 46; 100 - 50 = 50; 3 * 4 = 12; 20 / 5 = 4; dynamic",
    focusKeys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/"],
    phase: "advanced"
  },
  {
    id: 35,
    title: "Stage 35: Endurance Test",
    description: "Type long-form prose with high speed and low mistakes.",
    target: "This is the final test of your touch typing skills. Keep going until the end.",
    focusKeys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    phase: "advanced"
  }
];
