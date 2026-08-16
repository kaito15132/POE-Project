import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "EyeScope · Watcher's Eye Analyzer", description: "Local-first observed listing intelligence" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
