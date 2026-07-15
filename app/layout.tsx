import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Script from 'next/script';


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jess Bodie Richards",
  description: "Portfolio and projects by Jess Bodie Richards",
};

export const viewport: Viewport = {
  themeColor: "#414770",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="beforeInteractive"/>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
