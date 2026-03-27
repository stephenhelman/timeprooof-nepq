"use client";

import { useState } from "react";

interface FlashcardData {
  id: string;
  question: string;
  ordered?: boolean;
  answer: Array<{ term?: string; detail: string }>;
}

export default function FlashCard({ card }: { card: FlashcardData }) {
  const [flipped, setFlipped] = useState(false);

  const ListTag = card.ordered ? "ol" : "ul";
  const listClass = card.ordered
    ? "list-decimal ml-4 space-y-1 text-sm"
    : "list-disc ml-4 space-y-1 text-sm";

  return (
    <div
      className="cursor-pointer bg-gray-800 rounded-xl p-6 relative"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        style={{
          transition: "transform 0.5s",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "",
          display: "grid",
        }}
      >
        {/* Front */}
        <div
          style={{ gridArea: "1/1", backfaceVisibility: "hidden" }}
          className="flex flex-col justify-between"
        >
          <p className="text-white font-semibold text-base">{card.question}</p>
          <p className="text-gray-500 text-xs mt-4">Click to flip</p>
        </div>

        {/* Back */}
        <div
          style={{
            gridArea: "1/1",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <ListTag className={listClass}>
            {card.answer.map((item, i) => (
              <li key={i}>
                {item.term ? (
                  <>
                    <span className="font-bold text-blue-300">{item.term}</span>
                    <span className="text-gray-300"> — {item.detail}</span>
                  </>
                ) : (
                  <span className="text-gray-300">{item.detail}</span>
                )}
              </li>
            ))}
          </ListTag>
        </div>
      </div>
    </div>
  );
}
