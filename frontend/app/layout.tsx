import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ModelLauncherWrapper from './components/ModelLauncherWrapper';

export const dynamic = 'force-dynamic'; // Or proper static generation config

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

//Metadata without viewport
export const metadata: Metadata = {
  title: 'VrikshVed',
  description:
    'VrikshVed — your intelligent plant doctor that recognizes greenery, reveals its secrets, and diagnoses plant health with precision',
};

//Viewport moved to its own export
export const viewport = {
  width: 'device-width',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-green-50 antialiased overflow-x-hidden`}>
        <AuthProvider>
        <Navbar />
        <ModelLauncherWrapper />
        {/* Global Navbar Spacer */}
        {/* This matches navbar height */}
        {/* <div className="h-10"></div>   */}
          {/* Main Content Container */}
          <main className="min-h-screen"> 
            {/* <div className='pt-8 pb-12'></div>Adjust vertical spacing */}
        {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
