import Script from "next/script";
import type { ReactNode } from "react";
import { Collector } from "@/components/tracking/Collector";
import { TrackingEvents } from "@/components/tracking/TrackingEvents";
import { UTMCapture } from "@/components/tracking/UTMCapture";

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;
const rawGtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
// Só aceita IDs no formato oficial (o valor entra num script inline)
const GTM_ID = GTM_ID_PATTERN.test(rawGtmId) ? rawGtmId : null;

interface TrackingProviderProps {
  children: ReactNode;
}

/**
 * GTM + captura de UTMs + eventos de clique/rolagem/seção + coletor do /dashboard.
 * GA4, Google Ads e Meta Pixel são configurados DENTRO do GTM.
 */
export function TrackingProvider({ children }: TrackingProviderProps) {
  return (
    <>
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      <UTMCapture />
      <TrackingEvents />
      <Collector />
      {children}
    </>
  );
}

export function GtmNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
