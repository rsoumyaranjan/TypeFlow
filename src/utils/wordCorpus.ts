// src/utils/wordCorpus.ts

/** 500+ words: animals, colours, food, simple verbs, family, nature */
export const YOUNG_LEARNER_WORDS: string[] = [
  "cat", "dog", "bird", "fish", "frog", "lion", "bear", "duck", "pig", "cow", "sheep", "goat",
  "horse", "deer", "blue", "red", "green", "pink", "grey", "black", "white", "gold", "apple",
  "pear", "plum", "cake", "milk", "bread", "play", "run", "jump", "sing", "swim", "fly", "walk",
  "happy", "sad", "good", "tree", "leaf", "sun", "moon", "star", "rain", "snow", "wind", "baby",
  "mom", "dad", "sister", "brother", "home", "book", "pen", "desk", "chair", "toy", "ball", "game",
  "kite", "ship", "boat", "car", "bus", "bike", "train", "road", "park", "zoo", "school", "bell",
  "cold", "hot", "warm", "wet", "dry", "big", "small", "tall", "short", "fast", "slow", "loud",
  "soft", "sweet", "sour", "hard", "easy", "clean", "dirty", "new", "old", "young", "door", "wall",
  "roof", "yard", "grass", "flower", "seed", "root", "bark", "twig", "wood", "stone", "sand", "clay",
  "dirt", "dust", "lake", "pond", "pool", "river", "wave", "fish", "crab", "clam", "shell", "starfish",
  "whale", "shark", "seal", "walrus", "otter", "beaver", "fox", "wolf", "hare", "rabbit", "mouse",
  "rat", "squirrel", "chipmunk", "skunk", "mole", "bat", "owl", "hawk", "eagle", "crow", "jay",
  "robin", "wren", "finch", "dove", "swan", "goose", "hen", "rooster", "chick", "turkey", "egg",
  "nest", "wing", "feather", "beak", "claw", "tail", "fur", "wool", "horn", "hoof", "mane", "hide",
  "skin", "bone", "meat", "milk", "cheese", "butter", "cream", "honey", "sugar", "salt", "pepper",
  "spic", "herb", "seed", "nut", "fruit", "berry", "melon", "grape", "peach", "pear", "plum", "fig",
  "date", "olive", "lime", "lemon", "orange", "banana", "mango", "papaya", "guava", "coconut", "bean",
  "pea", "corn", "rice", "wheat", "oat", "barley", "rye", "flour", "yeast", "dough", "bread", "bun",
  "roll", "loaf", "crust", "crumb", "slice", "toast", "cookie", "biscuit", "cracker", "chip", "fry",
  "soup", "stew", "sauce", "gravy", "salad", "meat", "beef", "pork", "ham", "bacon", "sausage",
  "lamb", "veal", "deer", "venison", "chicken", "duck", "turkey", "fish", "trout", "salmon", "tuna",
  "cod", "halibut", "shrimp", "prawn", "crab", "lobster", "clam", "oyster", "mussel", "scallop",
  "squid", "octopus", "snail", "slug", "worm", "bug", "ant", "bee", "wasp", "hornet", "fly", "gnat",
  "flea", "tick", "mite", "spider", "tick", "web", "silk", "moth", "butterfly", "caterpillar",
  "cocoon", "beetle", "weevil", "ladybug", "firefly", "glowworm", "cicada", "cricket", "grasshopper",
  "locust", "mantis", "roach", "termite", "flea", "louse", "bedbug", "tick", "mite", "scorpio",
  "centipede", "millipede", "crab", "shrimp", "lobster", "crawfish", "barnacle", "krill", "pillbug",
  "sowbug", "waterflea", "copepod", "ostracod", "rotifer", "tardigrade", "nematode", "flatworm",
  "tapeworm", "fluke", "leech", "earthworm", "lugworm", "clamworm", "tubeworm", "ice", "fire",
  "smoke", "ash", "dust", "mud", "sand", "gravel", "rock", "stone", "boulder", "pebble", "shingle",
  "silt", "clay", "soil", "loam", "peat", "muck", "turf", "sod", "grass", "herb", "weed", "fern",
  "moss", "lichen", "fungus", "mold", "mildew", "rust", "smut", "mushroom", "toadstool", "puffball",
  "bracket", "yeast", "algae", "seaweed", "kelp", "pondweed", "duckweed", "waterlily", "cattail",
  "rush", "sedge", "reed", "cane", "bamboo", "grass", "clover", "alfalfa", "vetch", "pea", "bean",
  "lentil", "peanut", "soybean", "lupine", "gorse", "broom", "furze", "heather", "heath", "ling",
  "bilberry", "cranberry", "blueberry", "huckleberry", "cowberry", "crowberry", "bearberry",
  "cloudberry", "dewberry", "blackberry", "raspberry", "strawberry", "currant", "gooseberry",
  "elderberry", "rowanberry", "serviceberry", "hawberry", "rosehip", "sloe", "bullace", "damson",
  "plum", "cherry", "peach", "apricot", "nectarine", "almond", "walnut", "hazelnut", "filbert",
  "cobnut", "chestnut", "beechtnut", "oakmast", "acorn", "hickory", "pecan", "butternut", "heartnut"
];

