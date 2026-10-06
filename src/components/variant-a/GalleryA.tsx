import { DeferredPortfolio } from "@/components/shared/DeferredPortfolio";
import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";
import { WORK } from "@/lib/content";

export function GalleryA(): ReactElement {
  return (
    <section id="work" aria-labelledby="work-a-heading" className="a-project-proof">
      <div className="a-project-proof-inner">
        <h2 id="work-a-heading">{WORK.heading}</h2>
        <p className="a-project-proof-intro">{WORK.body}</p>
        <DeferredPortfolio className="a-project-frame" title="Tubro Construction projects and homeowner reviews" />
        <a className="a-project-gallery-link" href="/recent-projects#project-gallery">Explore more Tubro projects <ArrowRight aria-hidden="true" /></a>
        <div className="a-project-booking">
          <div><h3>Ready to Talk about your Project?</h3><p>Let’s take a look at your home, talk through your ideas and give you a clear path forward.</p></div>
          <a href="/schedule-an-estimate" className="a-button">Book My Free Estimate <ArrowRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
