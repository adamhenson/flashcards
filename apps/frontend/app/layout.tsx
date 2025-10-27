import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flashcards',
  description: 'A simple slideshow flashcards app',
  icons: {
    icon: '/favicon.ico',
  },
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
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'
          rel='stylesheet'
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
