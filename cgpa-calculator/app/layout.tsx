import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { ClientLayout } from './components/ClientLayout';
import { Metadata } from 'next'
import { keywords } from './utils/keywords'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "UAF CGPA Calculator | Calculate Your University GPA Easily",
    template: "%s | UAF CGPA Calculator"
  },
  description: "CGPA Calculator for University of Agriculture Faisalabad (UAF) students. Calculate UAF semester GPA and CGPA instantly. Trusted by UAF students across all departments and programs.",
  keywords: [...keywords],
  authors: [{ name: "Haseeb Usman" }],
  creator: "Haseeb Usman",
  publisher: "Haseeb Usman",
  metadataBase: new URL('https://uafcalculator.live'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uafcalculator.live',
    title: 'UAF CGPA Calculator | Calculate Your University GPA Easily',
    description: 'Free UAF CGPA UAF students. Calculate semester GPA and CGPA accurately with our easy-to-use tool.',
    siteName: 'UAF CGPA Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UAF CGPA Calculator Preview'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ClientLayout>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            {children}
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
