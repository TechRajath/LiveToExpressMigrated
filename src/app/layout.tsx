import "./globals.css";
import type { Metadata } from "next";
import { Poor_Story } from "next/font/google";
import ReactQueryProvider from "@/providers/react-query-provider";

const poorStory = Poor_Story({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "#LiveToExpress",
  description: "LiveToExpress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poorStory.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
