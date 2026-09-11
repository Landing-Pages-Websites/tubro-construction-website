export const BRAND = {
  name: "Tubro Construction",
  region: "King and Pierce Counties, Washington",
  phoneDisplay: "253-216-2633",
  phoneHref: "tel:+12532162633",
  email: "workorders@tubroconstruction.com",
  emailUser: "workorders",
  emailDomain: "tubroconstruction.com",
  hours: "Monday–Friday, 7:00 a.m.–4:00 p.m.",
  serviceArea: "King and Pierce Counties",
  discount:
    "Active-duty military members and first responders receive 5% off.",
  careersNote: "Looking to build a career? Resumes are welcome by email at",
} as const;

export const HERO = {
  eyebrow: "Residential remodeling across King & Pierce Counties",
  heading: "Built Around the Way You Want to Live",
  body: "Tubro Construction brings kitchens, bathrooms, additions, and whole-home renovations to life with clear pricing, careful craftsmanship, and an assigned project manager.",
  primaryCta: "Schedule a Free Estimate",
  secondaryCta: "Call 253-216-2633",
} as const;

export const PROOF = {
  heading: "A straightforward foundation for a major investment.",
  points: [
    "Veteran-owned",
    "Founded in 2010",
    "Free estimates",
    "Upfront pricing with no hidden fees",
    "Assigned project management",
  ],
  captionLead: "Serving homeowners across",
  captionAccent: "verified communities",
  captionTail: "in King and Pierce Counties.",
} as const;

export const ROOMS = {
  heading: "Start with the spaces that shape every day.",
  intro:
    "From better circulation and storage to durable finishes and natural light, Tubro plans around how you use the room, not a one-size-fits-all package.",
  kitchen: {
    title: "Kitchen Remodeling",
    body: "Practical layouts, cabinetry, islands, countertops, tile, appliances, and lighting brought into one coordinated plan.",
  },
  bathroom: {
    title: "Bathroom Remodeling",
    body: "Walk-in showers, tub conversions, thoughtful storage, and complete renovations with the details managed.",
  },
  cta: "Explore Remodeling Services",
} as const;

export const CAPABILITIES = {
  heading: "One experienced team for the whole project.",
  body: "Beyond kitchens and baths, Tubro supports additions, whole-home renovations, custom and new homes, interior and exterior painting, decks, and outdoor living.",
  items: [
    "Additions & whole-home renovations",
    "Custom homes & new construction",
    "Interior & exterior painting",
    "Decks & outdoor living",
  ],
} as const;

export const PROCESS = {
  heading: "Know what comes next.",
  steps: [
    {
      number: "01",
      title: "Share the project",
      body: "Tell us what you want to change and where the project is located.",
    },
    {
      number: "02",
      title: "Estimate & plan",
      body: "We clarify scope and provide upfront pricing without hidden fees.",
    },
    {
      number: "03",
      title: "Build with one point of contact",
      body: "An assigned project manager keeps communication personal and the work coordinated.",
    },
    {
      number: "04",
      title: "Complete the space",
      body: "Craftsmanship and finishing details bring the approved plan together.",
    },
  ],
} as const;

export const WORK = {
  heading: "See what we’ve built across western Washington.",
  body: "Explore authentic completed-project photography and the existing RealWork Labs project and review experience where technically feasible.",
  cta: "View Recent Projects",
  photoLabel: "Authentic project photography",
} as const;

export const ESTIMATE = {
  heading: "Tell us what you’re planning.",
  body: "Request a free estimate and give the team enough detail to start a useful conversation.",
  submitCta: "Schedule a Free Estimate",
  submittingCta: "Sending…",
} as const;

export const PROJECT_TYPES = [
  "Kitchen or bathroom remodel",
  "Home addition or renovation",
  "New construction or custom home",
  "Painting",
  "Other",
] as const;
