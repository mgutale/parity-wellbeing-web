# Parity Wellbeing — Static Website

A clean, fast static website for **Parity Wellbeing**, the iOS mental-health and wellbeing app.

🔗 **Live site:** [https://www.paritylabs.uk](https://www.paritylabs.uk)

---

## Overview

This repo powers the public-facing site for the Parity Wellbeing app. It includes all essential legal, product, and company pages, served via **GitHub Pages** with a custom domain (`paritylabs.uk`).

---

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Homepage — app features, download CTA |
| `about.html` | Company story — ParityLabs origin, values, timeline |
| `contact.html` | Contact form + email links (general, support, privacy, legal) |
| `support.html` | Help centre — FAQs, troubleshooting, account |
| `privacy.html` | Full privacy policy — data collection, encryption, health data |
| `gdpr.html` | GDPR compliance guide — rights, DPO contact, retention |
| `terms.html` | Terms of service — usage rules, liability, governing law |
| `cookies.html` | Cookie policy — what we use (spoiler: nothing third-party) |
| `auth/confirm.html` | Deep-link landing for Supabase email confirmation |

---

## Tech Stack

- **Pure HTML + CSS + Vanilla JS** — zero build step, zero dependencies
- **GitHub Pages** — free hosting on `mgutale.github.io/parity-wellbeing-web`
- **Custom domain** — `www.paritylabs.uk` (via Cloudflare DNS)

---

## Project Structure

```
.
├── index.html              # Homepage
├── about.html              # About ParityLabs
├── contact.html            # Contact & founder details
├── support.html            # Support / FAQ
├── privacy.html            # Privacy Policy
├── gdpr.html               # GDPR Compliance
├── terms.html              # Terms of Service
├── cookies.html            # Cookie Policy
├── auth/
│   └── confirm.html        # Supabase auth deep-link
├── styles.css              # Shared stylesheet
├── main.js                 # Mobile nav + scroll reveal
├── .nojekyll               # Disable Jekyll processing
└── README.md               # This file
```

---

## Local Development

No build server needed. Just open any `.html` file in a browser:

```bash
cd /path/to/parity-wellbeing-web
python3 -m http.server 8000
# open http://localhost:8000
```

Or use VS Code **Live Server** extension.

---

## Deployment

Pushes to the `main` branch auto-deploy to GitHub Pages.

```bash
git add -A
git commit -m "Update copy"
git push origin main
```

GitHub Pages → `https://mgutale.github.io/parity-wellbeing-web` → redirects to `www.paritylabs.uk`.

---

## Domain Setup

- **DNS:** Cloudflare A/CNAME records pointing to GitHub Pages IPs
- **Enforcement:** GitHub repo Settings → Pages → Custom domain = `www.paritylabs.uk`
- **HTTPS:** Enforced by Cloudflare + GitHub Pages

---

## Contact

- **General:** hello@paritylabs.uk
- **Support:** support@paritylabs.uk
- **Privacy:** privacy@paritylabs.uk
- **Founder (direct):** [mgutale@me.com](mailto:mgutale@me.com) / [@mgutale](https://x.com/mgutale)

---

## License

© ParityLabs Ltd. All rights reserved.