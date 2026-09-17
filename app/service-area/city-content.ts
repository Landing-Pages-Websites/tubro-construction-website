import { IMAGES } from "@/lib/images";

// Shared portfolio photographs: these selections do not assert a project location.
export const CITY_PHOTOS = {
  island: {
    ...IMAGES.hero,
    title: "Room to gather",
    category: "Kitchen remodeling",
    position: "50% 55%",
  },
  bright: {
    ...IMAGES.roomsKitchen,
    title: "A brighter everyday kitchen",
    category: "Kitchen remodeling",
    position: "50% 50%",
  },
  shaker: {
    ...IMAGES.workKitchen,
    title: "Thoughtful kitchen details",
    category: "Kitchen remodeling",
    position: "50% 50%",
  },
  bath: {
    ...IMAGES.roomsBathroom,
    title: "Space to slow down",
    category: "Bathroom remodeling",
    position: "56% 50%",
  },
  dark: {
    ...IMAGES.workBathroomDark,
    title: "A different kind of retreat",
    category: "Bathroom remodeling",
    position: "52% 52%",
  },
  deck: {
    ...IMAGES.capDeck,
    title: "Make more of the outdoors",
    category: "Decks & outdoor living",
    position: "50% 54%",
  },
} as const;

export type CityPhoto = (typeof CITY_PHOTOS)[keyof typeof CITY_PHOTOS];
type PhotoKey = keyof typeof CITY_PHOTOS;

export interface CityProfile {
  intro: string;
  planningTitle: string;
  planningBody: string;
  photos: readonly [PhotoKey, PhotoKey, PhotoKey, PhotoKey];
}

