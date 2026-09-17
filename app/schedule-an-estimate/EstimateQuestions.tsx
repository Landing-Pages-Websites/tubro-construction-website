import Link from "next/link";
import { Plus } from "lucide-react";
import type { ReactElement } from "react";
import s from "./estimate.module.css";

const questions = [
  ["Is the estimate request free?", "Yes. Requesting an estimate is free. Share your ideas and our office team will follow up to discuss the project."],
  ["Do I need finished plans to get started?", "You can begin with a description of what you would like to change. If you already have plans or a clear scope, mention them in your project details."],
  ["Which areas do you serve?", "Tubro works with homeowners in King and Pierce Counties. Include your project city in the form. Requests outside the area are reviewed by the office team."],
  ["Does this reserve an appointment?", "This form sends an estimate request to our office. It does not reserve an appointment. The team will contact you during business hours to discuss the next step."],
];

export default function EstimateQuestions(): ReactElement {
  return <section id="questions" className={s.questions}><div><h2 data-estimate-enter="heading">A few things<br />you might be wondering.</h2><p data-estimate-enter="body" data-estimate-delay="100">Have something else in mind?<br /><Link href="/contact">Talk with our team.</Link></p></div><div className={s.questionList}>{questions.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>;
}
