import "./globals.css";
import { ReactNode } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-R3HFKFXQPQ";

export const metadata = {
  title: "Fix Your Marketing System",
  description:
    "A simple 10-minute check to see what’s actually holding your marketing back.",
  metadataBase: new URL("https://audit.glowsparkdigital.com"),
  openGraph: {
    title: "Fix Your Marketing System",
    description:
      "A simple 10-minute check to see what’s actually holding your marketing back.",
    url: "https://audit.glowsparkdigital.com",
    siteName: "GlowSpark Digital",
    images: [
      {
        url: "/og-image.png",
        secureUrl: "https://audit.glowsparkdigital.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fix Your Marketing System",
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fix Your Marketing System",
    description:
      "A simple 10-minute check to see what’s actually holding your marketing back.",
    images: ["https://audit.glowsparkdigital.com/og-image.png"]
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}