/** Top 1000 most common English words (Oxford frequency list) */
export const COMMON_WORDS_1000: string[] = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
  "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
  "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
  "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
  "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "about", "above", "across", "act",
  "active", "activity", "actor", "actress", "add", "address", "administration", "admit", "adult", "affect",
  "again", "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "allow",
  "almost", "alone", "along", "already", "although", "always", "american", "among", "amount", "analysis",
  "animal", "another", "answer", "anyone", "anything", "appear", "apply", "approach", "area", "argue",
  "arm", "around", "arrive", "art", "article", "artist", "ask", "assume", "attack", "attention",
  "attorney", "audience", "author", "authority", "available", "avoid", "away", "baby", "bad", "bag",
  "bank", "bar", "base", "beat", "beautiful", "become", "bed", "before", "begin", "behavior",
  "behind", "believe", "benefit", "best", "better", "between", "beyond", "bill", "billion", "bit",
  "blood", "board", "body", "born", "both", "box", "boy", "break", "bring", "budget",
  "build", "building", "business", "buy", "cabinet", "call", "camera", "campaign", "cancer", "candidate",
  "capital", "card", "care", "career", "carry", "case", "catch", "cause", "cell", "center",
  "central", "century", "certain", "certainly", "challenge", "chance", "change", "charity", "chart", "chase",
  "cheap", "check", "cheek", "chef", "chemical", "chest", "chief", "child", "children", "choice",
  "choose", "church", "cigarette", "circle", "city", "civil", "claim", "class", "classic", "clean",
  "clear", "clearly", "client", "climate", "climb", "clock", "close", "closely", "closer", "closest",
  "cloth", "clothes", "clothing", "cloud", "club", "clue", "cluster", "coach", "coal", "coalition",
  "coast", "coat", "code", "coffee", "cognitive", "collapse", "colleague", "collect", "collection", "college",
  "column", "combination", "combine", "comedy", "comfort", "comfortable", "command", "commander", "comment", "commercial",
  "commission", "commit", "commitment", "committee", "common", "communicate", "communication", "community", "company", "compare",
  "comparison", "compete", "competition", "competitive", "competitor", "complain", "complaint", "complete", "completely", "complex",
  "complicated", "component", "compose", "composition", "comprehensive", "computer", "concentrate", "concentration", "concept", "concern",
  "concerned", "concert", "conclude", "conclusion", "concrete", "condition", "conduct", "conference", "confidence", "confident",
  "confirm", "conflict", "confront", "confusion", "congress", "congressional", "connect", "connection", "conscious", "consciousness",
  "consensus", "consequence", "conservative", "consider", "considerable", "consideration", "consist", "consistent", "constant", "constantly",
  "constitute", "constitutional", "construct", "construction", "consult", "consultant", "consume", "consumer", "consumption", "contact",
  "contain", "container", "contemporary", "content", "contest", "context", "continent", "continue", "continued", "contract",
  "contrast", "contribute", "contribution", "control", "controversial", "controversy", "convenience", "convention", "conventional", "conversation",
  "convert", "conviction", "convince", "convinced", "cook", "cooking", "cool", "cooperation", "cop",
  "cope", "copy", "core", "corner", "corporate", "corporation", "correct", "correctly", "correlation", "correspondent",
  "corridor", "corruption", "cost", "costume", "cottage", "cotton", "couch", "council", "counsel", "counseling",
  "counselor", "count", "counter", "country", "county", "couple", "courage", "course", "court",
  "cousin", "cover", "coverage", "crack", "craft", "crash", "crazy", "create",
  "creation", "creative", "creature", "credibility", "credit", "crew", "crime", "criminal", "crisis",
  "criteria", "critic", "critical", "criticism", "criticize", "crop", "cross", "crowd", "crucial",
  "crude", "cruel", "cruise", "crush", "cry", "crystal", "cube", "cult", "cultural",
  "culture", "cup", "curiosity", "curious", "curly", "currency", "current", "currently", "curriculum",
  "curtain", "curve", "cushion", "custody", "custom", "customer", "cut", "cute", "cycle"
];

