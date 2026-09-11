import heroKitchen from "../../public/images/projects/0125047_kitchen 01.jpg";
import roomsKitchen from "../../public/images/projects/0125065_kitchen 01.jpg";
import roomsBathroom from "../../public/images/projects/0925012_bathroom 01.jpg";
import capExteriorPaint from "../../public/images/projects/0426023_exterior paint 01.jpg";
import capDeck from "../../public/images/projects/1221004_deck 01.jpg";
import capExteriorStain from "../../public/images/projects/0825017_ext stain 01.jpeg";
import workBathroomDark from "../../public/images/projects/0128008_bathroom 01.jpg";
import workBathroomLight from "../../public/images/projects/0126030_bathroom 01.jpg";
import workKitchen from "../../public/images/projects/0325011_kitchen 02.jpg";
import workDeck from "../../public/images/projects/0524016_deck 02.jpg";
import tcLogo from "../../public/images/tc-logo.png";

export const IMAGES = {
  logo: {
    src: tcLogo,
    alt: "Tubro Construction",
  },
  hero: {
    src: heroKitchen,
    alt: "Remodeled open kitchen with a large dark-countertop island, gray shaker cabinets, and wide-plank flooring",
  },
  roomsKitchen: {
    src: roomsKitchen,
    alt: "Bright remodeled kitchen with white cabinetry, quartz peninsula, farmhouse sink, and a skylight",
  },
  roomsBathroom: {
    src: roomsBathroom,
    alt: "Remodeled bathroom with a glass walk-in shower, freestanding tub, double vanity, and skylight",
  },
  capExteriorPaint: {
    src: capExteriorPaint,
    alt: "Two-story home with freshly painted blue siding, white garage doors, and landscaped yard",
  },
  capDeck: {
    src: capDeck,
    alt: "Wide deck with black metal railing overlooking a residential valley",
  },
  capExteriorStain: {
    src: capExteriorStain,
    alt: "Home entry with stained timber beams, stone columns, and wood front door",
  },
  workBathroomDark: {
    src: workBathroomDark,
    alt: "Bathroom remodel in dark marble-look tile with a round mirror, black fixtures, and a skylight",
  },
  workBathroomLight: {
    src: workBathroomLight,
    alt: "Bathroom remodel with freestanding tub, glass shower with mosaic tile pan, and subway-tile walls",
  },
  workKitchen: {
    src: workKitchen,
    alt: "Kitchen remodel with white shaker cabinets, stainless range hood, and marble-look island",
  },
  workDeck: {
    src: workDeck,
    alt: "New backyard deck with black aluminum railing beside a gray house",
  },
} as const;
