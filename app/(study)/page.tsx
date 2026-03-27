import { trainingData } from "@/lib/trainingData";
import SectionHeader from "@/components/study/SectionHeader";
import ScriptCard from "@/components/study/ScriptCard";
import FlashCard from "@/components/study/Flashcard";
import BackToTop from "@/components/study/BackToTop";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const salesSections = (trainingData as any).sections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .filter((s: any) => s.salesStep !== null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .sort((a: any, b: any) => a.salesStep - b.salesStep);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationalSections = (trainingData as any).sections.filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s: any) => s.salesStep === null
);

const orderedSections = [...salesSections, ...operationalSections];

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Training Drills CTA */}
      <div
        className="rounded-2xl p-6 mb-10 flex items-center justify-between gap-4"
        style={{ backgroundColor: "#0B1F3A" }}
      >
        <div>
          <h2 className="text-lg font-bold text-white">
            Ready to practice?
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            AI-powered objection drills and full walkthrough simulations.
          </p>
        </div>
        <Link
          href="/training"
          className="shrink-0 px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C8A84B", color: "#0B1F3A" }}
        >
          Training Drills →
        </Link>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {orderedSections.map((section: any, idx: number) => (
        <div key={section.id}>
          {idx > 0 && <hr className="border-gray-700 my-10" />}
          <SectionHeader section={section} />

          {section.scripts && section.scripts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Scripts
              </h3>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {section.scripts.map((sc: any) => (
                <ScriptCard key={sc.id} script={sc} />
              ))}
            </div>
          )}

          {section.flashcards && section.flashcards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Flashcards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {section.flashcards.map((fc: any) => (
                  <FlashCard key={fc.id} card={fc} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <BackToTop />
    </div>
  );
}
