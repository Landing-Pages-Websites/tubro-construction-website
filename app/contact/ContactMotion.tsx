"use client";

import { useEffect } from "react";
import styles from "./contact.module.css";

/** Observe only unseen content; never hide an already painted viewport. */
export function ContactMotion(): null {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`.${styles.page}`);
    if (!root || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = root.querySelectorAll<HTMLElement>(
      `.${styles.detail}, .${styles.next} > div:first-child, .${styles.nextLinks} > a, .${styles.bottomline}`,
    );
    const seen = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    const sync = (): void => {
      observer?.disconnect();
      targets.forEach((target) => target.removeAttribute("data-contact-pending"));
      if (preference.matches) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.removeAttribute("data-contact-pending");
          target.setAttribute("data-contact-entered", "true");
          seen.add(target);
          observer?.unobserve(target);
        });
      }, { threshold: 0.12 });
      targets.forEach((target) => {
        if (seen.has(target)) return;
        if (target.getBoundingClientRect().top < window.innerHeight) {
          seen.add(target);
          return;
        }
        target.setAttribute("data-contact-pending", "true");
        observer?.observe(target);
      });
    };
    const revealFocused = (event: FocusEvent): void => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-contact-pending]");
      if (!target) return;
      target.removeAttribute("data-contact-pending");
      seen.add(target);
      observer?.unobserve(target);
    };
    sync();
    root.addEventListener("focusin", revealFocused);
    preference.addEventListener("change", sync);
    return () => {
      observer?.disconnect();
      targets.forEach((target) => target.removeAttribute("data-contact-pending"));
      root.removeEventListener("focusin", revealFocused);
      preference.removeEventListener("change", sync);
    };
  }, []);
  return null;
}
