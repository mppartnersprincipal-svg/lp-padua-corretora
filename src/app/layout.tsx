import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { buildOrganizationSchema, JsonLd } from "@/components/seo/JsonLd";
import { GtmNoScript, TrackingProvider } from "@/components/tracking/TrackingProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

// Fonte oficial do manual de marca, servida pelo próprio site (next/font faz o self-hosting)
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_TITLE = "Pádua Corretora de Seguros | Seguro Auto e Empresarial";
const DEFAULT_DESCRIPTION =
  "Corretora de seguros com atendimento de verdade: comparamos seguradoras para seu carro ou sua empresa e acompanhamos você na renovação e no sinistro. Cotação pelo WhatsApp em até 1h.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c1830",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={archivo.variable}>
      <body className="min-h-dvh font-sans">
        <GtmNoScript />
        {/* Sem JavaScript, o conteúdo das animações de entrada aparece direto */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-deep"
        >
          Pular para o conteúdo
        </a>
        <JsonLd data={buildOrganizationSchema()} />
        <TrackingProvider>
          <SmoothScroll />
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <MobileCtaBar />
        </TrackingProvider>
      </body>
    </html>
  );
}
