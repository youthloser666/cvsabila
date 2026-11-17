import { toPng, toJpeg } from "html-to-image";

export interface ExportImageOptions {
  format: "png" | "jpeg";
  elementId?: string;
  dpiMultiplier?: number;
}

export async function generateHighResImage({
  format = "png",
  elementId = "a4-document-container",
  dpiMultiplier = 3.125, // 300 DPI / 96 DPI CSS baseline
}: ExportImageOptions): Promise<string> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Target document node #${elementId} not found`);
  }

  // Clone node or measure clean bounds
  const filter = (child: HTMLElement) => {
    return !child.classList?.contains("no-export");
  };

  const options = {
    quality: 0.98,
    pixelRatio: dpiMultiplier,
    filter,
    backgroundColor: "#ffffff",
    style: {
      transform: "none",
      margin: "0",
    },
  };

  if (format === "jpeg") {
    return await toJpeg(node, options);
  } else {
    return await toPng(node, options);
  }
}
