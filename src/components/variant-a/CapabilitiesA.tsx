import Image from "next/image";
import { Fence, Hammer, HousePlus, PaintRoller } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";
import { CAPABILITIES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { Reveal } from "@/components/shared/Reveal";

const CAPABILITY_ICONS: readonly LucideIcon[] = [HousePlus, Hammer, PaintRoller, Fence];

const PHOTO_LABELS = {
  paint: "Exterior Paint",
  deck: "Deck & Outdoor Living",
  stain: "Exterior Stain & Materials",
} as const;

const TAPE_UNIT_COUNT = 7;
const EIGHTHS_PER_UNIT = 8;
const TAPE_EIGHTH_WIDTH = 11;
const TAPE_ORIGIN_X = 24;
const TAPE_END_PAD = 12;
const TAPE_HEIGHT = 34;
const TAPE_WIDTH = TAPE_ORIGIN_X + TAPE_UNIT_COUNT * EIGHTHS_PER_UNIT * TAPE_EIGHTH_WIDTH + TAPE_END_PAD;

function tapeTickLength(eighth: number): number {
  if (eighth % EIGHTHS_PER_UNIT === 0) return 19;
  if (eighth % (EIGHTHS_PER_UNIT / 2) === 0) return 13;
  if (eighth % (EIGHTHS_PER_UNIT / 4) === 0) return 9;
  return 6;
}

const TAPE_TICK_PATH = Array.from({ length: TAPE_UNIT_COUNT * EIGHTHS_PER_UNIT + 1 }, (_, eighth) => {
  const x = TAPE_ORIGIN_X + eighth * TAPE_EIGHTH_WIDTH;
  return `M${x} 0V${tapeTickLength(eighth)}`;
}).join("");

const TAPE_UNIT_NUMBERS = Array.from({ length: TAPE_UNIT_COUNT }, (_, index) => index + 1);

function MeasureTape(): ReactElement {
  return (
    <svg
      className="a-cap-tape"
      viewBox={`0 0 ${TAPE_WIDTH} ${TAPE_HEIGHT}`}
      preserveAspectRatio="xMinYMin meet"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width={TAPE_WIDTH - 1} height={TAPE_HEIGHT - 1} />
      <path className="a-cap-tape-hook" d={`M10 3V${TAPE_HEIGHT - 3}H3`} />
      <path className="a-cap-tape-ticks" d={TAPE_TICK_PATH} />
      {TAPE_UNIT_NUMBERS.map((unit) => (
        <text key={unit} x={TAPE_ORIGIN_X + unit * EIGHTHS_PER_UNIT * TAPE_EIGHTH_WIDTH + 5} y={TAPE_HEIGHT - 8}>
          {unit}
        </text>
      ))}
    </svg>
  );
}

export function CapabilitiesA(): ReactElement {
  return (
    <section id="services" aria-labelledby="capabilities-a-heading" className="a-capabilities relative bg-white">
      <svg className="a-capability-route" viewBox="0 0 1536 864" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1212 40H1536M1504 40V286M1416 505V864" />
        <rect x="1202" y="30" width="20" height="20" />
        <rect x="1406" y="784" width="20" height="20" />
      </svg>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-14 lg:py-24">
        <Reveal className="lg:col-span-5">
          <h2
            id="capabilities-a-heading"
            className="max-w-md font-poppins text-[32px] leading-[1.06] font-bold tracking-tight text-ink lg:text-[42px]"
          >
            {CAPABILITIES.heading.slice(0, -1)}
            <span className="text-action">.</span>
          </h2>
          <p className="mt-5 max-w-md font-fjalla text-sm leading-relaxed text-ink/80">
            {CAPABILITIES.body}
          </p>
          <ul className="mt-9 space-y-5">
            {CAPABILITIES.items.map((item, index) => {
              const Icon = CAPABILITY_ICONS[index];
              return (
                <li key={item} className="flex items-center gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-sage text-action-deep">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className="h-8 w-px bg-action/40" />
                  <span className="font-fjalla text-sm tracking-[0.05em] text-ink uppercase">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal className="relative mt-12 lg:col-span-7 lg:mt-0" delayMs={80}>
          <figure className="a-cap-paint relative aspect-4/3 w-full lg:w-[72%]">
            <Image
              src={IMAGES.capExteriorPaint.src}
              alt={IMAGES.capExteriorPaint.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <MeasureTape />
            <figcaption className="a-cap-label">{PHOTO_LABELS.paint}</figcaption>
          </figure>
          <figure className="a-cap-deck relative z-10 mt-3 aspect-16/10 w-full shadow-xl lg:absolute lg:top-[36%] lg:right-0 lg:mt-0 lg:w-[44%]">
            <Image
              src={IMAGES.capDeck.src}
              alt={IMAGES.capDeck.alt}
              fill
              sizes="(min-width: 1024px) 26vw, 100vw"
              className="object-cover"
            />
            <figcaption className="a-cap-label">{PHOTO_LABELS.deck}</figcaption>
          </figure>
          <figure className="a-cap-stain relative z-20 mt-3 aspect-3/4 w-[58%] shadow-xl lg:mt-[-9%] lg:ml-[30%] lg:w-[36%]">
            <Image
              src={IMAGES.capExteriorStain.src}
              alt={IMAGES.capExteriorStain.alt}
              fill
              sizes="(min-width: 1024px) 21vw, 58vw"
              className="object-cover"
            />
            <figcaption className="a-cap-label">{PHOTO_LABELS.stain}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
