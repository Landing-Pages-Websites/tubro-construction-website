import { CtaLink } from "./CtaLink";

export function ServiceEstimatePrompt({ room, heading, body }: { room: "Kitchen" | "Bathroom"; heading?: string; body?: string }) {
  return <section className="service-estimate-prompt" aria-labelledby="service-estimate-prompt-heading">
    <div><h2 id="service-estimate-prompt-heading">{heading ?? `Ready to Build the ${room} you’ve been Imagining?`}</h2><p>{body ?? "Tell us what you’re considering. We’ll help you understand the possibilities, scope and next steps."}</p></div>
    <CtaLink label="Book Your Free Estimate" href="/schedule-an-estimate" />
  </section>;
}
