import { ArrowDownRight } from "lucide-react";
import type { ReactElement } from "react";
import s from "./estimate.module.css";

const steps = [
  ["Share your ideas", "Tell us what you want to change, where the project is, and how we can reach you."],
  ["We review the details", "Our office team reviews your request and follows up to learn more about the work."],
  ["Find the next step", "Together, we clarify the scope and talk through the next practical step for your project."],
];

export default function EstimateNextSteps(): ReactElement {
  return <section id="what-happens-next" className={s.nextSteps}>
    <div className={s.sectionIntro}><h2 data-estimate-enter="heading">A clear start.<br /><span>A thoughtful next step.</span></h2><div><p data-estimate-enter="body" data-estimate-delay="100">You don’t need every detail figured out. Start with your ideas, and we’ll help make the next conversation useful.</p><ArrowDownRight size={38} strokeWidth={1.2} aria-hidden="true" /></div></div>
    <ol className={s.steps}>{steps.map(([title, body], index) => <li key={title} data-estimate-step={index}><span className={s.stepNumber}>0{index + 1}</span><h3 data-estimate-enter="heading" data-estimate-delay={index * 70}>{title}</h3><p data-estimate-enter="body" data-estimate-delay={80 + index * 70}>{body}</p></li>)}</ol>
  </section>;
}
