import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget"; // 1. Add this import

export const metadata: Metadata = {
  title: "CampusOS — Your MIT-WPU Campus Guide",
  description:
    "Search buildings, departments, faculty, labs, facilities and important offices at MIT-WPU.",
};

// I assume you have an interface for LayoutProps somewhere, if not, you can use { children }: { children: React.ReactNode }
export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <ChatWidget /> {/* 2. Add the widget here */}
      </body>
    </html>
  );
}