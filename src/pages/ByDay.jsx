import { useEffect } from "react";
import DayNavbar from "../components/DayNavbar";
import ByDayCard from "../components/ByDayCard";
import { daysData } from "../data/days";

function ByDay() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="tab-content active">
      <DayNavbar />

      <div className="section">
        <h2>📅 Day-by-Day Breakdown</h2>

        {daysData.map((day) => (
          <div key={day.number}>
            <ByDayCard day={day} />

            {day.number < 7 && (
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

export default ByDay;
