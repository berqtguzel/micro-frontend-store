import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Mağaza ürünleri",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
