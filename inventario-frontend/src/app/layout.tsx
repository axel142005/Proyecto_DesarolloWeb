import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Chatbot from "./components/chatbot";

export const metadata: Metadata = {
  title: "Heladería — Sistema de Gestión",
  description: "Axel Yamil Severiano Ruiz · 0239970",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col relative">
        {/* Gradientes decorativos */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,100,122,0.08), transparent 70%)"
          }} />
          <div style={{
            position: "absolute", bottom: "-10%", left: "-5%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(78,205,196,0.07), transparent 70%)"
          }} />
        </div>
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
