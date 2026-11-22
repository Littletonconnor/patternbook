"use client";

import { useEffect, useEffectEvent } from "react";

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
) {
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => onEvent(event);
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type]);
}
