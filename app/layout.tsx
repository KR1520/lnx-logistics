import Script from "next/script";
import React from "react";

/* ✅ Metadata */
export const metadata = {
  title: "LNX Logistics",
  description: "Smart Logistics Platform",
};

/* ✅ Proper typing */
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-QwjCnPMEuZN0-QkY3UR5aDnlC5HNjD0"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}