"use client";

import Script from "next/script";
import { useRef, useState, type ReactElement } from "react";
import { useRealWorkPortfolio } from "./useRealWorkPortfolio";
import styles from "./realwork.module.css";

export function RealWorkEmbed(): ReactElement {
  const output = useRef<HTMLDivElement>(null);
  const status = useRealWorkPortfolio(output);
  const [scriptFailed, setScriptFailed] = useState(false);
  const unavailable = status === "failed" || scriptFailed;
  return <main className={styles.embed} aria-label="Tubro Construction projects and homeowner reviews" id="main-content" tabIndex={-1}>
    <Script id="tubro-realwork-loader" src="https://app.realworklabs.com/static/plugin/loader.js" strategy="afterInteractive" onError={() => setScriptFailed(true)} />
    {(status === "loading" || unavailable) && <p className={styles.status} role="status">{unavailable ? "The live portfolio is temporarily unavailable. You can still explore our completed projects below." : "Loading the live project portfolio…"}</p>}
    {unavailable && <a className={styles.fallback} href="/recent-projects#project-gallery" target="_top">View Tubro projects</a>}
    <div id="rwl-output" ref={output} />
    <noscript><p>The interactive portfolio needs JavaScript. Browse the project gallery on the main page to see our work.</p></noscript>
  </main>;
}
