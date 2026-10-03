"use client";

import { useEffect, useImperativeHandle, useRef, type ReactElement, type Ref } from "react";
import { createRecaptchaWidget, type RecaptchaHandle } from "@/lib/recaptcha-client";

type Props = { ref: Ref<RecaptchaHandle>; onReady?: (ready: boolean) => void };

/** Policy-based Enterprise widget; prepare on form interaction, mint only on submit. */
export function RecaptchaWidget({ ref, onReady }: Props): ReactElement {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<ReturnType<typeof createRecaptchaWidget> | null>(null);
  const ready = useRef(onReady);
  useEffect(() => { ready.current = onReady; }, [onReady]);
  useImperativeHandle(ref, () => ({ getToken: () => widget.current?.getToken() ?? Promise.resolve(null), reset: () => widget.current?.reset() }), []);
  useEffect(() => {
    if (!container.current) return;
    const instance = createRecaptchaWidget(container.current, (value) => ready.current?.(value));
    widget.current = instance;
    const form = container.current.closest("form");
    const prepare = (): void => { void instance.prepare(); };
    form?.addEventListener("focusin", prepare);
    return () => { form?.removeEventListener("focusin", prepare); instance.dispose(); widget.current = null; };
  }, []);
  return <div ref={container} data-recaptcha-container="" style={{ margin: 0 }} />;
}
