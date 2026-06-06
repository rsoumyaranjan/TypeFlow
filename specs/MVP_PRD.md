# Product Requirements Document (PRD)
## Project: TypeFlow (Phase 1 MVP)

**Last updated**: 2026-06-07  
**Author**: Product Manager  
**Status**: Draft (Sprint 1 Specs)

---

## 1. Problem Statement & Opportunity

Traditional typing websites are heavily polarized:
* **Test-only platforms** (e.g., Monkeytype, 10FastFingers) focus purely on instant speed testing. They tell users their score (WPM, Accuracy) but fail to explain *how* to systematically practice and improve.
* **Curriculum/School platforms** (e.g., Typing.com, TypingClub) are designed for classroom settings. They require accounts, are heavily gamified for children, and feel slow or administrative for independent teenagers and adults.
* **Adaptive tools** (e.g., Keybr) are excellent but rely on repetitive, generated pseudo-words which frustrate users wanting real prose.

**TypeFlow** fills this gap as a **calm, individual-first typing website** that turns every timed typing test into a personalized, real-word practice recommendation. It is designed to be completely free, local-first (no accounts required), low-distraction, and privacy-aware.

---

## 2. Target Audience

* **Primary Audience**: Individual teenagers and adults who understand standard keyboard layout basics but want to build typing speed and accuracy for professional, creative, or academic work.
* **Core Segments**:
  * **Job seekers** preparing for standardized typing exams.
  * **Writers and note-takers** looking for fluid, low-friction text input.
  * **Beginners** transitioning from hunting-and-pecking to muscle-memory touch typing.
  * **Coders/Data professionals** who will eventually practice commands, symbols, and metrics.

---

## 3. Product Positioning

> **Positioning Statement**: For individuals who want to type faster and more accurately, TypeFlow is a no-account typing test and improvement website that analyzes your performance, explains your results in plain language, and recommends one targeted practice drill so you know exactly what to improve next.

---

## 4. Scope & Exclusions

### In-Scope (Phase 1 MVP)
* Standard timed typing tests (default 60s, preset 15s/30s).
* Instant typo visual feedback (non-intrusive).
* Results page detailing WPM, Raw WPM, Accuracy, Errors, and a clear next-step practice recommendation.
* A practice page that lets users type custom drills built from their missed words, slow words, or weak keys from the session.
* A short, structured "Learn" page introducing home-row and correct finger placement.
* A local dashboard tracking historical test records, personal bests, and weak letters/words.
* 100% client-side persistence (IndexedDB & LocalStorage).

### Out-of-Scope (Phase 1 MVP)
* User registration, cloud authentication, or cross-device database syncing.
* Multiplayer racing, public leaderboards, or player rankings.
* Teacher dashboards, classrooms, student rosters, assignments, and reporting.
* Advertisements, premium accounts, typing certifications, or monetization experiments.
* Full-scale curriculum (more than 10-15 introductory drills).
* AI-driven natural language feedback (no external paid APIs).
* Book/EPUB imports or long-form prose typing.
* Mobile typing app or native wrapper.

---

## 5. Detailed Page Requirements

### Page 1: Home / Dashboard
* **Purpose**: Launch pad for the application.
* **Features**:
  * Large "Take a Typing Test" primary call-to-action (CTA).
  * Quick-stats sidebar showing current Personal Best (WPM) and the user's primary "Weak Key" (based on historical local data).
  * Section to "Continue Practicing" if there are unresolved recommendations.
  * Keyboard shortcut reference.

### Page 2: Typing Test
* **Purpose**: Core gameplay engine for measuring speed and accuracy.
* **Features**:
  * Clean, low-contrast text container holding randomly selected english words.
  * Selector for test duration (15, 30, or 60 seconds). Default is 60 seconds.
  * Live metrics panel (WPM, Accuracy, Timer countdown) displayed in a low-visibility gray font to avoid distraction.
  * Live visual feedback for text: typed characters match word styling; mistakes are marked with an orange/red highlight, and corrected letters turn neutral.
  * Caret animation: smooth, blinking line tracking the current character.
  * Focus state: If the typing container loses focus, display a blur overlay ("Click or press any key to resume") to pause the timer.
  * Control shortcuts: Pressing `Tab` + `Enter` instantly restarts the test.

