import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Pádua Corretora — Seguro Auto e Empresarial com atendimento de verdade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-full-white.svg"));
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0c1830 0%, #16284a 70%, #213a66 100%)",
          color: "#f5f2ec",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={340} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ width: 72, height: 3, background: "#b9975b" }} />
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.08, maxWidth: 900 }}>
            Seguro com quem cuida de você depois da assinatura.
          </div>
          <div style={{ fontSize: 28, color: "#aeb7c6" }}>
            Seguro Auto e Empresarial · Cotação pelo WhatsApp · Todo o Brasil
          </div>
        </div>
      </div>
    ),
    size,
  );
}
