import { Toaster } from "sonner";
import { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Builder",
    template: "%s · Portfolio Builder",
  },
  description:
    "Build a beautiful portfolio website from your resume. Publish to GitHub and deploy to Vercel in minutes.",
  applicationName: "Portfolio Builder",
  keywords: [
    "portfolio",
    "resume to portfolio",
    "developer portfolio",
    "nextjs portfolio",
    "github portfolio",
    "vercel deploy",
  ],
  authors: [{ name: "Yash Loriya" }],
  creator: "Portfolio Builder",
  metadataBase: new URL("http://localhost:3000"),

  openGraph: {
    type: "website",
    siteName: "Portfolio Builder",
    title: "Portfolio Builder",
    description:
      "Turn your resume into a portfolio website with full GitHub ownership.",
  },

  twitter: {
    title: "Portfolio Builder",
    description:
      "Create, publish, and deploy your portfolio website in minutes.",
  },

  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            className: "bg-black/90 border border-white/10 text-white",
          }}
        />
      </body>
    </html>
  );
}
