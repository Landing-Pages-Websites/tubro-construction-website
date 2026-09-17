import { Bath, HousePlus, House, Paintbrush, MessageSquare, Check } from "lucide-react";
import type { ReactElement } from "react";
import s from "./estimate.module.css";

const choices = [
  { value: "Kitchen or bathroom remodel", label: "Kitchen or bathroom", Icon: Bath },
  { value: "Home addition or renovation", label: "Addition or renovation", Icon: HousePlus },
  { value: "New construction or custom home", label: "Custom or new home", Icon: House },
  { value: "Painting", label: "Painting", Icon: Paintbrush },
  { value: "Other", label: "Something else", Icon: MessageSquare },
];

export default function EstimateProjectChoices(): ReactElement {
  return <fieldset className={s.formSection}>
    <legend><span>01</span>What are you planning?</legend>
    <div className={s.choices}>{choices.map(({ value, label, Icon }, index) => <label key={value} className={s.choice}>
      <input type="radio" name="projectType" value={value} defaultChecked={index === 0} />
      <Icon size={20} aria-hidden="true" /><span>{label}</span><Check className={s.choiceCheck} size={16} aria-hidden="true" />
    </label>)}</div>
  </fieldset>;
}
