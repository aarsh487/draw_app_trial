import type { Metadata } from "next";
import "./globals.css";
import { funnel } from "./fonts";




// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={funnel.className}>
      <body>{children}</body>
    </html>
  );
}
