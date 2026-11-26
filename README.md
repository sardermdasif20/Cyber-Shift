# CYBER//SHIFT — SOC Defense Simulator

A modern, cyberpunk-inspired browser game where you act as a junior Security Operations Center (SOC) analyst. Investigate fictional alerts, identify phishing clues, prioritize events, and practice safer password habits.

![CYBER SHIFT](assets/preview.svg)

## Features

- Responsive command-center dashboard with animated radar and simulated network telemetry
- Three playable missions: Phishing or Friendly?, Alert Triage, and Password Fortress
- Score, mission completion, and simulated activity feed
- Threat intelligence cards and a defensive field guide
- No build tools, package manager, backend, or API keys required
- Runs locally in a modern browser; progress resets on refresh

## Run locally

1. Download and extract the ZIP.
2. Open the extracted `cyber_shift` folder.
3. Double-click `index.html` to launch the game.

For a local development server (optional):

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a new public GitHub repository, for example `cyber-shift`.
2. Upload the contents of this folder to the repository root (make sure `index.html` is at the root).
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for GitHub Pages to publish your site. The Pages URL will appear in that section.

## Project structure

```text
cyber_shift/
├── index.html
├── styles.css
├── game.js
├── README.md
├── DISCLAIMER.md
├── LICENSE
└── assets/
    ├── favicon.svg
    └── preview.svg
```

## AI-generation and originality disclaimer

This project was created with assistance from an AI system. The interface, game concept, text, and code were AI-generated or AI-assisted and may contain errors or limitations. The repository owner should review, test, and customize the project before presenting or distributing it. Do not claim that AI-generated work was entirely hand-written. See [DISCLAIMER.md](DISCLAIMER.md).

## Safety scope

This is a fictional educational simulation. It does not perform real penetration testing, scan devices or networks, collect credentials, exploit vulnerabilities, or communicate with external systems. All incidents and indicators are invented for gameplay. Only perform real security testing on systems you own or have explicit permission to test.

## License

MIT — see [LICENSE](LICENSE).
