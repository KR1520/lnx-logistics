import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "LNX Logistics",
  description: "Smart Logistics Tracking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* ✅ GOOGLE MAPS SCRIPT */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-QwjCnPMEuZN0-QkY3UR5aDnlC5HNjD0"
          strategy="beforeInteractive"
        />
      </head>

      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}