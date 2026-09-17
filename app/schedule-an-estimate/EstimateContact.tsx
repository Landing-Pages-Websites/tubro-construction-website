import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import s from "./estimate.module.css";

export default function EstimateContact(): ReactElement {
  return <section id="talk-to-us" className={s.contact}><div><h2 data-estimate-enter="heading">Rather talk it through?</h2><p data-estimate-enter="body" data-estimate-delay="100">We’re here Monday–Friday, 7:00 a.m.–4:00 p.m.</p></div><div className={s.contactLinks}><a href={BRAND.phoneHref}><Phone size={19} /><span>{BRAND.phoneDisplay}</span><ArrowUpRight size={21} /></a><a href={`mailto:${BRAND.email}`}><Mail size={18} /><span>{BRAND.email}</span><ArrowUpRight size={20} /></a></div></section>;
}
