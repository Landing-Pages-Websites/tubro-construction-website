import { CtaLink } from "./CtaLink";

export function ServiceEstimatePrompt({ room }: { room: "Kitchen" | "Bathroom" }) {
  const isBathroom = room === "Bathroom";
  return <section className="service-estimate-prompt" aria-labelledby="service-estimate-prompt-heading">
    <div>
      <h2 id="service-estimate-prompt-heading">
        {isBathroom ? "Ready to Build the Bathroom You Have Been Imagining?" : `Ready to Build the ${room} you’ve been Imagining?`}
      </h2>
      <p>{isBathroom ? "Tell us what you are considering. We will help you understand the possibilities, scope, and next steps." : "Tell us what you’re considering. We’ll help you understand the possibilities, scope and next steps."}</p>
    </div>
    <CtaLink label="Book Your Free Estimate" href="/schedule-an-estimate" />
  </section>;
}
