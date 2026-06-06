# QA Test Plan Specification
## Project: TypeFlow (Phase 1 MVP)

**Last updated**: 2026-06-07  
**Author**: QA Tester  
**Status**: Draft (Sprint 1 Specs)

---

## 1. Automated Testing Strategy

To ensure high code quality, TypeFlow uses a two-tier testing pipeline:
1. **Unit Tests (Vitest)**: Validates core calculations, WPM math, typing engine states, and event logging.
2. **End-to-End Tests (Playwright)**: Simulates browser environments, user keystroke timings, routing transitions, and IndexedDB read/write consistency.

---

## 2. Unit Test Cases (Vitest)

Unit tests focus on the math and logical rules of the typing engine in `src/utils/typingEngine.ts`.

### Test Suite: `Typing Engine Math`
* **TC-1.1: Net WPM Calculation**
  * *Setup*: Simulated test length = 30 seconds. Correct characters = 150.
  * *Execution*: Invoke WPM calculator with `(150 / 5) / (30 / 60)`.
  * *Pass Criteria*: Output WPM = `60.0`.
* **TC-1.2: Raw WPM Calculation**
  * *Setup*: Simulated test length = 30 seconds. Total keystrokes = 170.
  * *Execution*: Invoke Raw WPM calculator with `(170 / 5) / (30 / 60)`.
  * *Pass Criteria*: Output Raw WPM = `68.0`.
* **TC-1.3: Keystroke Accuracy Math**
  * *Setup*: Total keystrokes = 120. Correct keystrokes = 108.
  * *Execution*: Calculate accuracy.
  * *Pass Criteria*: Output = `90.0%`.
* **TC-1.4: Error Tracking Log**
  * *Setup*: Expected word `the`, user types `tha`.
  * *Execution*: Validate error log payload.
  * *Pass Criteria*: Log records expected `e`, actual `a` at wordIndex `0`, charIndex `2`.

---

## 3. End-to-End Integration Tests (Playwright)

Playwright runs headless browser instances to verify complete page-to-page user flows.

### Script: `Core Typing Test Loop`
1. Navigate to `/test`.
2. Verify countdown timer reads `01:00`.
3. Focus input. Simulate keyboard typing of the first word correctly.
4. Verify timer is active (e.g. changes to `00:59`).
5. Simulate typing a typo. Verify correct class `.typo` is applied to the active letter.
6. Press `Tab` + `Enter`.
7. Verify timer reset to `01:00` and text buffer is empty.
8. Fast-forward timer to `0`.
9. Verify browser redirected to `/results`.
10. Confirm WPM, Raw WPM, and Accuracy stats are displayed.

---

## 4. Manual Accessibility (A11y) & UX Checklist

* **Accessibility Requirements**:
  * **Contrast Check**: Verify all text colors have a contrast ratio of at least 4.5:1 against their backgrounds (using axe-core tool or Chrome DevTools).
  * **Keyboard Focus**: Press `Tab` to navigate the global header. Verify that active buttons have a prominent outline indicator (e.g., `#ef4444` focus ring).
  * **Screen Reader tags**: Verify all interactive SVGs (like theme icons) have an `aria-label` attribute.
* **Responsive Layout Check**:
  * **Mobile Warning**: Set viewport width to `375px` (iPhone SE). Go to `/test`. Check if the physical keyboard warning banner is visible.
  * **Virtual Input**: Tap the mobile typing box and confirm virtual keyboard opens and registers inputs correctly.

---

## 5. Persistence & Data Erasure Verification

* **Data Insertion Test**:
  * Complete a 15-second typing test.
  * Open Chrome DevTools $\rightarrow$ Application $\rightarrow$ IndexedDB $\rightarrow$ `TypeFlowDB` $\rightarrow$ `tests` table.
  * Verify 1 record is present matching the WPM score.
* **Page Refresh Resiliency**:
  * Refresh page. Navigate to `/progress`.
  * Verify the line chart shows the test result from the previous step.
* **Data Erasure (Right to Be Forgotten)**:
  * Click "Reset/Delete All Local Data" on the Progress page.
  * Confirm that browser redirects, LocalStorage is empty, and `TypeFlowDB` database is deleted.
