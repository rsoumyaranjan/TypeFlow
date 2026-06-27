# TypeFlow

> A calm, local-first typing improvement platform — test your speed, learn finger placements, practice weak keys, and track progress. No account required.

**Live URL**: _(Cloudflare Pages — to be published after QA approval)_  
**GitHub**: [rsoumyaranjan/TypeFlow](https://github.com/rsoumyaranjan/TypeFlow)  
**Current Version**: V1.0 (test branch — pending QA review)

---

## Pages

| Page | URL | Description |
|---|---|---|
| Dashboard | `/` | Onboarding guide, personal bests, weak-key recommendations |
| Typing Test | `/test` | Timed 15s / 30s / 60s typing test with live WPM feedback |
| Results | `/results` | WPM, Raw WPM, Accuracy, Errors, and next drill recommendation |
| Practice | `/practice` | Drill mode targeting words from your last session errors |
| Learn | `/learn` | Interactive touch-typing lessons with virtual keyboard guide |
| Progress | `/progress` | Session history, personal bests, key accuracy heatmap, lessons checklist |
| About | `/about` | Privacy posture, calculation formulas, and local data controls |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + Vite | Frontend framework and build tool |
| TypeScript | Type-safe codebase |
| react-router-dom v7 | Client-side BrowserRouter routing |
| Dexie.js (IndexedDB) | Local-first offline-first data persistence |
| Lucide-React | Icon library |
| Vitest | Unit testing |
| Playwright | End-to-end testing |
| Cloudflare Pages | Free static hosting |

---

## Local Development

### Prerequisites
- Node.js v18+ (tested on v24.16.0 LTS)
- npm v9+

### Setup
```bash
# Clone the repository
git clone https://github.com/rsoumyaranjan/TypeFlow.git
cd TypeFlow

# Install dependencies
npm install

# Start local dev server
npm run dev
# Open http://localhost:5173

# Run unit tests
npm run test

# Build for production
npm run build
```

---

## Git Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — deployed to Cloudflare Pages |
| `test` | QA staging — reviewed before merging to main |
| `feature/*` | Individual feature branches (future sprints) |

**Workflow:**
```
feature/* → test (QA review) → main (production deploy)
```

---

## Deployment — Cloudflare Pages

**Build Settings:**
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: `18` or higher

**Static Routing (BrowserRouter Support):**
The `public/_redirects` file is already configured:
```
/* /index.html 200
```
This ensures page refreshes on any route (`/test`, `/learn`, `/progress`) do not return 404 errors.

---

## Privacy

TypeFlow is fully local-first:
- All typing sessions, personal bests, and lesson history are stored in **IndexedDB** (your browser).
- No data is sent to any external server or analytics service.
- Users can export, import, or completely delete all data from the **Progress** page.

---

## Project Structure

```
src/
├── components/        # Page-level React components
│   ├── Dashboard.tsx  # Home + onboarding
│   ├── TypingTest.tsx # Typing engine UI
│   ├── Results.tsx    # Post-test metrics
│   ├── Practice.tsx   # Drill mode
│   ├── Learn.tsx      # Touch-typing lessons
│   ├── ProgressView.tsx # Stats, history, data controls
│   └── About.tsx      # Privacy + help
├── services/
│   ├── db.ts          # Dexie IndexedDB layer
│   └── analytics.ts   # Key accuracy heatmap helpers
├── utils/
│   └── typingEngine.ts # WPM/accuracy calculation engine
├── App.tsx            # Router + global layout + themes
├── index.css          # Design system + CSS variables
└── main.tsx           # Entry point + BrowserRouter
specs/                 # Product/technical specifications
public/
└── _redirects         # Cloudflare Pages SPA routing rule
```

---

## Test Coverage

```
✓ src/utils/typingEngine.test.ts   (6 tests)
✓ src/services/analytics.test.ts   (4 tests)
✓ src/services/db.test.ts          (16 tests)

Test Files: 3 passed | Tests: 26 passed
```

---

## Roadmap

- **V1** — Core typing test, local persistence, learn page, progress tracking *(current)*
- **V2** — User accounts, cloud sync, advanced analytics, multiplayer features
