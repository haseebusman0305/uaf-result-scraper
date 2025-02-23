import { Metadata } from "next";
import { keywords } from "./utils/keywords";

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
