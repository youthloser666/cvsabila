import { useEffect } from "react";

interface ShortcutHandlers {
  onExportPdf?: () => void;
  onExportImage?: () => void;
  onToggleBranding?: () => void;
}

export function useKeyboardShortcuts({
  onExportPdf,
  onExportImage,
  onToggleBranding,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "p") {
        e.preventDefault();
        onExportPdf?.();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "e") {
        e.preventDefault();
        onExportImage?.();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === "b") {
        e.preventDefault();
        onToggleBranding?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onExportPdf, onExportImage, onToggleBranding]);
}
