import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import ThemeProvider from '@/components/wrappers/theme-provider';
import AnalyticsProvider from '@/context/analytics-context';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spokesperson AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
