"use client";

import { useState } from "react";
import { trainingData } from "@/lib/trainingData";
import FlashCard from "@/components/study/Flashcard";
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
const sectionsWithCards = [...salesSections, ...operationalSections].filter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s: any) => s.flashcards && s.flashcards.length > 0
);

export default function FlashcardsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const visibleSections =
    activeFilter === "all"
      ? sectionsWithCards
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sectionsWithCards.filter((s: any) => s.id === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveFilter("all")}
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          All
        </button>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {sectionsWithCards.map((s: any) => (
          <button
            key={s.id}
            onClick={() => setActiveFilter(s.id)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              activeFilter === s.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {visibleSections.map((section: any, idx: number) => (
        <div key={section.id}>
          {idx > 0 && <hr className="border-gray-700 my-8" />}
          <h2 className="text-lg font-bold text-white mb-4">
            {section.title}
            <span className="text-gray-500 font-normal text-sm ml-2">
              ({section.flashcards.length} cards)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {section.flashcards.map((fc: any) => (
              <FlashCard key={fc.id} card={fc} />
            ))}
          </div>
        </div>
      ))}
      <BackToTop />
    </div>
  );
}
