"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function useQrCode(value: string) {
  const [qrCode, setQrCode] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function renderQrCode() {
      if (!value) {
        setQrCode("");
        return;
      }

      const dataUrl = await QRCode.toDataURL(value, {
        margin: 1,
        width: 520,
        color: {
          dark: "#071A33",
          light: "#FFFFFF"
        }
      });

      if (!cancelled) setQrCode(dataUrl);
    }

    renderQrCode().catch(() => {
      if (!cancelled) setQrCode("");
    });

    return () => {
      cancelled = true;
    };
  }, [value]);

  return qrCode;
}
