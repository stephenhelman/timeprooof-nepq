import ScriptCard from "../components/ScriptCard";
import { scriptsData } from "../data/scripts";

function Scripts() {
  return (
    <div className="tab-content active">
      <div className="section">
        <h2>📋 Scripts</h2>

        {scriptsData.map((category, index) => (
          <div key={category.category}>
            <ScriptCard category={category} />

            {index < scriptsData.length - 1 && (
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
}

export default Scripts;
