(() => {
  "use strict";

  const SITE = window.SITE;
  const root = document.documentElement;
  const content = document.getElementById("content");
  const dataSource = document.getElementById("data-source");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Repo metadata: snapshot first, live API refresh second ---------- */

  let repos = new Map((window.REPOS_SNAPSHOT || []).map((r) => [r.name, r]));
  let liveLoaded = false;

  const CACHE_KEY = "jn-repos-v1";
  const CACHE_TTL = 60 * 60 * 1000; // one hour

  function safeStorage(fn) {
    try { return fn(); } catch { return null; }
  }

  function normalizeApiRepo(r) {
    return {
      name: r.name,
      description: r.description || "",
      homepage: r.homepage || "",
      language: r.language || "",
      stars: r.stargazers_count || 0,
      pushed: r.pushed_at,
      archived: !!r.archived,
      topics: r.topics || [],
      fork: !!r.fork,
    };
  }

  async function loadLiveRepos() {
    const cached = safeStorage(() => JSON.parse(sessionStorage.getItem(CACHE_KEY)));
    if (cached && Date.now() - cached.at < CACHE_TTL) return cached.repos;

    const all = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(
        `https://api.github.com/users/${SITE.user}/repos?per_page=100&page=${page}&sort=pushed&type=owner`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const batch = await res.json();
      all.push(...batch);
      if (batch.length < 100) break;
    }
    const list = all.filter((r) => !r.fork && !r.private).map(normalizeApiRepo);
    safeStorage(() => sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos: list })));
    return list;
  }

  loadLiveRepos()
    .then((list) => {
      if (!list || !list.length) return;
      repos = new Map(list.map((r) => [r.name, r]));
      liveLoaded = true;
      dataSource.textContent = "Repository data live from GitHub";
      render(currentView(), { keepScroll: true });
    })
    .catch(() => {
      /* Rate-limited or offline: the snapshot is already on screen. */
    });

  /* ---------- Helpers ---------- */

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const repoUrl = (name) => `https://github.com/${SITE.user}/${name}`;

  function relDate(iso) {
    if (!iso) return "";
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (days < 1) return "today";
    if (days < 2) return "yesterday";
    if (days < 31) return `${days} days ago`;
    const months = Math.floor(days / 30.4);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  /* Merge curated entry with live/snapshot metadata. Curated fields win. */
  function resolve(entry) {
    const meta = repos.get(entry.repo) || {};
    let demo = entry.demo || "";
    if (!demo && meta.homepage && meta.homepage.includes(`${SITE.user}.github.io`)) demo = meta.homepage;
    return {
      name: entry.repo,
      desc: entry.desc || meta.description || "",
      lang: entry.lang || meta.language || "",
      tags: entry.tags || [],
      demo,
      stars: meta.stars || 0,
      pushed: meta.pushed || "",
    };
  }

  const STAR_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .9l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.3l-4.5 2.4.9-5L.8 6.2l5-.7L8 .9z"/></svg>';

  function card(entry, { featured = false } = {}) {
    const r = resolve(entry);
    const meta = [
      r.lang && `<span class="lang"><i class="dot" data-lang="${esc(r.lang)}"></i>${esc(r.lang)}</span>`,
      r.stars > 0 && `<span class="stars" title="${r.stars} star${r.stars > 1 ? "s" : ""}">${STAR_SVG}${r.stars}</span>`,
      r.pushed && `<span class="updated" title="${esc(new Date(r.pushed).toLocaleDateString())}">Updated ${relDate(r.pushed)}</span>`,
    ].filter(Boolean).join("");

    const tags = r.tags.length
      ? `<ul class="tags">${r.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      : "";

    const demoLink = r.demo
      ? `<a class="btn btn-demo" href="${esc(r.demo)}" target="_blank" rel="noopener">${root.dataset.mode === "play" ? "Play" : "Live demo"} <span aria-hidden="true">&nearr;</span></a>`
      : "";

    return `
      <article class="card${featured ? " card-featured" : ""}${r.demo ? " has-demo" : ""}">
        <h4 class="card-title"><a href="${repoUrl(r.name)}" target="_blank" rel="noopener">${esc(r.name)}</a></h4>
        <p class="card-desc">${esc(r.desc) || '<span class="muted">No description.</span>'}</p>
        ${tags}
        <div class="card-foot">
          <div class="card-meta">${meta}</div>
          <div class="card-actions">
            ${demoLink}
            <a class="btn" href="${repoUrl(r.name)}" target="_blank" rel="noopener">Code</a>
          </div>
        </div>
      </article>`;
  }

  function group(g, i) {
    const cards = g.repos.map((e) => card(e)).join("");
    const body = `<div class="grid">${cards}</div>`;
    const head = `<h3 class="section-title">${esc(g.title)} <span class="count">${g.repos.length}</span></h3>
      ${g.blurb ? `<p class="section-blurb">${esc(g.blurb)}</p>` : ""}`;
    if (g.collapsed) {
      return `<section class="group fade-in" style="--i:${i}">
        <details>
          <summary>${head}</summary>
          ${body}
        </details>
      </section>`;
    }
    return `<section class="group fade-in" style="--i:${i}">${head}${body}</section>`;
  }

  /* ---------- Views ---------- */

  function viewHome() {
    return `
      <section class="group fade-in" style="--i:0">
        <h3 class="section-title">Highlights</h3>
        <p class="section-blurb">A few things from each side. Pick a door above to see more.</p>
        <div class="grid grid-featured">
          ${[...SITE.featured.work.slice(0, 2), ...SITE.featured.play.slice(0, 2)].map((e) => card(e, { featured: true })).join("")}
        </div>
      </section>
      ${group(SITE.crossover, 1)}`;
  }

  function viewSide(side) {
    const intro = side === "work"
      ? `<p class="lede">Test solution development: frameworks, teaching projects, and the applications I build so there is something real to test.</p>`
      : `<p class="lede">&gt; Retro game players, Z-machine interpreters, and interactive fiction tooling. Some of it runs right in your browser.</p>`;
    const featured = `
      <section class="group fade-in" style="--i:0">
        <h3 class="section-title">Featured</h3>
        <div class="grid grid-featured">${SITE.featured[side].map((e) => card(e, { featured: true })).join("")}</div>
      </section>`;
    const groups = SITE[side].map((g, i) => group(g, i + 1)).join("");
    return intro + featured + groups + group(SITE.crossover, SITE[side].length + 1);
  }

  function viewAll() {
    const langs = [...new Set([...repos.values()].map((r) => r.language).filter(Boolean))].sort();
    return `
      <section class="group fade-in" style="--i:0">
        <h3 class="section-title">All repositories <span class="count" id="all-count"></span></h3>
        <p class="section-blurb">Every public repository, most recently updated first${liveLoaded ? "" : " (from snapshot)"}.</p>
        <div class="filters">
          <label class="search">
            <span class="sr-only">Search repositories</span>
            <input id="q" type="search" placeholder="Search by name, description, or topic…" autocomplete="off">
          </label>
          <label class="select">
            <span class="sr-only">Language</span>
            <select id="lang">
              <option value="">All languages</option>
              ${langs.map((l) => `<option>${esc(l)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="grid" id="all-grid"></div>
      </section>`;
  }

  function wireAll() {
    const q = document.getElementById("q");
    const lang = document.getElementById("lang");
    const grid = document.getElementById("all-grid");
    const count = document.getElementById("all-count");
    const list = [...repos.values()].sort((a, b) => (b.pushed || "").localeCompare(a.pushed || ""));

    function update() {
      const term = q.value.trim().toLowerCase();
      const l = lang.value;
      const hits = list.filter((r) =>
        (!l || r.language === l) &&
        (!term || `${r.name} ${r.description} ${(r.topics || []).join(" ")}`.toLowerCase().includes(term))
      );
      count.textContent = hits.length;
      grid.innerHTML = hits.length
        ? hits.map((r) => card({ repo: r.name, tags: r.topics })).join("")
        : `<p class="empty">Nothing matches that. ${root.dataset.mode === "play" ? "It is pitch dark." : ""}</p>`;
    }
    q.addEventListener("input", update);
    lang.addEventListener("change", update);
    update();
  }

  /* ---------- Routing ---------- */

  const VIEWS = ["work", "play", "all"];
  const currentView = () => {
    const h = location.hash.replace("#", "");
    return VIEWS.includes(h) ? h : "home";
  };

  function render(view, { keepScroll = false } = {}) {
    // Preserve "All" filter state across a live-data re-render.
    const prevQ = document.getElementById("q")?.value;
    const prevLang = document.getElementById("lang")?.value;

    root.dataset.mode = view;
    document.title = { home: "Jeff Nyman", work: "Jeff Nyman · Work", play: "Jeff Nyman · Play", all: "Jeff Nyman · All repositories" }[view];

    document.querySelectorAll("[data-target]").forEach((a) => {
      if (a.dataset.target === view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    content.innerHTML = view === "home" ? viewHome() : view === "all" ? viewAll() : viewSide(view);

    if (view === "all") {
      if (prevQ != null) document.getElementById("q").value = prevQ;
      if (prevLang != null) document.getElementById("lang").value = prevLang;
      wireAll();
    }

    if (!keepScroll && view !== "home") {
      document.querySelector(".doors").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  window.addEventListener("hashchange", () => render(currentView()));
  render(currentView(), { keepScroll: true });

  /* ---------- Typed tagline ---------- */

  const typed = document.querySelector(".typed");
  if (typed) {
    const words = JSON.parse(typed.dataset.words);
    if (reduceMotion) {
      typed.textContent = words[0];
    } else {
      let w = 0, i = 0, deleting = false;
      const tick = () => {
        const word = words[w];
        i += deleting ? -1 : 1;
        typed.textContent = word.slice(0, i);
        let delay = deleting ? 35 : 70;
        if (!deleting && i === word.length) { delay = 2200; deleting = true; }
        else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
        setTimeout(tick, delay);
      };
      tick();
    }
  }
})();
