import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

function parsePdfToText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData?.parserError || errData);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      const text = (pdfParser as any).getRawTextContent?.() || "";
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

function cleanText(s: string) {
  return (s || "")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

type Responsibility = {
  title: string;
  org: string;
  start: string;
  end: string;
  highlights: string[];
};

type ExtractedAll = {
  profile: {
    fullName: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  responsibilities: Responsibility[];
};

function emptyAll(): ExtractedAll {
  return {
    profile: {
      fullName: "",
      headline: "",
      location: "",
      email: "",
      phone: "",
      website: "",
      github: "",
      linkedin: "",
      summary: "",
    },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    responsibilities: [],
  };
}

function safeJsonParse(s: string): any | null {
  const t = (s || "").trim();
  if (!t) return null;

  // ideal case: pure JSON
  try {
    return JSON.parse(t);
  } catch { }

  // fallback: extract first JSON object
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(t.slice(start, end + 1));
    } catch { }
  }
  return null;
}

function normalizeAllShape(parsed: any): ExtractedAll {
  const fallback = emptyAll();

  return {
    profile: { ...fallback.profile, ...(parsed?.profile ?? {}) },
    skills: Array.isArray(parsed?.skills) ? parsed.skills : [],
    education: Array.isArray(parsed?.education) ? parsed.education : [],
    experience: Array.isArray(parsed?.experience) ? parsed.experience : [],
    projects: Array.isArray(parsed?.projects) ? parsed.projects : [],
    responsibilities: Array.isArray(parsed?.responsibilities)
      ? parsed.responsibilities
      : [],
  };
}

async function geminiExtract(resumeText: string): Promise<ExtractedAll> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const prompt = `
You extract structured resume data.

Return ONLY valid JSON. No markdown, no explanation.
If missing: use "" for strings and [] for arrays. Do NOT guess.

Output MUST match exactly:

{
  "profile": {"fullName":"","headline":"","location":"","email":"","phone":"","website":"","github":"","linkedin":"","summary":""},
  "skills": [],
  "education": [{"school":"","degree":"","start":"","end":"","notes":""}],
  "experience": [{"company":"","role":"","location":"","start":"","end":"","highlights":[]}],
  "projects": [{"name":"","link":"","tech":[],"description":"","highlights":[],"start":"","end":""}],
  "responsibilities": [{"title":"","org":"","start":"","end":"","highlights":[]}]
}

Rules:
- Use exact values from resume text (light whitespace normalization ok).
- skills: flat list, dedupe, max 60.
- highlights: concise bullets (no leading bullet chars).
- dates: keep as seen (e.g., "June 2024", "2022", "Present").
- projects.description: 1-line summary; if not explicitly present, "".
- link fields: only if present in resume text else "".
- If a section doesn't exist, return empty array for it.

Resume text:
"""${resumeText}"""
`.trim();

  const result = await model.generateContent(prompt);
  const out = result.response.text() || "";

  const parsed = safeJsonParse(out);
  if (!parsed) return emptyAll();

  return normalizeAllShape(parsed);
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";

    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded. Field name must be 'file'." },
          { status: 400 }
        );
      }
      if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "Please upload a PDF." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const raw = await parsePdfToText(buffer);
      const text = cleanText(raw);

      // If pdf text extraction fails, still ask Gemini with whatever we have
      const all = await geminiExtract(text);

      return NextResponse.json({ ok: true, filename: file.name, text, all });
    }

    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      const text = cleanText(body?.text || "");
      const all = await geminiExtract(text);
      return NextResponse.json({ ok: true, filename: "", text, all });
    }

    return NextResponse.json(
      { error: "Send multipart/form-data with field 'file' (PDF) OR JSON { text }" },
      { status: 415 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Extraction failed" },
      { status: 500 }
    );
  }
}
