# Portfolio Builder

**Portfolio Builder** is a **no-code web app** that helps anyone create a beautiful personal portfolio website in minutes — simply by selecting a template and uploading their resume.

No coding. No design skills. Just upload → customize → publish ✨

---

## Features

* **Resume → Portfolio Auto Generation**
  Upload your resume (PDF) and automatically populate your portfolio content.

* **Ready-to-use Templates**
  Professionally designed templates optimized for developers, designers, students, and professionals.

* **Magic Editing Experience**
  Edit sections visually with live preview — no HTML, no CSS.

* **One-click Publish**
  Instantly publish your portfolio and share it with the world.

* **Dark-theme Friendly UI**
  Clean, modern interface designed for long sessions.

* **Secure Authentication**
  Sign in using GitHub (more providers coming soon).

---

## Who is this for?

* Students & freshers building their first portfolio
* Developers who don’t want to design from scratch
* Designers who want fast personal sites
* Professionals showcasing work, projects, or resumes

---

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Authentication:** NextAuth (GitHub OAuth)
* **File Parsing:** PDF parsing
* **Gemini:** Data Extraction

---

## Project Structure

```bash
portfolio-builder/
├── app/                # App router pages
├── components/         # Reusable UI components
├── templates/          # Portfolio templates
├── public/             # Static assets
├── styles/             # Global styles
├── lib/                # Utilities & helpers
└── README.md
```

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/YashLoriya02/portfolio-builder.git
cd portfolio-builder
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env.local` file:

```env
AUTH_SECRET="any_secret"
AUTH_GITHUB_ID="github_id"
AUTH_GITHUB_SECRET="github_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="gemini_api_key"
GITHUB_TEMPLATE_OWNER="github_owner"
GITHUB_TEMPLATE_REPO="portfolio-template"
GITHUB_TEMPLATE_DEFAULT_BRANCH="main"
NEXTAUTH_URL="http://localhost:3000"

```

### Run the app

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Routes & Pages

| Route        | Description        |
| ------------ | ------------------ |
| `/`          | Landing page       |
| `/login`     | Authentication     |
| `/dashboard` | User dashboard     |
| `/templates` | Template selection |
| `/editor`    | Resume Extraction  |
| `/publish`   | Publish portfolio  |

---

## Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## Vision

Portfolio Builder aims to **democratize personal branding** —
so anyone, regardless of technical background, can showcase their work professionally.
