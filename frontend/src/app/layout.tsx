import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quotation App',
  description: 'Generate and manage professional quotations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}