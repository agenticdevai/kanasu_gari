import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanasu Gari — Little joys, handmade",
  description: "Discover handmade crochet flowers, little companions, accessories and home decor. Explore Kanasu Gari's creations and start a custom enquiry.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
