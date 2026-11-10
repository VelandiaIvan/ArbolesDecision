import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecisionLab | Árboles de Decisión para Analítica & Marketing",
  description: "Laboratorio interactivo y visual para dominar árboles de decisión en marketing digital y analítica de datos. Criterios de división (Gini), sobreajuste, poda y simulación en tiempo real.",
  keywords: ["árboles de decisión", "machine learning", "marketing digital", "analítica de datos", "gini", "overfitting", "random forest"],
  authors: [{ name: "Iván Velandia" }, { name: "Universidad Central" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌲</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
