import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'A simple slideshow flashcards app',
};

/**
 * Root layout component that wraps all pages
 */
export default function RootLayout({
  children,
}: Readonly<{
  /** Page content to render */
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

