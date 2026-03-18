import Flashcard from "./Flashcard";
import ScriptBox from "./ScriptBox";

const ByDayCard = ({ day }) => {
  return (
    <>
      <h3 id={`day-${day.number}`}>{day.title}</h3>
      <div className="alert alert-info">{day.pages}</div>

      <h4>Key Topics:</h4>
      {day.flashcards.map((card, index) => {
        return <Flashcard key={index} card={card} />;
      })}

      {day.scripts.map((script, index) => {
        const { title, subtitle, ordered, scripts } = script;
        const scriptContent = scripts.map((script, index) => {
          return <ScriptBox key={index} script={script} />;
        });
        const scriptList = ordered ? (
          <ol>{scriptContent}</ol>
        ) : (
          <ul>{scriptContent}</ul>
        );
        const action = script?.action;
        const note = script?.note;
        return (
          <div className="script-box" key={index}>
            {title && <div className="label">{title}</div>}
            {subtitle && <p>{subtitle}</p>}
            {scriptList}
            {action && <p>⚠️ ACTION: {action}</p>}
            {note && <em>NOTE: {note}</em>}
          </div>
        );
      })}
    </>
  );
};

export default ByDayCard;
