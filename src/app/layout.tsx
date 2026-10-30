import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://web-cipro.vercel.app"),
    title: "CIPRO | Círculo de Gestión de Proyectos",
    description: "Consultora Junior de élite en gestión de proyectos.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "CIPRO | Círculo de Gestión de Proyectos",
        description: "Consultora Junior de élite en gestión de proyectos.",
        url: "https://web-cipro.vercel.app",
        siteName: "CIPRO",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://github.com/user-attachments/assets/cbf94dfb-f43f-4cba-a301-1d773377b364",
                width: 1124,
                height: 786,
                alt: "CIPRO - Gestión de Proyectos",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CIPRO | Círculo de Gestión de Proyectos",
        description: "Consultora Junior de élite en gestión de proyectos.",
        images: ["https://github.com/user-attachments/assets/cbf94dfb-f43f-4cba-a301-1d773377b364"],
    },
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
