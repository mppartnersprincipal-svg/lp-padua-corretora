"use client";

import { useEffect } from "react";
import { captureFbclid } from "@/lib/meta-lead";
import { captureUtms } from "@/lib/tracking";

/** Guarda as UTMs da URL de entrada (seguem em todos os eventos e na mensagem do WhatsApp) e o fbclid (API de Conversões). */
export function UTMCapture(): null {
  useEffect(() => {
    captureUtms();
    captureFbclid();
  }, []);
  return null;
}
