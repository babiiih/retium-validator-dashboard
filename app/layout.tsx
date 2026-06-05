import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Retium Validator Mesh Dashboard",
  description: "Monitor Keepers, Workers, and Suits on the Retium network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
