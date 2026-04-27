import "./globals.css";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Monolith.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
