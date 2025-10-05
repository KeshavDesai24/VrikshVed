import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ModelLauncherWrapper from "./components/ModelLauncherWrapper";
import { ReduxProvider } from "./store/Provider"; // ✅ added

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VrikshVed",
  description:
    "VrikshVed — your intelligent plant doctor that recognizes greenery, reveals its secrets, and diagnoses plant health with precision",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-green-50 antialiased overflow-x-hidden`}>
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            <ModelLauncherWrapper />
            <main className="min-h-screen" id="app-content">
              {children}
            </main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
