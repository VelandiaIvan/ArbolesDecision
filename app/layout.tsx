import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Árboles de decisión | Marketing digital",
  description: "Laboratorio interactivo de árboles de decisión para marketing digital.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
