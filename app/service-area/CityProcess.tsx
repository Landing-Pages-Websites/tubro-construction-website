import type { ReactElement } from "react";
import styles from "./city.module.css";

const STEPS = [
  {
    title: "Tell us what you have in mind",
    body: "Share your project city, the space you want to change, and what you would like it to do better.",
  },
  {
    title: "Get clear on scope and pricing",
    body: "We review the details with you and provide a free estimate with upfront pricing.",
  },
  {
    title: "Move forward with a plan",
    body: "An assigned project manager coordinates the approved work and keeps communication personal.",
  },
];

export function CityProcess(): ReactElement {
  return (
    <section
      id="how-it-works"
      className={`${styles.section} ${styles.process}`}
      aria-labelledby="process-heading"
    >
      <div className={styles.sectionHeading}>
        <h2 id="process-heading">
          A clear path from
          <br />
          “what if” to <em>what’s next.</em>
        </h2>
        <p>
          A good result starts with a shared understanding of your home, your
          priorities, and the work ahead.
        </p>
      </div>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className={styles.stepNumber}>0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
