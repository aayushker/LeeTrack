import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrackerProvider } from "../context/TrackerContext";
import { AuthProvider } from "../context/AuthContext";
import { AppShell } from "../components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LeetTracker — Contest Analytics",
  description:
    "Your personal competitive programming analytics dashboard. Track contests, analyze performance, and identify weak spots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider>
          <TrackerProvider>
            <AppShell>{children}</AppShell>
          </TrackerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
