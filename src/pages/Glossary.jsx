import GlossaryCard from "../components/GlossaryCard";
import { glossaryData } from "../data/glossary";

const Glossary = () => {
  return (
    <div className="tab-content active">
      <div className="section">
        <h2>📖 Glossary</h2>

        {glossaryData.map((entry) => (
          <GlossaryCard key={entry.id} term={entry.term} definition={entry.definition} />
        ))}
      </div>
    </div>
  );
};

export default Glossary;
