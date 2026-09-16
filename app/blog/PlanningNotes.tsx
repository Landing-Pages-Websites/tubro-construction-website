import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactElement } from "react";
import styles from "./blog.module.css";

const decisions = [
  { id: "contractor-questions", number: "03", title: "Choose a team you can talk to.", label: "Contractor questions", body: "A useful first conversation goes beyond the finished look. Ask how the work will be coordinated and how decisions will be communicated.", questions: ["Who will be my day-to-day point of contact?", "How are changes to the scope documented?", "What should I expect before work begins?"], href: "/general-contractor", link: "Meet your general contractor" },
  { id: "permit-topics", number: "04", title: "Put the right questions on the plan.", label: "Permit topics", body: "Bring your project address and a description of the changes to your first conversation. Ask which requirements need to be confirmed with your local permitting authority.", questions: ["Which parts of my proposed work need review?", "Who will coordinate any required applications?", "How will inspections fit into the plan?"], href: "/contact", link: "Discuss your project" },
  { id: "cost-questions", number: "05", title: "Get clear on what is included.", label: "Cost questions", body: "A useful estimate starts with a clear scope. Separate the changes you need from the ideas you would like to explore, and bring both to the conversation.", questions: ["What work and materials does the estimate cover?", "Which selections still need to be made?", "How would a change affect the estimate?"], href: "/schedule-an-estimate", link: "Request a free estimate" },
] as const;

export default function PlanningNotes(): ReactElement {
  return (
    <section id="planning-notes" className={styles.notes} aria-labelledby="notes-title">
      <div className={styles.sectionHeading}><h2 id="notes-title">Start with your space.<br /><span>Then work through the details.</span></h2><p>Planning notes to bring to the table, whether you’re gathering ideas or ready to talk.</p></div>
      <div className={styles.roomNotes}>
        <article id="kitchen-planning" className={styles.kitchenNote}><div className={styles.noteMeta}><span>01 / Kitchen planning</span><ArrowUpRight size={22} aria-hidden="true" /></div><h3>Make room for<br />your real life.</h3><p>Before choosing cabinets or countertops, take a closer look at how you use your kitchen. Note what works, what feels crowded, and what you reach for every day.</p><ul className={styles.checklist}><li>Think about cooking, cleanup, and gathering.</li><li>List the storage you use and the storage you’re missing.</li><li>Bring photos of the details you’re drawn to.</li></ul><a className={styles.textLink} href="/kitchen-remodeling">Explore kitchen remodeling <ArrowUpRight size={18} aria-hidden="true" /></a><div className={styles.marginNote}>A place to start: what would make an ordinary morning easier?</div></article>
        <article id="bathroom-choices" className={styles.bathNote}><div className={styles.bathPhoto}><Image src="/images/design/blog/05-estimate-cta-0925012-bathroom-01-jpg.jpg" alt="Tubro bathroom with a glass shower, freestanding tub, and wood double vanity" fill sizes="(max-width: 760px) 100vw, 50vw" /></div><div className={styles.bathCopy}><span className={styles.label}>02 / Bathroom choices</span><h3>Think beyond the tile.</h3><p>Start with who uses the room and what they need. Consider shower or tub preferences, everyday storage, lighting, and how easy the space will be to care for.</p><a className={styles.textLink} href="/bathroom-remodeling">Explore bathroom remodeling <ArrowUpRight size={18} aria-hidden="true" /></a></div></article>
      </div>
      <div className={styles.decisions}>{decisions.map((note) => <article id={note.id} key={note.id} className={styles.decision}><span className={styles.noteNumber}>{note.number}</span><div><span className={styles.label}>{note.label}</span><h3>{note.title}</h3><p>{note.body}</p><a href={note.href} className={styles.textLink}>{note.link}<ArrowUpRight size={18} aria-hidden="true" /></a></div><div className={styles.questionList}><span className={styles.label}>Questions worth asking</span><ul>{note.questions.map((question) => <li key={question}>{question}</li>)}</ul></div></article>)}</div>
    </section>
  );
}
