'use client';

import "reflect-metadata"
import { ReactNode, useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import { container } from 'tsyringe';
import { ProgressProvider } from '@/app/progress-context';
import { SettingsProvider, useSettings } from '@/settings/settings-context';
import { FontService } from '@/typography/font-service';
import { MetadataService } from '@/app/metadata-service';
import { SettingsService } from '@/settings/settings-service';
import { applyStyles, theme } from '@/theme/theme';
import { IndeterminateProgressBar } from '@/components/indeterminate-progress-bar';
// import "./globals.css"; // import this and infinite scroll gone but the "styling" comes

const inter = Inter({ subsets: ["latin"] });

function RootLayoutContent({ children }: { children: ReactNode }) {
  const fontService = container.resolve(FontService);
  const metadataService = container.resolve(MetadataService);
  const settingsService = container.resolve(SettingsService);

  const settingsContext = useSettings();
  const [isBooting, setIsBooting] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const bootUp = async () => {
      try {
        applyStyles(theme);
        await fontService.loadFonts();
        await metadataService.cacheMetadata();
        settingsService.loadSettings(settingsContext);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsBooting(false);
      }
    };

    bootUp();
  }, []);

  if (error) {
    return <div className={inter.className}>Error: {error.message}</div>;
  }

  return isBooting ? <IndeterminateProgressBar /> : children;
}

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