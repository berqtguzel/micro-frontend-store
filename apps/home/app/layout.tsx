import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ürünler | Mikro Mağaza",
    template: "%s | Mikro Mağaza",
  },
  description: "Fake Store API ürün kataloğu",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
