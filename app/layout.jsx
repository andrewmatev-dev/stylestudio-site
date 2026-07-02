import './globals.css';

export const metadata = {
  title: 'StyleStudio',
  description: 'AI-powered styling for your wardrobe',
  manifest: '/manifest.json',
  themeColor: '#FF5757',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StyleStudio'
  }
};

export const viewport = {
  themeColor: '#FF5757',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