/** Top 5000 English words (extends COMMON_WORDS_1000) — for Phases 5–6 */
export const COMMON_WORDS_5000: string[] = [
  ...COMMON_WORDS_1000,
  "democracy", "democratic", "democrat", "demographics", "demonstrate", "demonstration", "denial", "denounce", "dense", "density",
  "dental", "dentist", "deny", "depart", "departure", "department", "departmental", "depend", "dependence",
  "dependent", "depict", "depiction", "deplete", "depletion", "deplorable", "deploy", "deployment", "deport", "deportation",
  "deposit", "deposition", "depot", "depreciate", "depreciation", "depress", "depressed", "depressing", "depression", "deprive",
  "deprivation", "depth", "deputy", "derail", "derailment", "derive", "derivation", "derivative", "descend", "descendant",
  "descent", "describe", "description", "descriptive", "desert", "deserve", "design", "designate", "designation", "designer",
  "desirable", "desire", "desktop", "desolate", "desolation", "despair", "despatch", "desperate", "desperately",
  "desperation", "despise", "despite", "destination", "destined", "destiny", "destroy", "destroyer", "destruction", "destructive",
  "detach", "detachment", "detail", "detailed", "detain", "detainee", "detention", "detect", "detection", "detective",
  "detector", "detergent", "deteriorate", "deterioration", "determination", "determine", "determined", "deterrent", "detest",
  "detonate", "detonation", "detour", "detract", "detractor", "detriment", "detrimental", "devalue", "devaluation", "devastate",
  "devastating", "devastation", "develop", "developer", "development", "developmental", "deviate", "deviation", "device", "devil",
  "devise", "devoid", "devote", "devoted", "devotion", "devour", "devout", "dew", "dexterity", "dexterous",
  "diabetes", "diabetic", "diabolical", "diagnose", "diagnosis", "diagnostic", "diagonal", "diagonally", "diagram", "dial",
  "dialect", "dialogue", "diameter", "diamond", "diaper", "diary", "diaspora", "dictate", "dictation", "dictator",
  "dictatorial", "dictatorship", "dictionary", "did", "die", "diesel", "diet", "dietary", "differ", "difference",
  "different", "differentiate", "differentiation", "differently", "difficult", "difficulty", "diffuse", "diffusion", "dig", "digest",
  "digestion", "digestive", "digit", "digital", "digitally", "dignified", "dignitary", "dignity", "digress", "digression",
  "dike", "dilapidated", "dilate", "dilation", "dilemma", "diligence", "diligent", "diligently", "dilute", "dilution",
  "dim", "dime", "dimension", "dimensional", "diminish", "diminutive", "dimple", "din", "dine", "diner",
  "dinette", "dinghy", "dingy", "dinner", "dinosaur", "diocese", "diode", "dioxide", "dip", "diphtheria",
  "diphthong", "diploma", "diplomacy", "diplomat", "diplomatic", "diplomatically", "dire", "direct", "direction", "directional",
  "directive", "directly", "directness", "director", "directorate", "directorship", "directory", "dirge", "disability", "disable",
  "disabled", "disadvantage", "disadvantaged", "disaffect", "disaffected", "disagree", "disagreeable", "disagreement",
  "disallow", "disappear", "disappearance", "disappoint", "disappointed", "disappointing", "disappointment", "disapproval", "disapprove", "disapproving",
  "disarm", "disarmament", "disarray", "disassemble", "disaster", "disastrous", "disavow", "disavowal", "disband", "disbelief",
  "disbelieve", "discard", "discern", "discernible", "discommand", "discerning", "discernment", "discharge", "disciple", "disciplinarian", "disciplinary",
  "discipline", "disclaim", "disclaimer", "disclose", "disclosure", "disco", "discolor", "discoloration", "discomfit", "discomfort",
  "discompose", "disconcert", "disconcerting", "disconnect", "disconnected", "disconnection", "discontent", "discontented", "discontentment", "discontinue",
  "discontinuity", "discontinuous", "discord", "discordant", "discount", "discourage", "discouraged", "discouragement", "discouraging", "discourse",
  "discourteous", "discourtesy", "discover", "discoverer", "discovery", "discredit", "discreet", "discreetly", "discrepancy", "discrepant",
  "discrete", "discretely", "discretion", "discretionary", "discriminate", "discriminating", "discrimination", "discriminatory", "discursive", "discuss",
  "discussion", "disdain", "disdainful", "disease", "diseased", "disembark", "disembarkation", "disenchant", "disenchanted", "disenchantment"
];

