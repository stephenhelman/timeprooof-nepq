const GlossaryCard = ({ term, definition }) => {
  return (
    <div className="script-box">
      <div className="label">{term}</div>
      <p>{definition}</p>
    </div>
  );
};

export default GlossaryCard;
