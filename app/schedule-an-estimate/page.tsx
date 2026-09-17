import type { Metadata } from "next";
import type { ReactElement } from "react";
import { designedPageMetadata } from "@/components/site/DesignedPage";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import EstimateHero from "./EstimateHero";
import EstimateNextSteps from "./EstimateNextSteps";
import EstimateWork from "./EstimateWork";
import EstimateQuestions from "./EstimateQuestions";
import EstimateContact from "./EstimateContact";
import EstimateMotion from "./EstimateMotion";
import s from "./estimate.module.css";

const SLUG = "schedule-an-estimate";

export const metadata: Metadata = {
  ...designedPageMetadata(SLUG),
  description: "Tell Tubro Construction about your kitchen, bathroom, addition, custom home, or painting project. Request a free remodeling estimate in King and Pierce Counties.",
};

export default function Page(): ReactElement {
  return <div className={s.page}><SiteHeader /><EstimateMotion><EstimateHero /><EstimateNextSteps /><EstimateWork /><EstimateQuestions /><EstimateContact /></EstimateMotion><SiteFooter /></div>;
}
