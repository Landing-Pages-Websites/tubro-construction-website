import Image from "next/image";
import type { ReactElement } from "react";
import styles from "./about.module.css";

const TEAM = [
  { name: "Rich Tietjen", role: "Owner", image: "Rich-T_profile", description: "A Washington native and Army veteran, Rich founded Tubro around honest pricing, customer service, and quality home remodeling." },
  { name: "Chris Sparks", role: "Project Manager", image: "Chris-S_profile", description: "Chris helps guide project delivery, giving homeowners a point of contact for scheduling, questions, and changes." },
  { name: "Scott Griggs", role: "Project Superintendent", image: "Scott-G_profile", description: "Scott is part of the project delivery team, supporting the planning and coordination behind each assigned remodel." },
  { name: "Brandon Provence", role: "Project Superintendent", image: "Brandon-P_profile", description: "Brandon supports project delivery and communication as part of Tubro’s superintendent team." },
  { name: "Chris Sparks Jr.", role: "Project Superintendent", image: "Chris-Jr_profile", description: "Chris Jr. works with Tubro’s project delivery team to help coordinate remodeling work and keep homeowners informed." },
  { name: "Jon Horner", role: "Estimator", image: "Jon-H_profile", description: "With Tubro since the beginning, Jon prepares estimates and helps homeowners work through proposal questions." },
  { name: "Tom Hite", role: "Director of Bids and Proposals", image: "Tom-H_profile", description: "Tom guides design decisions and material selections, helping prepare the details before a project begins." },
  { name: "Rebecca Molnar", role: "Office Manager & Logistics", image: "Rebecca-M_profile", description: "Rebecca helps with estimate appointments, invoices, material orders, and subcontractor scheduling." },
];

export function AboutTeam(): ReactElement {
  return (
    <section id="team" aria-labelledby="team-heading" className={styles.team}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Meet the team</p><h2 id="team-heading">Real people.<br />Shared responsibility.</h2></div><p>Get to know the names behind the estimates, project planning, and work on your home.</p></div>
        <div className={styles.teamProfiles}>{TEAM.map((person) => <article key={person.name} className={styles.teamProfile}>
          <div className={styles.portrait}><Image src={`/images/team/${person.image}.jpg`} alt={person.name} fill sizes="(min-width: 1100px) 22vw, (min-width: 600px) 44vw, 90vw" /></div>
          <p className={styles.teamRole}>{person.role}</p><h3>{person.name}</h3><p>{person.description}</p>
        </article>)}</div>
      </div>
    </section>
  );
}
