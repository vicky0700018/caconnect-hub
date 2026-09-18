import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAConnect — Practice Management for Indian CA Firms",
  description:
    "Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted notice replies for CA firms of one to five people.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CAConnect — Practice Management for Indian CA Firms",
    description:
      "Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted notice replies for CA firms of one to five people.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAConnect — Practice Management for Indian CA Firms",
    description:
      "Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted notice replies for CA firms of one to five people.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1c23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ibmPlexSans.variable} ${sourceSerif4.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-brand-foreground">
        {children}
      </body>
    </html>
  );
}
