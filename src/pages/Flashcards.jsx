import FlashcardSection from "../components/FlashcardSection";
import { flashcardData, flashcardCategories } from "../data/flashcards";

const Flashcards = () => {
  return (
    <div className="tab-content active">
      <div className="section">
        <h2>🎴 Flashcards</h2>

        {flashcardCategories.map((category, index) => (
          <div key={category}>
            <FlashcardSection category={category} cards={flashcardData[category]} />

            {index < flashcardCategories.length - 1 && (
              <hr
                style={{
                  margin: "40px 0",
                  border: "none",
                  borderTop: "2px solid #e0e0e0",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
