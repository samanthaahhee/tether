import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hey Otis — Navigate together, grow closer',
  description: 'A relationship wellness app grounded in science. Move from rupture to repair with guided conversations built on Gottman, EFT, and NVC frameworks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
