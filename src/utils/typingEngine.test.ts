import { describe, it, expect } from 'vitest';
import { TypingEngine } from './typingEngine';

describe('TypingEngine', () => {
  it('Fixture 1: Perfect 60-Second Run', () => {
    const engine = new TypingEngine(["the", "quick", "brown"]);
    
    // Simulate: t-h-e-[space]-q-u-i-c-k-[space]-b-r-o-w-n
    let time = 1000;
    
    engine.handleKeyPress('t', time); time += 1000;
    engine.handleKeyPress('h', time); time += 1000;
    engine.handleKeyPress('e', time); time += 1000;
    engine.handleKeyPress(' ', time); time += 1000; // Space counts as keystroke, wordIndex becomes 1
    
    engine.handleKeyPress('q', time); time += 1000;
    engine.handleKeyPress('u', time); time += 1000;
    engine.handleKeyPress('i', time); time += 1000;
    engine.handleKeyPress('c', time); time += 1000;
    engine.handleKeyPress('k', time); time += 1000;
    engine.handleKeyPress(' ', time); time += 1000; // Space counts as keystroke, wordIndex becomes 2
    
    engine.handleKeyPress('b', time); time += 1000;
    engine.handleKeyPress('r', time); time += 1000;
    engine.handleKeyPress('o', time); time += 1000;
    engine.handleKeyPress('w', time); time += 1000;
    engine.handleKeyPress('n', time);
    
    expect(engine.totalKeystrokes).toBe(15);
    expect(engine.correctKeystrokes).toBe(15);
    expect(engine.getRawWPM(15)).toBe(12);
    expect(engine.getNetWPM(15)).toBe(12);
    expect(engine.getAccuracy()).toBe(100);
    expect(engine.getErrorsCount()).toBe(0);
    expect(engine.getMissedWords()).toEqual([]);
  });

  it('Fixture 2: Run with Uncorrected Errors', () => {
    const engine = new TypingEngine(["the", "quick", "brown"]);
    
    // Simulate: t-h-a-[space]-q-u-i-c-k-[space]-b-r-o-w-n
    let time = 1000;
    engine.handleKeyPress('t', time); time += 1000;
    engine.handleKeyPress('h', time); time += 1000;
    engine.handleKeyPress('a', time); time += 1000; // Error: typed 'a' instead of 'e'
    engine.handleKeyPress(' ', time); time += 1000;
    
    engine.handleKeyPress('q', time); time += 1000;
    engine.handleKeyPress('u', time); time += 1000;
    engine.handleKeyPress('i', time); time += 1000;
    engine.handleKeyPress('c', time); time += 1000;
    engine.handleKeyPress('k', time); time += 1000;
    engine.handleKeyPress(' ', time); time += 1000;
    
    engine.handleKeyPress('b', time); time += 1000;
    engine.handleKeyPress('r', time); time += 1000;
    engine.handleKeyPress('o', time); time += 1000;
    engine.handleKeyPress('w', time); time += 1000;
    engine.handleKeyPress('n', time);
    
    expect(engine.totalKeystrokes).toBe(15);
    expect(engine.correctKeystrokes).toBe(14);
    expect(engine.getRawWPM(15)).toBe(12);
    expect(engine.getNetWPM(15)).toBe(11.2);
    expect(engine.getAccuracy()).toBeCloseTo(93.33, 2);
    expect(engine.getErrorsCount()).toBe(1);
    expect(engine.getMissedWords()).toEqual(["the"]);
  });

  it('Fixture 3: Run with Corrected Errors (Backspace Used)', () => {
    const engine = new TypingEngine(["the"]);
    
    // Simulate: t-h-a-[backspace]-e
    let time = 1000;
    engine.handleKeyPress('t', time); time += 1000;
    engine.handleKeyPress('h', time); time += 1000;
    engine.handleKeyPress('a', time); time += 1000; // typo
    engine.handleBackspace(time); time += 1000;     // correct typo
    engine.handleKeyPress('e', time);
    
    expect(engine.totalKeystrokes).toBe(5); // 3 letters + 1 typo + 1 backspace = 5
    expect(engine.correctKeystrokes).toBe(3); // 't', 'h', 'e' match at the end
    expect(engine.getRawWPM(5)).toBe(12);
    expect(engine.getNetWPM(5)).toBe(7.2);
    expect(engine.getAccuracy()).toBe(60);
    expect(engine.getErrorsCount()).toBe(1); // 1 error logged on 'a' keypress
    expect(engine.getMissedWords()).toEqual([]); // 'the' typed correctly at the end
  });

  it('Boundary check: Cannot backspace past start of active word', () => {
    const engine = new TypingEngine(["the", "quick"]);
    engine.handleKeyPress('t');
    engine.handleBackspace(); // deletes 't'
    engine.handleBackspace(); // does nothing (at index 0)
    engine.handleBackspace(); // does nothing
    
    expect(engine.currentCharIndex).toBe(0);
    expect(engine.typedWords[0]).toBe('');
  });

  it('Boundary check: Cannot backspace into previous locked word', () => {
    const engine = new TypingEngine(["the", "quick"]);
    engine.handleKeyPress('t');
    engine.handleKeyPress('h');
    engine.handleKeyPress('e');
    engine.handleKeyPress(' '); // space advances to word 1
    engine.handleBackspace();   // should do nothing because current word is 1, and charIndex is 0
    
    expect(engine.currentWordIndex).toBe(1);
    expect(engine.currentCharIndex).toBe(0);
    expect(engine.typedWords[0]).toBe('the');
  });

  it('Keystroke cadence is logged correctly', () => {
    const engine = new TypingEngine(["the"]);
    engine.handleKeyPress('t', 1000); // delta = 0
    engine.handleKeyPress('h', 1200); // delta = 200ms
    engine.handleKeyPress('e', 1350); // delta = 150ms
    
    expect(engine.keystrokeLog.length).toBe(3);
    expect(engine.keystrokeLog[0].deltaMs).toBe(0);
    expect(engine.keystrokeLog[1].deltaMs).toBe(200);
    expect(engine.keystrokeLog[2].deltaMs).toBe(150);
  });
});
