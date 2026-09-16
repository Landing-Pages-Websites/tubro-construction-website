import { ArrowUpRight, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import styles from "./blog.module.css";

const services = [["Painting", "/interior-exterior-painting"], ["Decks & outdoor living", "/general-contractor"], ["Custom homes", "/custom-home-services"]] as const;

export default function BlogClosing(): ReactElement {
  return (
    <>
      <section id="before-your-conversation" className={styles.prepare} aria-labelledby="prepare-title"><div className={styles.prepareInner}><div><span className={styles.label}>Before you speak with a contractor</span><h2 id="prepare-title">Bring your ideas.<br />And your questions.</h2><p>You don’t need every answer to start a useful conversation. A few notes can help explain what matters most.</p></div><ol className={styles.prepList}><li><span>01</span><div><h3>Describe the change.</h3><p>Which room are you thinking about, and what would you like it to do better?</p></div></li><li><span>02</span><div><h3>Share your priorities.</h3><p>Bring your must-haves, inspiration, and any budget or timing goals you want to discuss.</p></div></li><li><span>03</span><div><h3>Talk through the next step.</h3><p>Ask what information is needed to understand the scope and prepare an estimate.</p></div></li></ol></div></section>
      <section id="more-possibilities" className={styles.more} aria-labelledby="more-title"><h2 id="more-title">Thinking beyond kitchens and baths?</h2><nav aria-label="More remodeling services">{services.map(([label, href]) => <a key={href + label} href={href}>{label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}</nav></section>
      <section id="project-question" className={styles.closing} aria-labelledby="closing-title"><div className={styles.closingRule} aria-hidden="true" /><div><span className={styles.label}>From inspiration to a conversation</span><h2 id="closing-title">Have a project<br />question<span>?</span></h2><p>Request a free estimate and give the team enough detail to start a useful conversation.</p></div><div className={styles.closingActions}><a href="/schedule-an-estimate" className={styles.button}>Schedule a Free Estimate <ArrowUpRight size={22} aria-hidden="true" /></a><a href={BRAND.phoneHref} className={styles.phone}><Phone size={18} aria-hidden="true" />{BRAND.phoneDisplay}</a><p>{BRAND.hours}<br />Serving King &amp; Pierce Counties</p></div></section>
    </>
  );
}
