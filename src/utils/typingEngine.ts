export interface KeystrokeEvent {
  key: string;
  target: string;
  wordIndex: number;
  charIndex: number;
  timestamp: number;
  deltaMs: number;
  status: 'correct' | 'incorrect';
}

export interface TypingError {
  wordIndex: number;
  charIndex: number;
  expected: string;
  actual: string;
  timestamp: number;
}

export class TypingEngine {
  public wordList: string[];
  public currentWordIndex: number = 0;
  public currentCharIndex: number = 0;
  public startTime: number | null = null;
  public endTime: number | null = null;
  public totalKeystrokes: number = 0;
  public errorLog: TypingError[] = [];
  public keystrokeLog: KeystrokeEvent[] = [];
  private lastKeystrokeTime: number | null = null;

  // Stores the actual typed characters for each word
  public typedWords: string[] = [];

  constructor(wordList: string[]) {
    this.wordList = wordList;
    this.typedWords = Array(wordList.length).fill('');
  }

  /**
   * Processes a standard keydown event (letters, numbers, spacebar).
   */
  public handleKeyPress(key: string, timestamp: number = Date.now()): void {
    if (this.currentWordIndex >= this.wordList.length) return;

    // Start timer on first keypress
    if (this.startTime === null) {
      this.startTime = timestamp;
      this.lastKeystrokeTime = timestamp;
    }

    const currentWord = this.wordList[this.currentWordIndex];

    // Spacebar to advance to the next word
    if (key === ' ') {
      // Prevent spacing if no characters have been typed in the current word yet
      if (this.typedWords[this.currentWordIndex].length === 0) return;

      this.currentWordIndex += 1;
      this.currentCharIndex = 0;
      this.totalKeystrokes += 1; // Space is counted as a keystroke
      this.lastKeystrokeTime = timestamp;
      return;
    }

    // Ignore multi-character non-printing keys (except spacebar/backspace handled separately)
    if (key.length !== 1) return;

    this.totalKeystrokes += 1;

    // Calculate delta timing from the previous keystroke
    const deltaMs = this.lastKeystrokeTime !== null ? timestamp - this.lastKeystrokeTime : 0;
    this.lastKeystrokeTime = timestamp;

    const targetChar = currentWord[this.currentCharIndex] || '';

    // Record the typed character
    this.typedWords[this.currentWordIndex] += key;

    const isCorrect = key === targetChar;

    if (isCorrect) {
      this.keystrokeLog.push({
        key,
        target: targetChar,
        wordIndex: this.currentWordIndex,
        charIndex: this.currentCharIndex,
        timestamp,
        deltaMs,
        status: 'correct'
      });
    } else {
      this.errorLog.push({
        wordIndex: this.currentWordIndex,
        charIndex: this.currentCharIndex,
        expected: targetChar,
        actual: key,
        timestamp
      });
      this.keystrokeLog.push({
        key,
        target: targetChar,
        wordIndex: this.currentWordIndex,
        charIndex: this.currentCharIndex,
        timestamp,
        deltaMs,
        status: 'incorrect'
      });
    }

    this.currentCharIndex += 1;
  }

  /**
   * Processes a Backspace keypress.
   * Limits backspacing to the boundaries of the active word only.
   */
  public handleBackspace(timestamp: number = Date.now()): void {
    if (this.currentWordIndex >= this.wordList.length) return;
    if (this.currentCharIndex === 0) return; // Cannot backspace past start of current word

    this.currentCharIndex -= 1;
    this.typedWords[this.currentWordIndex] = this.typedWords[this.currentWordIndex].slice(0, -1);
    this.totalKeystrokes += 1; // Backspace counts as a keystroke

    // Update timing chain
    this.lastKeystrokeTime = timestamp;
  }

  /**
   * Calculates correct keystrokes matching the target words at the end of the session.
   */
  public get correctKeystrokes(): number {
    let correct = 0;
    for (let i = 0; i <= this.currentWordIndex; i++) {
      if (i >= this.wordList.length) break;
      const target = this.wordList[i];
      const typed = this.typedWords[i] || '';

      const limit = Math.min(target.length, typed.length);
      for (let j = 0; j < limit; j++) {
        if (typed[j] === target[j]) {
          correct++;
        }
      }

      // Count spacebar as a correct keystroke if we advanced past this word
      if (i < this.currentWordIndex) {
        correct++;
      }
    }
    return correct;
  }

  public getRawWPM(durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const minutes = durationSeconds / 60;
    return (this.totalKeystrokes / 5) / minutes;
  }

  public getNetWPM(durationSeconds: number): number {
    if (durationSeconds <= 0) return 0;
    const minutes = durationSeconds / 60;
    return (this.correctKeystrokes / 5) / minutes;
  }

  public getAccuracy(): number {
    if (this.totalKeystrokes === 0) return 100;
    return (this.correctKeystrokes / this.totalKeystrokes) * 100;
  }

  public getErrorsCount(): number {
    return this.errorLog.length;
  }

  public getMissedWords(): string[] {
    const missed: string[] = [];
    for (let i = 0; i <= this.currentWordIndex; i++) {
      if (i >= this.wordList.length) break;
      const target = this.wordList[i];
      const typed = this.typedWords[i] || '';

      if (typed !== target && typed.length > 0) {
        missed.push(target);
      }
    }
    return missed;
  }
}
