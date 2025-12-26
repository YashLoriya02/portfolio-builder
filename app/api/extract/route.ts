import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

function parsePdfToText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // pdf2json is event-based
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData?.parserError || errData);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      // Raw text with newlines in reading order
      const text = (pdfParser as any).getRawTextContent?.() || "";
      resolve(text);
    });

    // ✅ Parse directly from memory (no temp files)
    pdfParser.parseBuffer(buffer);
  });
}

type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

type Project = {
  name: string;
  link: string;
  tech: string[];
  description: string;
  highlights: string[];
  start: string;
  end: string;
};

type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  notes: string;
};

function cleanText(s: string) {
  return s
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function norm(s: string) {
  return (s || "").trim();
}

function isBullet(line: string) {
  return /^[•\-]\s+/.test(line);
}

function stripBullet(line: string) {
  return line.replace(/^[•\-]\s+/, "").trim();
}

function findEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function findPhone(text: string) {
  // Works for +91 8879029981, etc.
  const m = text.match(/(\+\d{1,3}\s*)?\d[\d\s-]{8,}\d/);
  return m?.[0]?.replace(/\s+/g, " ").trim() ?? "";
}

function findLinks(text: string) {
  const links = Array.from(text.matchAll(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/[^\s|)]*)?/g))
    .map((m) => m[0])
    // basic cleanup
    .map((l) => l.replace(/[|,]$/g, "").trim())
    .filter((l) => l.includes("."));

  const pick = (contains: string) =>
    links.find((l) => l.toLowerCase().includes(contains)) ?? "";

  const linkedin = pick("linkedin.com");
  const github = pick("github.com");
  const website =
    links.find(
      (l) =>
        !l.toLowerCase().includes("linkedin.com") &&
        !l.toLowerCase().includes("github.com") &&
        !l.toLowerCase().includes("@")
    ) ?? "";

  return { linkedin, github, website, all: links };
}

function splitSections(lines: string[]) {
  const headings = new Set([
    "Education",
    "Experience",
    "Projects",
    "Technical Skills",
    "Positions of Responsibility",
  ]);

  const sections: Record<string, string[]> = {};
  let current = "Header";
  sections[current] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (headings.has(line)) {
      current = line;
      sections[current] = sections[current] ?? [];
      continue;
    }

    sections[current].push(line);
  }

  return sections;
}

function parseEducation(block: string[]): Education[] {
  // Pattern in your sample:
  // Dwarkadas J. Sanghvi... Mumbai, India
  // B.Tech ... (CGPA: 8.56) 2022 – 2026
  // Sheth ... Mumbai, India
  // HSC ... 2020 – 2022

  const out: Education[] = [];
  for (let i = 0; i < block.length; i++) {
    const line = block[i];

    const looksLikeSchoolLine = /India$/i.test(line) || /Mumbai/i.test(line);
    const next = block[i + 1] ?? "";

    const yearRange = next.match(/(\d{4})\s*[–-]\s*(\d{4}|Present)/i);

    if (looksLikeSchoolLine && yearRange) {
      const school = line;
      const degreeLine = next;

      out.push({
        school,
        degree: degreeLine.replace(/\s*\d{4}\s*[–-]\s*(\d{4}|Present)\s*$/i, "").trim(),
        start: yearRange[1],
        end: yearRange[2],
        notes: "",
      });

      i++; // consumed next
    }
  }
  return out;
}

function parseExperience(block: string[]): Experience[] {
  // Pattern:
  // SDE Intern June 2024 – Present
  // Infiheal Remote / Mumbai
  // • bullet...
  // • bullet...
  // Full Stack Developer (Freelance) May 2024 – Sept 2024
  // Self Employed Remote
  // • bullet...

  const out: Experience[] = [];
  let i = 0;

  const dateRe = /(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[–-]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4})/i;

  while (i < block.length) {
    const line = block[i];
    const dateMatch = line.match(dateRe);

    if (dateMatch) {
      // role + dates are on same line
      const role = line.replace(dateRe, "").trim();
      const dates = line.match(dateRe)?.[0] ?? "";
      const [start, end] = dates.split(/[–-]/).map((x) => x.trim());

      const companyLine = block[i + 1] ?? "";
      const companyParts = companyLine.split(/\s{2,}|\s+\|\s+/g); // not always needed
      // in sample it’s "Infiheal Remote / Mumbai"
      const company = companyLine.split(" Remote")[0]?.trim() || companyLine.split(" Remote /")[0]?.trim() || companyLine;
      const location = companyLine.includes("Remote") ? companyLine.replace(company, "").trim() : "";

      i += 2;

      const highlights: string[] = [];
      while (i < block.length && isBullet(block[i])) {
        highlights.push(stripBullet(block[i]));
        i++;
      }

      out.push({
        role,
        company: norm(company),
        location: norm(location),
        start: norm(start),
        end: norm(end),
        highlights,
      });

      continue;
    }

    i++;
  }

  return out;
}

