# jeffnyman.github.io

Source for my GitHub landing page at <https://jeffnyman.github.io>.

Plain HTML, CSS, and JavaScript. No build step.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page shell: hero, the work/play chooser, footer |
| `style.css` | All styling, including the "play" (CRT) theme |
| `js/projects.js` | **Curated content**: featured projects and the groupings for each side |
| `js/repos-snapshot.js` | Generated metadata for all public repos (fallback data) |
| `js/main.js` | Rendering, hash routing (`#work`, `#play`, `#all`), live GitHub API refresh |
| `scripts/update-snapshot.sh` | Regenerates the snapshot with `gh` |

## Common edits

- **Add or move a project:** edit `js/projects.js`. Only the repo name is required;
  description, stars, and dates come from GitHub automatically.
- **Change featured projects:** edit `featured.work` / `featured.play` in `js/projects.js`.
- **Refresh the fallback data:** `./scripts/update-snapshot.sh`.

The browser fetches fresh repo data from the GitHub API (cached per session).
If the API is unavailable or rate-limited, the snapshot is used instead.

## Run locally

Any static server works, for example:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>.
