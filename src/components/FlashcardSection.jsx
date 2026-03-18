import Flashcard from "./Flashcard";

const FlashcardSection = ({ category, cards }) => {
  return (
    <>
      <h3>{category}</h3>

      {cards.map((card) => (
        <Flashcard key={card.id} card={card} />
      ))}
    </>
  );
};

export default FlashcardSection;
