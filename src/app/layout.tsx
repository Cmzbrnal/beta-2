import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CIPRO | Círculo de Gestión de Proyectos",
    description: "Consultora Junior de élite en gestión de proyectos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="scroll-smooth">
            <body className="font-sans bg-void-black text-white antialiased selection:bg-electric-orange selection:text-white">
                {children}
            </body>
        </html>
    );
}
