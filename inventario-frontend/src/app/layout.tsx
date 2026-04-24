import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "Inventario — Sistema de Gestión",
  description: "Axel Yamil Severiano Ruiz · 0239970",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative">
        {/* Background gradient decorativo */}
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(163, 230, 53, 0.08), transparent),
              radial-gradient(ellipse 60% 40% at 80% 120%, rgba(59, 130, 246, 0.05), transparent)
            `,
          }}
        />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