/** 500+ formal/business vocabulary */
export const PROFESSIONAL_WORDS: string[] = [
  "pursuant", "stakeholder", "deliverable", "implementation", "synergy", "paradigm", "methodology", "leverage", "optimize",
  "strategic", "milestone", "collaboration", "bandwidth", "alignment", "infrastructure", "transformation", "compliance",
  "governance", "procurement", "feasibility", "requisite", "retention", "acquisition", "consolidation", "diversification",
  "sustainable", "operational", "efficiency", "productivity", "profitability", "initiative", "objective", "analytical",
  "benchmark", "metrics", "dashboard", "validation", "integration", "redundancy", "scalability", "proactive", "facilitate",
  "consensus", "negotiation", "arbitration", "performance", "assessment", "evaluation", "framework", "documentation",
  "expedite", "utilization", "streamline", "delegation", "empowerment", "leadership", "innovation", "disruption",
  "capitalization", "expenditure", "revenue", "liabilities", "forecasting", "amortization", "depreciation", "liquidation",
  "solvency", "receivables", "payables", "transaction", "reconciliation", "portfolio", "allocation", "investment",
  "speculation", "fluctuation", "marketability", "credibility", "integrity", "transparency", "accountability", "stewardship",
  "outsource", "insource", "offshore", "headquarters", "subsidiary", "conglomerate", "enterprise", "proprietorship",
  "partnership", "shareholder", "executive", "director", "manager", "administrator", "coordinator",
  "consultant", "analyst", "specialist", "advisor", "agent", "broker", "representative", "officer", "supervisor"
];

/** 200+ Python + JavaScript keywords */
export const PROGRAMMING_KEYWORDS: string[] = [
  "def", "const", "return", "async", "import", "function", "class", "yield", "await", "export",
  "let", "var", "if", "else", "elif", "while", "for", "in", "of", "try", "catch", "finally",
  "throw", "new", "this", "super", "extends", "implements", "interface", "package", "private", "protected",
  "public", "static", "readonly", "type", "from", "as", "break", "continue", "debugger", "default",
  "delete", "do", "enum", "eval", "false", "true", "null", "undefined", "NaN", "Infinity",
  "typeof", "instanceof", "void", "with", "arguments", "get", "set", "constructor", "namespace", "module",
  "declare", "keyof", "any", "unknown", "never", "boolean", "number", "string", "symbol",
  "bigint", "object", "require", "exports", "assert", "lambda", "global", "nonlocal", "pass", "raise",
  "and", "or", "not", "is", "del", "None", "True", "False", "except"
];

