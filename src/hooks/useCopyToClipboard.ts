"use client";

import { useCallback, useEffect, useState } from "react";

const COPIED_MS = 1500;

export function useCopyToClipboard(resetMs = COPIED_MS) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const copy = useCallback(async (text: string) => {
    const written = await navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    );
    setCopied(written);
    return written;
  }, []);

  return { copied, copy };
}
