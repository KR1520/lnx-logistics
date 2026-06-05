import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "LNX Logistics",
  description: "Smart Logistics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0b0f1a", color: "white" }}>
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-QwjCnPMEuZN0-QkY3UR5aDnlC5HNjD0"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}