function parseProjects(block: string[]): Project[] {
  // Pattern:
  // Summarizer-CLI | Node.js, LLMs, NPM Jan 2024 – Present
  // • bullet...
  // Video Conferencing Platform | Next.js, Stream SDK, Clerk Jan 2024
  // • bullet...
  //
  // We'll treat "Jan 2024" without range as start=end.

  const out: Project[] = [];
  let i = 0;

  const rangeRe = /(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[–-]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4})/i;
  const singleRe = /(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i;

  while (i < block.length) {
    const line = block[i];

    // header lines usually contain "|"
    if (line.includes("|")) {
      const left = line.split("|")[0].trim();
      const right = line.split("|").slice(1).join("|").trim();

      let start = "";
      let end = "";

      const range = right.match(rangeRe)?.[0] ?? "";
      if (range) {
        const [s, e] = range.split(/[–-]/).map((x) => x.trim());
        start = s;
        end = e;
      } else {
        const single = right.match(singleRe)?.[0] ?? "";
        if (single) {
          start = single;
          end = single;
        }
      }

      const techPart = right
        .replace(rangeRe, "")
        .replace(singleRe, "")
        .trim();

      const tech = techPart
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

      i++;

      const bullets: string[] = [];
      while (i < block.length && isBullet(block[i])) {
        bullets.push(stripBullet(block[i]));
        i++;
      }

      out.push({
        name: left,
        link: "",
        tech,
        description: bullets[0] ?? "",
        highlights: bullets.slice(1),
        start,
        end,
      });

      continue;
    }

    i++;
  }

  return out;
}

function parseSkills(block: string[]) {
  // "Languages: ...", "Frameworks & Libraries: ...", etc.
  const groups: Record<string, string[]> = {};

  for (const line of block) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();

    const items = val.split(",").map((x) => x.trim()).filter(Boolean);
    groups[key] = items;
  }

  // Flatten for your draft.skills UI (and keep grouped for later)
  const flat = Object.values(groups).flat().slice(0, 40);

  return { flat, groups };
}

function parseResponsibilities(block: string[]) {
  // Pattern:
  // Vice Chairperson (Tech) June 2024 – June 2025
  // DJS ACM ... Mumbai
  // • bullet
  // Web Co-Committee Member June 2023 – June 2024
  // DJS ACM ...
  // • bullet

  const out: Array<{
    title: string;
    org: string;
    start: string;
    end: string;
    highlights: string[];
  }> = [];

  let i = 0;
  const rangeRe = /(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[–-]\s*(Present|(Jan|Feb|Mar|Apr|May|Jun|July|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s+\d{4})/i;

  while (i < block.length) {
    const line = block[i];
    const range = line.match(rangeRe)?.[0];

    if (range) {
      const title = line.replace(rangeRe, "").trim();
      const [start, end] = range.split(/[–-]/).map((x) => x.trim());
      const org = block[i + 1] ?? "";

      i += 2;
      const highlights: string[] = [];
      while (i < block.length && isBullet(block[i])) {
        highlights.push(stripBullet(block[i]));
        i++;
      }

      out.push({ title, org, start, end, highlights });
      continue;
    }

    i++;
  }

  return out;
}

function buildDraft(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const sections = splitSections(lines);

  const header = sections["Header"] ?? [];
  const fullName = header[0] ?? "Your Name";

  const email = findEmail(text);
  const phone = findPhone(text);
  const { linkedin, github, website } = findLinks(text);

  const education = parseEducation(sections["Education"] ?? []);
  const experience = parseExperience(sections["Experience"] ?? []);
  const projects = parseProjects(sections["Projects"] ?? []);
  const { flat: skillsFlat } = parseSkills(sections["Technical Skills"] ?? []);
  const responsibilities = parseResponsibilities(sections["Positions of Responsibility"] ?? []);

  return {
    profile: {
      fullName,
      headline: "",
      location: "",
      email,
      phone,
      website,
      github,
      linkedin,
      summary: "",
    },
    skills: skillsFlat,
    education,
    experience,
    projects,
    responsibilities,
    _rawText: text, // keep for debugging in UI
  };
}

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Send multipart/form-data with field 'file' (PDF)" }, { status: 415 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file uploaded. Field name must be 'file'." }, { status: 400 });
  if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Please upload a PDF." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const raw = await parsePdfToText(buffer);
  const text = cleanText(raw);

  return NextResponse.json({
    ok: true,
    filename: file.name,
    text,
  });
}
