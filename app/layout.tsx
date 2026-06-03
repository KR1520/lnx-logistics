import Script from "next/script";

export const metadata = {
  title: "LNX Logistics",
  description: "Smart Logistics Platform",
};

export default function RootLayout({ children }) {
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