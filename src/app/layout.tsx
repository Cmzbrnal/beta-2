import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

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
            <body className={`${interTight.variable} font-sans bg-void-black text-white antialiased selection:bg-electric-orange selection:text-white`}>
                {children}
            </body>
        </html>
    );
}
