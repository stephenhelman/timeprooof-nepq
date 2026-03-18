import ScriptBox from "./ScriptBox";

const ScriptCard = ({ category }) => {
  const categoryId = category.category
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()&]/g, "");

  return (
    <>
      <h3 id={`category-${categoryId}`}>{category.category}</h3>

      {category.scripts.map((script) => (
        <div className="script-box" key={script.id}>
          <div className="label">{script.label}</div>
          <ScriptBox script={{ ...script, title: null }} />
        </div>
      ))}
    </>
  );
};

export default ScriptCard;