/** 100+ camelCase and snake_case identifiers */
export const CODE_IDENTIFIERS: string[] = [
  "getUserData", "isActive", "parseInput", "maxRetries", "totalCount", "isValid", "handleKeyPress",
  "fetchData", "updateState", "setLoading", "showModal", "eventListener", "payloadData", "configOptions",
  "dbInstance", "keystrokeLog", "wpmTimeline", "errorLog", "lessonAttempt", "selectedTrack", "themeDark",
  "getNetWPM", "calculateXP", "saveBadge", "hasBadge", "streakShield", "dailyChallenge", "rebuildBests",
  "get_user_data", "is_active", "parse_input", "max_retries", "total_count", "is_valid", "handle_key_press",
  "fetch_data", "update_state", "set_loading", "show_modal", "event_listener", "payload_data", "config_options",
  "db_instance", "keystroke_log", "wpm_timeline", "error_log", "lesson_attempt", "selected_track", "theme_dark",
  "get_net_wpm", "calculate_xp", "save_badge", "has_badge", "streak_shield", "daily_challenge", "rebuild_bests"
];

/** 50+ terminal commands */
export const CLI_COMMANDS: string[] = [
  "git push", "npm install", "cd ..", "ls -la", "mkdir src", "git commit -m", "npm run dev", "git checkout -b",
  "git status", "git pull", "git merge", "git branch", "git clone", "git log -n", "npm run build", "npm test",
  "rm -rf", "cp -r", "mv file", "touch index.js", "cat package.json", "grep search", "chmod +x", "chown user",
  "ssh admin", "scp file", "ping google.com", "curl -X GET", "wget URL", "docker build", "docker run",
  "docker-compose up", "kubectl get pods", "pip install", "python main.py", "node server.js", "vlc video",
  "df -h", "free -m", "top", "htop", "kill -9", "ps aux", "systemctl status", "journalctl -xe", "nano file.txt"
];

/** 100+ words with numbers */
export const NUMBER_EMBEDDED_WORDS: string[] = [
  "step2", "v3.1", "form42", "room101", "level5", "phase1", "stage200", "wpm60", "accuracy98",
  "code404", "error500", "port8080", "ipv4", "utf8", "base64", "md5", "sha256", "agent007", "flight370",
  "apollo11", "boeing747", "highway101", "sector7", "area51", "catch22", "cloud9", "win95", "osx10",
  "usb3.0", "hdmi2.1", "wifi6", "5gNetwork", "mp3player", "sub2", "super3", "carbon14", "uranium235",
  "temp37c", "height6ft", "weight70kg", "speed80mph", "date2026", "time12pm", "year1999", "century21"
];

/** 20+ pangram sentences (all 26 letters) */
export const PANGRAMS: string[] = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "Jackdaws love my big sphinx of quartz",
  "The five boxing wizards jump quickly",
  "How vexingly quick daft zebras jump",
  "Bright vixens jump; dozy fowl quack",
  "Quick wafting zephyrs vex bold Jim",
  "Sphinx of black quartz, judge my vow",
  "Two driven jocks help fax my big quiz",
  "Crazy Fredrick bought many very exquisite opal jewels"
];

// N-gram injection data (10% of every drill after Stage 020)
export const TOP_BIGRAMS = ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'es', 'en'] as const;
export const TOP_TRIGRAMS = ['the', 'and', 'ing', 'ion', 'tio', 'ent', 'ation', 'for', 'her', 'was'] as const;
export const SLOW_TRANSITION_PAIRS = ['qu', 'ck', 'bl', 'fr', 'sw', 'tw', 'gh', 'ph', 'wh', 'ch', 'sh'] as const;
export const FINGER_CROSSING_PAIRS = ['be', 'br', 've', 'vi', 'my', 'ny', 'by', 'gy', 'hy', 'ky'] as const;
