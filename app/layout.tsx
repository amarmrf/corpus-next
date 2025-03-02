import "./reflect-polyfill";
import "reflect-metadata"
import { ReactNode } from 'react';
import { Inter } from "next/font/google";
import { ProgressProvider } from '@/app/progress-context';
import { SettingsProvider } from '@/settings/settings-context';
import { RootLayoutContent } from '@/app/root-layout-content';
import "./globals.css"; // Import the global CSS styles

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressProvider>
          <SettingsProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </SettingsProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}