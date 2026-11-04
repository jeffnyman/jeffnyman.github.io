/*
 * Curated project data.
 *
 * Each "side" (work / play) has a list of groups; each group has a list of repos.
 * A repo entry only needs `repo` (the GitHub repo name). Everything else is optional:
 *   desc  - overrides the GitHub description
 *   demo  - a live URL (defaults to nothing; most Pages sites are listed explicitly)
 *   lang  - language label shown on the card
 *   tags  - small labels
 *
 * Star counts and "last updated" dates are filled in live from the GitHub API
 * when available, so you never have to maintain those here.
 */

const GH_USER = "jeffnyman";
const PAGES = (r) => `https://${GH_USER}.github.io/${r}/`;

window.SITE = {
  user: GH_USER,

  featured: {
    work: [
      {
        repo: "playwright-eschaton",
        desc: "A pedagogical pastiche of Playwright: a teaching project built with TypeScript and cucumber-js.",
        lang: "TypeScript",
        tags: ["playwright", "cucumber-js"],
      },
      {
        repo: "llm-eval-lab",
        desc: "Multi-backend LLM routing, observability, and evaluation lab.",
        lang: "Python",
        tags: ["ai", "evaluation"],
      },
      {
        repo: "knight-of-the-bug",
        desc: "A pedagogical exploration into bug hunting, playable in the browser.",
        demo: PAGES("knight-of-the-bug"),
        lang: "JavaScript",
        tags: ["testing", "game"],
      },
    ],
    play: [
      {
        repo: "improbable-mission",
        desc: "A faithful recreation of the 1984 puzzle-platformer \"Impossible Mission\" by Epyx.",
        demo: PAGES("improbable-mission"),
        lang: "Assembly",
        tags: ["c64"],
      },
      {
        repo: "quendor",
        desc: "A Z-Machine interpreter and debugger.",
        demo: PAGES("quendor"),
        lang: "TypeScript",
        tags: ["z-machine", "infocom"],
      },
      {
        repo: "gauntlet-reforged",
        desc: "A web implementation of Atari's Gauntlet.",
        demo: PAGES("gauntlet-reforged"),
        lang: "JavaScript",
        tags: ["atari"],
      },
    ],
  },

  work: [
    {
      title: "Playwright",
      blurb: "Pedagogical projects covering UI, API, component, and BDD-style testing.",
      repos: [
        { repo: "playwright-eschaton", lang: "TypeScript" },
        { repo: "playwright-ui", lang: "TypeScript" },
        { repo: "playwright-api", lang: "TypeScript" },
        { repo: "playwright-react-ui", lang: "TypeScript" },
        { repo: "playwright-vue-component", lang: "TypeScript" },
        { repo: "playwright-vue-quasar", lang: "JavaScript" },
        { repo: "playwright-cucumber", lang: "TypeScript" },
        { repo: "playwright-hudl", lang: "TypeScript" },
      ],
    },
    {
      title: "Cypress",
      blurb: "Learning and teaching projects for Cypress automation.",
      repos: [
        { repo: "cypress-eschaton", lang: "JavaScript" },
        { repo: "cypress-playground", lang: "JavaScript" },
        { repo: "cypress-realworld-example", lang: "JavaScript" },
        { repo: "cypress-voyage-example", lang: "HTML" },
      ],
    },
    {
      title: "Applications to test against",
      blurb: "Apps and APIs built specifically to give testers something realistic to practice on.",
      repos: [
        { repo: "veilus", lang: "HTML" },
        { repo: "devcamper_api", lang: "JavaScript" },
        { repo: "spec-workshop", lang: "HTML" },
        { repo: "quasar-balancehub", lang: "JavaScript" },
        { repo: "thanos-react", lang: "JavaScript" },
      ],
    },
    {
      title: "AI & testing",
      blurb: "Evaluating LLMs, and using AI as both subject and tool of testing.",
      repos: [
        { repo: "llm-eval-lab", lang: "Python" },
        { repo: "ai-and-testing", lang: "Python" },
        { repo: "pacumen", lang: "Python" },
        { repo: "flappy-tester", lang: "Python" },
      ],
    },
    {
      title: "Testing practice & examples",
      blurb: "Smaller examples of test libraries, languages, and techniques.",
      repos: [
        { repo: "js-testing-script-examples", lang: "JavaScript" },
        { repo: "expectify", lang: "Python" },
        { repo: "primecalc-go-testing", lang: "Go" },
        { repo: "prism-learning", lang: "JavaScript" },
        { repo: "benchmarker_rails", lang: "Ruby" },
        { repo: "testable-java", lang: "Java" },
        { repo: "api_testing_with_java", lang: "Java" },
      ],
    },
    {
      title: "Ruby test frameworks (archive)",
      blurb: "Earlier micro-frameworks and libraries for fluent, expressive automation.",
      collapsed: true,
      repos: [
        { repo: "tapestry", lang: "Ruby" },
        { repo: "webdriver_manager", lang: "Ruby" },
        { repo: "symbiont", lang: "Ruby" },
        { repo: "test_performance", lang: "Ruby" },
        { repo: "data_builder", lang: "Ruby" },
        { repo: "yard-lucid", lang: "Ruby" },
        { repo: "lucid", lang: "Ruby" },
        { repo: "testable", lang: "Ruby" },
        { repo: "test_workflow", lang: "Ruby" },
        { repo: "lucid_checkup", lang: "Ruby" },
        { repo: "specify", lang: "Ruby" },
        { repo: "lucid-groovy", lang: "Groovy" },
        { repo: "scribal", lang: "JavaScript" },
      ],
    },
  ],

  play: [
    {
      title: "Play in your browser",
      blurb: "Ports and recreations you can run right now.",
      repos: [
        { repo: "improbable-mission", demo: PAGES("improbable-mission"), lang: "Assembly" },
        { repo: "adventure-uncartridged", demo: PAGES("adventure-uncartridged"), lang: "TypeScript" },
        { repo: "gauntlet-reforged", demo: PAGES("gauntlet-reforged"), lang: "JavaScript" },
        { repo: "beyond-zork-web", demo: PAGES("beyond-zork-web"), lang: "JavaScript" },
        { repo: "quendor", demo: PAGES("quendor"), lang: "TypeScript" },
        { repo: "rezrov-rust", demo: PAGES("rezrov-rust"), lang: "Rust" },
      ],
    },
    {
      title: "Retro game players",
      blurb: "Engines and players for classic games and platforms.",
      repos: [
        { repo: "daventry", lang: "C#" },
        { repo: "maniacal", lang: "C#" },
        { repo: "distaff", lang: "C#" },
        { repo: "retrograde", lang: "C#" },
        { repo: "gue", lang: "C#" },
        { repo: "laser-vault", lang: "C" },
        { repo: "laserdisc-archive" },
        { repo: "defender-redlabel", lang: "Go" },
        { repo: "defender-retro", lang: "Assembly" },
      ],
    },
    {
      title: "Z-Machine & interactive fiction interpreters",
      blurb: "The same machine, implemented many ways.",
      repos: [
        { repo: "voxam", lang: "Python" },
        { repo: "quendor-py", lang: "Python" },
        { repo: "quendor-rs", lang: "Rust" },
        { repo: "quendor-cs", lang: "C#" },
        { repo: "rezrov", lang: "C#" },
        { repo: "voxam-rs", lang: "Rust" },
        { repo: "voxam-zmachine", lang: "JavaScript" },
        { repo: "quiddity", lang: "HTML" },
      ],
    },
    {
      title: "Z-Machine reference & resources",
      blurb: "Specifications, examples, and tools for interpreter writers.",
      repos: [
        { repo: "z-machine-standard", demo: PAGES("z-machine-standard"), lang: "HTML" },
        { repo: "zmachine", lang: "ZIL" },
        { repo: "zifmia", lang: "ZIL" },
        { repo: "entharion", lang: "ZIL" },
        { repo: "zil-retro", lang: "ZIL" },
        { repo: "ztools", lang: "C" },
        { repo: "zpatchy", lang: "C" },
      ],
    },
    {
      title: "Inform & TADS authoring",
      blurb: "Toolchains, editors, and distributions for writing interactive fiction.",
      repos: [
        { repo: "inform-builder", lang: "Python" },
        { repo: "inform-ecosystem-vscode", lang: "TypeScript" },
        { repo: "reform6", lang: "C" },
        { repo: "informing", lang: "CWeb" },
        { repo: "informed", lang: "CWeb" },
        { repo: "inform-playground", lang: "Inform 7" },
        { repo: "inform6-playground", lang: "C" },
        { repo: "tads3-playground", lang: "C" },
        { repo: "vscode-tads3" },
        { repo: "trinity-remythologized", lang: "Inform 7" },
      ],
    },
    {
      title: "Parsers, experiments & writing",
      blurb: "Smaller explorations in game construction, plus book material.",
      collapsed: true,
      repos: [
        { repo: "voxam-parser", lang: "JavaScript" },
        { repo: "voxam-cpp", lang: "C++" },
        { repo: "cyberfish-2077", lang: "JavaScript" },
        { repo: "ludic-historian-book", lang: "BASIC" },
        { repo: "sdl_learning", lang: "C" },
      ],
    },
  ],

  /* Shown on both sides: where testing and games overlap. */
  crossover: {
    title: "Where the two meet",
    blurb: "Using games to think about testing, and testing to think about games.",
    repos: [
      { repo: "knight-of-the-bug", demo: PAGES("knight-of-the-bug"), lang: "JavaScript" },
      { repo: "grue-whisperer", lang: "TypeScript" },
      { repo: "exploring-testing", lang: "Inform 7" },
      { repo: "exploring_inform7", lang: "Inform 7" },
      { repo: "pacumen", lang: "Python" },
    ],
  },
};
