import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JobsProvider } from './context/JobsContext';
import { AuthProvider } from "@/app/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FastHire",
  description: "FastHire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <JobsProvider>
            {children}
          </JobsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
