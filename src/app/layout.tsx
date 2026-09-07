import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Form Studio",
  description: "Manage your class",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
