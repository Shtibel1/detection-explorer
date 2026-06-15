import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detection Types Explorer',
  description: 'System knowledge base — detection types, fields & examples (verified against Main-Next & Main-Global).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Tailwind + Lucide via CDN — runs at runtime, no build-time CSS step.
            See README for switching to a compiled Tailwind setup if preferred. */}
        <script src="https://cdn.tailwindcss.com" />
        <script src="https://unpkg.com/lucide@latest" />
      </head>
      <body className="h-full bg-slate-900 text-white overflow-hidden">{children}</body>
    </html>
  );
}
