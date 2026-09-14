import type { ReactElement } from "react";
import { PROCESS } from "@/lib/content";

export function ProcessA(): ReactElement {
  return (
    <section id="how-it-works" aria-labelledby="process-a-heading" className="a-process">
      <h2 id="process-a-heading">{PROCESS.heading}</h2>
      <svg className="a-process-route" viewBox="0 0 1536 864" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1498 155H916Q900 155 900 171V315Q900 332 884 332H185Q169 332 169 348V403M531 332Q515 332 515 348V403M845 332Q861 332 861 348V403M1207 422V410Q1207 394 1223 394H1385Q1401 394 1401 410V544Q1401 560 1417 560H1497" />
        {[[1498,155],[169,403],[515,403],[861,403],[1207,422],[1497,560]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" />)}
      </svg>
      <ol data-motion-stagger>{PROCESS.steps.map(step => <li key={step.number}><p className="a-step-number">{step.number}</p><h3>{step.title}</h3><p className="a-step-body">{step.body}</p></li>)}</ol>
    </section>
  );
}
