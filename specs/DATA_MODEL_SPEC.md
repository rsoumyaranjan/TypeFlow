# Data Model Specification
## Project: TypeFlow (Phase 1 MVP)

**Last updated**: 2026-06-07  
**Author**: Data Engineer  
**Status**: Draft (Sprint 1 Specs)

---

## 1. Local Persistence Overview

To satisfy the dual goals of a **100% free hosting cost** and **robust data engineering analytics**, TypeFlow uses a local-first database model:

1. **LocalStorage**: Used for lightweight, key-value configuration settings (e.g., audio settings, UI theme).
2. **IndexedDB (via Dexie.js)**: Used for high-volume relational data storage, such as typing session logs, raw keystroke events, and personal best records.

No database requests or analytics payloads are transmitted to external servers. All processing is completed on the client's CPU.

---

## 2. IndexedDB Schema (TypeFlowDB)

The IndexedDB schema is defined using **Dexie.js**. The database name is `TypeFlowDB`.

### Database Schema Definition
```javascript
import Dexie from 'dexie';

const db = new Dexie('TypeFlowDB');
db.version(1).stores({
  tests: '++id, timestamp, duration, wpm, accuracy',
  personalBests: 'duration, wpm, timestamp'
});
```

### Table 1: `tests` (Typing Test Logs)
This table stores a detailed history of every typing test completed by the user.

| Column Name | Indexed | Data Type | Description |
|---|---|---|---|
| `id` | Yes (PK) | Integer (Auto) | Unique key for the session. |
| `timestamp` | Yes | Integer | Unix timestamp in milliseconds when the test ended. |
| `duration` | Yes | Integer | Duration of test in seconds (e.g. 15, 30, 60). |
| `wpm` | Yes | Float | Net Words Per Minute. |
| `rawWpm` | No | Float | Raw Words Per Minute. |
| `accuracy` | Yes | Float | Keystroke accuracy percentage (0.00 to 100.00). |
| `errorsCount` | No | Integer | Count of uncorrected errors at the end of the test. |
| `wordsCount` | No | Integer | Total words completed in the test. |
| `keystrokeLog` | No | JSON Array | Array of individual keystroke logs for detailed analysis. |
| `missedWords` | No | Array (String) | List of words typed incorrectly. |

#### Keystroke Log Entry Schema (Nested inside `keystrokeLog`):
```json
{
  "key": "a",
  "target": "a",
  "wordIndex": 2,
  "charIndex": 0,
  "timestamp": 1717720012543,
  "deltaMs": 145,
  "status": "correct"
}
```

---

### Table 2: `personalBests` (Personal Records)
This table caches the highest WPM achieved for each test duration to allow fast rendering on the home page and progress screens.

| Column Name | Indexed | Data Type | Description |
|---|---|---|---|
| `duration` | Yes (PK) | Integer | Test duration in seconds (e.g., 15, 30, 60). |
| `wpm` | No | Float | Best WPM recorded. |
| `accuracy` | No | Float | Accuracy of that best run. |
| `timestamp` | No | Integer | Unix timestamp when the record was achieved. |

---

## 3. LocalStorage Variables

For simple configuration states, we bypass IndexedDB and use standard LocalStorage keys (prefixed with `typeflow_` to prevent namespace collisions):

| Key Name | Data Type | Default Value | Description |
|---|---|---|---|
| `typeflow_theme` | String | `"dark"` | Active theme choice (`"dark"`, `"light"`, `"sepia"`). |
| `typeflow_sound_enabled` | Boolean | `true` | Mute toggle for mechanical keyboard key clicks. |
| `typeflow_sound_volume` | Float | `0.5` | Volume level (0.0 to 1.0) for audio feedback. |
| `typeflow_test_duration` | Integer | `60` | Default selected test length in seconds. |

---

## 4. Data Privacy, Portability, & Control

To comply with privacy best practices (reviewed by the **Data Privacy Specialist**), TypeFlow gives users complete ownership of their logs.

### A. Data Export Format (JSON)
Users can download their entire history in JSON format. The exported file structure is:

```json
{
  "version": 1,
  "exportTimestamp": 1717720500000,
  "personalBests": [
    { "duration": 15, "wpm": 72.5, "accuracy": 98.0, "timestamp": 1717720200000 },
    { "duration": 60, "wpm": 65.2, "accuracy": 95.4, "timestamp": 1717720400000 }
  ],
  "tests": [
    {
      "timestamp": 1717720400000,
      "duration": 60,
      "wpm": 65.2,
      "rawWpm": 68.0,
      "accuracy": 95.4,
      "errorsCount": 3,
      "wordsCount": 68,
      "missedWords": ["about", "correct"],
      "keystrokeLog": []
    }
  ]
}
```

### B. Data Import Behavior
* The application will validate the JSON structure against the export schema before writing.
* Users can choose to **Merge** (add imported tests to local ones, preserving records) or **Overwrite** (wipe existing local db and set it to the imported file).

### C. Data Reset Method
To delete all local data, the application will invoke:
```javascript
async function resetAllData() {
  localStorage.clear();
  await Dexie.delete('TypeFlowDB');
  window.location.reload();
}
```
This leaves zero persistent traces of typing history on the user's hard drive.
