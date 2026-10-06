import Reveal from "./ui/Reveal";
import { SCREENSHOTS } from "../lib/site";

/**
 * Social proof: real screenshots from the community (chats, deal wins,
 * discussions). Add files to public/screenshots/ and list them in SCREENSHOTS.
 * Shots stack in one centered column so the chat text stays readable.
 */
export default function ShowcaseSection() {
  return (
    <section className="px-5 py-12 md:py-20" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">מתוך הקהילה</span>
            <h2
              id="showcase-heading"
              className="mx-auto mt-4 max-w-3xl text-balance text-[clamp(2rem,4.8vw,3.3rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
            >
              ככה זה נראה מבפנים
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-5">
            {SCREENSHOTS.map((shot) => (
              <li key={shot.src}>
                <a
                  href={shot.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring block overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-card transition-shadow hover:shadow-lg sm:p-3"
                  aria-label={`פתיחת צילום המסך בגודל מלא: ${shot.alt}`}
                >
                  <img
                    src={shot.src}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-xl ring-1 ring-ink/5"
                    alt={shot.alt}
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
