import type { ReactElement } from "react";
import styles from "./about.module.css";

const TEAM = [
  { group: "Leadership", people: [["Rich Tietjen", "Owner"]] },
  { group: "Project delivery", people: [["Chris Sparks", "Project Manager"], ["Scott Griggs", "Project Superintendent"], ["Brandon Provence", "Project Superintendent"], ["Chris Sparks Jr.", "Project Superintendent"]] },
  { group: "Estimating & proposals", people: [["Jon Horner", "Estimator"], ["Tom Hite", "Director of Bids and Proposals"]] },
];

export function AboutTeam(): ReactElement {
  return (
    <section id="team" aria-labelledby="team-heading" className={styles.team}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Meet the team</p><h2 id="team-heading">Real people.<br />Shared responsibility.</h2></div><p>Get to know the names behind the estimates, project planning, and work on your home.</p></div>
        <div className={styles.directory}>{TEAM.map(({ group, people }) => <div key={group} className={styles.teamGroup}><h3>{group}</h3><dl>{people.map(([name, role]) => <div key={name} className={styles.person}><dt>{name}</dt><dd>{role}</dd></div>)}</dl></div>)}</div>
      </div>
    </section>
  );
}
