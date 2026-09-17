import { ArrowUpRight, Plus } from "lucide-react";
import type { ReactElement } from "react";
import { BRAND } from "@/lib/content";
import type { CityProfile } from "./city-content";
import styles from "./city.module.css";

export function CityQuestions({
  city,
  profile,
}: {
  city: string;
  profile: CityProfile;
}): ReactElement {
  const questions = [
    {
      question: `Does Tubro serve ${city}?`,
      answer: `Yes. ${city} is part of Tubro’s service area. Share your property location and project details so we can confirm the fit for the work you have in mind.`,
    },
    {
      question: "What should I include in my estimate request?",
      answer:
        "Tell us your project city, the room or exterior area, its current condition, and what you would like to change. Include your name and an email address or phone number so we can follow up.",
    },
    {
      question: "Do I need a finished design before contacting you?",
      answer:
        "No. You can start with an idea and a few priorities. Let us know what you have already decided and what you would like to discuss.",
    },
    {
      question: "Is the estimate free?",
      answer:
        "Yes. Tubro offers free estimates and upfront pricing with no hidden fees. The team reviews your request before discussing the scope and next steps.",
    },
    {
      question: "What happens after I send the form?",
      answer: `Your request goes to the Tubro team, who follow up during office hours: ${BRAND.hours} Sending the form starts a conversation; it does not book an appointment automatically.`,
    },
  ];
  return (
    <section
      id="faq"
      className={`${styles.section} ${styles.questions}`}
      aria-labelledby="faq-heading"
    >
      <div className={styles.planning}>
        <h2>{profile.planningTitle}</h2>
        <p>{profile.planningBody}</p>
        <a href="#form" className={styles.textLink}>
          Let’s talk about your home
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <div className={styles.faqList}>
        <h2 id="faq-heading">Before you begin.</h2>
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>
              {question}
              <Plus aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