### Page 3: Results
* **Purpose**: Feedback and conversion to targeted practice.
* **Features**:
  * **Big Stats**: WPM (words per minute), Accuracy (%), Raw WPM, and total Errors.
  * **Plain-Language Summary**: A short summary explaining what these numbers mean (e.g., "Your typing is highly accurate, but you paused frequently on the bottom row keys.").
  * **Smart Practice Recommendation**: A prominent button saying: "Practice your Missed Words (X words)" or "Drill your Slow Keys (Y, Z)".
  * **Action Controls**: "Take another test" or "Practice recommendation".

### Page 4: Practice
* **Purpose**: Actionable improvement.
* **Features**:
  * Mode Selector:
    * **Missed Words**: Text block composed exclusively of the words the user typed incorrectly during the last test.
    * **Slow Words**: Text block consisting of words where the keystroke gap exceeded the user's average speed.
    * **Weak Keys**: Focused drills targeting specific keys with low speed or high error rates.
  * Input behavior: Standard typing engine but focused on completing the drill successfully. No strict countdown; focus is on accuracy.

### Page 5: Learn
* **Purpose**: Introduction to touch typing correct habits.
* **Features**:
  * A interactive keyboard layout display mapping keys to fingers.
  * Interactive beginner drills:
    * Lesson 1: Home row keys (`a s d f j k l ;`).
    * Lesson 2: Index fingers (`g h r u t y v b n m`).
    * Lesson 3: Ring and pinky keys (`q w o p z x c , . /`).
  * Instant feedback on key presses.

### Page 6: Progress
* **Purpose**: Local progress dashboard.
* **Features**:
  * **Visual Chart**: A lightweight line graph showing WPM and Accuracy over the last 10, 20, or 50 tests.
  * **High-Scores Panel**: List of personal best speeds for 15s, 30s, and 60s tests.
  * **Weak Key Grid**: A keyboard visual heatmap showing green keys (fast/accurate) and red/yellow keys (slow/error-prone).
  * **Data Utility**: A button to "Export History (JSON)" or "Reset/Delete All Local Data" to keep the user in complete control of their privacy.

### Page 7: About & Privacy
* **Purpose**: Stance verification and calculations help.
* **Features**:
  * Detailed formulas showing how WPM, Raw WPM, and Accuracy are calculated.
  * Privacy promise: "All data stays in your browser's IndexedDB. We collect zero analytics that identify you."
  * Instructions on how to backing up data.

---

## 6. Non-Functional & Quality Requirements

* **Performance**: Keystroke input latency must be imperceptible (under 10ms processing time). Caret movement must be fluid.
* **Accessibility (WCAG 2.1 AA)**:
  * Full keyboard navigability (no mouse required to take a test, restart, or navigate to practice).
  * Minimum color contrast ratio of 4.5:1 for text elements.
  * Clear visual focus indicators for active buttons and input boxes.
* **Responsiveness**: Layout must adapt to tablet and mobile viewports. However, a warning message should indicate that physical keyboards are recommended for typing tests.
* **SEO**: Static page rendering for fast load times and clean meta tag configurations.

---

## 7. Metrics & Analytics Framework (Data Engineering Foundation)

Since the project aims to serve as a data engineering sandbox, the client application will generate structured, JSON-formatted event logs stored locally in IndexedDB:

### Schema Event Types
1. `session_start`: Captures browser config, timestamp, test duration.
2. `keystroke`: Tracks timestamp (ms), key, target key, time delta from previous key (for typing rhythm analysis).
3. `test_complete`: Summarizes final WPM, Raw WPM, Accuracy, errors list.
4. `practice_complete`: Tracks drill completion stats and progress.
5. `data_reset`: Records when a user clears local data.

Users will be able to export this raw log file in JSON format to perform external analysis in Python, SQL, or BI tools.
