"use client";

import { trainingData } from "@/lib/trainingData";
import ScriptCard from "@/components/study/ScriptCard";
import BackToTop from "@/components/study/BackToTop";

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
const orderedSections = [...salesSections, ...operationalSections].filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s: any) => s.scripts && s.scripts.length > 0
);

export default function ScriptsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {orderedSections.map((s: any) => (
          <button
            key={s.id}
            onClick={() =>
              document
                .getElementById(`scripts-${s.id}`)
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {orderedSections.map((section: any, idx: number) => (
        <div key={section.id} id={`scripts-${section.id}`}>
          {idx > 0 && <hr className="border-gray-700 my-10" />}
          <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {section.scripts.map((sc: any) => (
            <ScriptCard key={sc.id} script={sc} />
          ))}
        </div>
      ))}
      <BackToTop />
    </div>
  );
}
