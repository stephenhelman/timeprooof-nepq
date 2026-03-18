import DayCard from "../components/DayCard";
import { overviewContent } from "../data/overview";

const Overview = () => {
  return (
    <div className="container">
      <div className="section">
        <h2>🎯 Training Overview</h2>
        <h3>Training Structure</h3>

        {overviewContent.map((content, index) => {
          return <DayCard day={content} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Overview;
