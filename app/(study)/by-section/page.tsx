"use client";

import { useState } from "react";
import { getSectionById } from "@/lib/trainingData";
import SectionHeader from "@/components/study/SectionHeader";
import ScriptCard from "@/components/study/ScriptCard";
import FlashCard from "@/components/study/Flashcard";
import BackToTop from "@/components/study/BackToTop";

const TABS = [
  { id: "initiate", label: "Initiate", step: 1 },
  { id: "educate", label: "Educate", step: 2 },
  { id: "differentiate", label: "Differentiate", step: 3 },
  { id: "motivate", label: "Motivate", step: 4 },
  { id: "saturate", label: "Saturate", step: 5 },
];

export default function BySectionPage() {
  const [activeTab, setActiveTab] = useState("initiate");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const section = getSectionById(activeTab) as any;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex gap-2 border-b border-gray-700 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-gray-500 mr-1">{tab.step}.</span>
            {tab.label}
          </button>
        ))}
      </div>

      {section ? (
        <>
          <SectionHeader section={section} />

          {section.scripts && section.scripts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
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
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
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
        </>
      ) : (
        <p className="text-gray-500 text-center py-16">
          Content coming soon for this step.
        </p>
      )}
      <BackToTop />
    </div>
  );
}