export const CITY_PROFILES: Record<string, CityProfile> = {
  "maple-valley": {
    intro:
      "From a kitchen that brings everyone together to an addition that gives you room to grow, Tubro helps Maple Valley homeowners plan their next chapter at home.",
    planningTitle: "One room, or a bigger possibility?",
    planningBody:
      "Tell us whether you are updating a kitchen or bath, considering an addition, or planning a custom home. We can also discuss renovation and painting as part of your Maple Valley project.",
    photos: ["island", "bath", "bright", "deck"],
  },
  tacoma: {
    intro:
      "A better layout. A more useful room. A home that feels like you. Bring your Tacoma remodeling plans to Tubro for clear pricing and a coordinated approach to the work.",
    planningTitle: "Bring the whole project into focus.",
    planningBody:
      "For a Tacoma remodel, start with the rooms you want to change and how they connect. Residential remodeling and general contracting can bring the different parts of your project into one conversation.",
    photos: ["bright", "dark", "island", "deck"],
  },
  covington: {
    intro:
      "Make the home you have work better for the life you lead. Tubro helps Covington homeowners explore residential remodeling and additions, starting with a free estimate.",
    planningTitle: "More space starts with a clear brief.",
    planningBody:
      "If an addition is part of your Covington project, tell us what the extra space needs to do. If you are remodeling within the existing footprint, share what feels cramped or difficult to use.",
    photos: ["island", "bath", "shaker", "deck"],
  },
  renton: {
    intro:
      "Give the busiest rooms in your home a fresh start. Tubro works with Renton homeowners on kitchen and bathroom remodeling and related residential projects.",
    planningTitle: "Start with your everyday routine.",
    planningBody:
      "For your Renton kitchen or bathroom, note what you would like to improve: storage, circulation, surfaces, or the overall layout. Those priorities give the estimate conversation a useful starting point.",
    photos: ["shaker", "dark", "bright", "bath"],
  },
  kent: {
    intro:
      "You know what could work better at home. Tubro helps Kent homeowners turn those ideas into a residential remodeling plan, with upfront pricing and personal project management.",
    planningTitle: "Decide what matters most.",
    planningBody:
      "Share the main goal for your Kent remodel and any features you want to keep. A short list of must-haves helps the team understand your priorities before discussing the scope.",
    photos: ["bath", "shaker", "island", "deck"],
  },
  auburn: {
    intro:
      "From the first conversation to the finishing details, your home deserves a thoughtful plan. Explore residential remodeling with Tubro in Auburn and tell us what you have in mind.",
    planningTitle: "Let’s start with your property.",
    planningBody:
      "Auburn spans King and Pierce Counties. Include your project city and the room or exterior area you want to change so the team can review the location and scope together.",
    photos: ["island", "dark", "shaker", "deck"],
  },
  ravensdale: {
    intro:
      "A local conversation about a home that works better for you. With a business address in Ravensdale, Tubro welcomes your residential remodeling ideas and estimate questions.",
    planningTitle: "Tell us what home could feel like.",
    planningBody:
      "Share the changes you are considering for your Ravensdale home, from a single room to a broader renovation. Use the form or call the office to begin discussing your project.",
    photos: ["shaker", "bath", "bright", "deck"],
  },
  enumclaw: {
    intro:
      "A kitchen for gathering, a bathroom for unwinding, or a home planned from the start. Talk with Tubro about kitchen, bathroom, and custom-home services in Enumclaw.",
    planningTitle: "A remodel or a new beginning?",
    planningBody:
      "Let us know whether your Enumclaw project involves an existing home or a custom-home idea. Share the rooms, features, and priorities you already have in mind.",
    photos: ["bright", "bath", "shaker", "deck"],
  },
  issaquah: {
    intro:
      "Refresh the spaces you live in every day. Tubro helps Issaquah homeowners discuss residential remodeling and painting, with a clear scope and a free estimate to get started.",
    planningTitle: "Consider the layout and the finish.",
    planningBody:
      "For your Issaquah project, tell us whether you want to change how a room works, refresh its surfaces, or do both. Include any interior or exterior painting you would like to discuss.",
    photos: ["shaker", "dark", "island", "deck"],
  },
  bellevue: {
    intro:
      "Thoughtful details can change the way a home feels. Bring your Bellevue remodeling ideas to Tubro and start with a conversation about the spaces you use most.",
    planningTitle: "Make room for your priorities.",
    planningBody:
      "For your Bellevue home, describe what you want the finished space to make easier. Layout, storage, lighting, and material preferences are all helpful starting points for reviewing the scope.",
    photos: ["dark", "shaker", "bath", "bright"],
  },
  newcastle: {
    intro:
      "Your next home improvement starts with what matters to you. Tubro welcomes residential remodeling inquiries from Newcastle homeowners, from early ideas to a more defined brief.",
    planningTitle: "Connect the ideas, then define the work.",
    planningBody:
      "If you are considering changes to more than one room in Newcastle, tell us how they relate. We will review your proposed scope with you before the project moves forward.",
    photos: ["bath", "island", "bright", "deck"],
  },
  "black-diamond": {
    intro:
      "Make your home fit the way you want to live. Tubro helps Black Diamond homeowners begin a residential remodeling project with a useful conversation and a free estimate.",
    planningTitle: "Start with the space you already have.",
    planningBody:
      "Describe the current condition of your Black Diamond home and what you hope to change. Let the team know which parts of the space should stay and which need a fresh approach.",
    photos: ["island", "bath", "dark", "deck"],
  },
  fairwood: {
    intro:
      "Better flow, useful storage, and finishing details that feel right. Share your Fairwood remodeling plans with Tubro and take the next step toward a home that works for you.",
    planningTitle: "What would make the biggest difference?",
    planningBody:
      "For a Fairwood remodeling request, a few specific frustrations can be as helpful as a finished wish list. Tell us where your home gets in the way of daily life and what you would like to improve.",
    photos: ["bright", "dark", "shaker", "bath"],
  },
  sumner: {
    intro:
      "Keep what you love about home. Rethink what could work better. Tubro welcomes Sumner homeowners looking for a thoughtful approach to residential remodeling.",
    planningTitle: "Build a brief around what you love.",
    planningBody:
      "Tell us which features of your Sumner home you want to preserve alongside the changes you are considering. That balance helps guide a more useful discussion of the work.",
    photos: ["shaker", "bath", "island", "deck"],
  },
  "bonney-lake": {
    intro:
      "More comfort in the rooms you use. More possibility in the home you have. Start a conversation with Tubro about residential remodeling in Bonney Lake.",
    planningTitle: "Look at the project from the inside out.",
    planningBody:
      "Include the interior rooms or outdoor areas you are thinking about for your Bonney Lake home. The team will review the project type and scope before discussing the next step.",
    photos: ["deck", "shaker", "bright", "bath"],
  },
  buckley: {
    intro:
      "A good remodel begins with listening. Tell Tubro what you want to change about your Buckley home and start shaping the project with a free estimate.",
    planningTitle: "A few details are enough to begin.",
    planningBody:
      "You do not need a finished design to ask about your Buckley remodel. Start with the room, its current condition, and your main goal, then share the best way to reach you.",
    photos: ["island", "dark", "bath", "deck"],
  },
  snoqualmie: {
    intro:
      "Create spaces that feel more considered, more comfortable, and more your own. Tubro helps Snoqualmie homeowners take the first step toward a residential remodel.",
    planningTitle: "Bring your ideas and your questions.",
    planningBody:
      "For your Snoqualmie home, note the spaces you want to improve and any decisions you have already made. It is fine to include questions about the scope as well as definite plans.",
    photos: ["bath", "shaker", "dark", "deck"],
  },
  "north-bend": {
    intro:
      "Make everyday life at home a little better. Share your North Bend residential remodeling plans with Tubro and explore the possibilities with a free estimate.",
    planningTitle: "Give each part of the project a purpose.",
    planningBody:
      "If your North Bend wish list includes several improvements, tell us which is the priority. Share how you use the space now and what you hope will be different afterward.",
    photos: ["deck", "bath", "shaker", "bright"],
  },
  sammamish: {
    intro:
      "A home can evolve with you. Tubro welcomes Sammamish homeowners planning residential improvements, with a focus on clear communication and carefully coordinated work.",
    planningTitle: "Plan around how you use your home.",
    planningBody:
      "Tell us which everyday activities your Sammamish remodel should support, whether that means cooking, gathering, or getting ready. The purpose of the space helps define the work.",
    photos: ["dark", "bright", "shaker", "bath"],
  },
};
