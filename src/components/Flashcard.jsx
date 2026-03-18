import { useState } from "react";

function Flashcard({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { question, answer } = card;
  const { ordered, content } = answer;
  const answerContent = content.map((item, index) => {
    return (
      <li key={index}>
        <strong>{item.bold}</strong>
        {item.text}
      </li>
    );
  });
  const answerList = ordered ? (
    <ol>{answerContent}</ol>
  ) : (
    <ul>{answerContent}</ul>
  );

  return (
    <div
      className={`flashcard ${isFlipped ? "show" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flashcard-q">{question}</div>
      {isFlipped && <div className="flashcard-a">{answerList}</div>}
    </div>
  );
}

export default Flashcard;
