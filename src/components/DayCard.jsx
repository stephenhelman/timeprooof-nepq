const DayCard = ({ day }) => {
  return (
    <div className="day-card">
      <h3>{day.title}</h3>
      <ul>
        {day.list.map((item, index) => {
          return (
            <li key={index}>
              <strong>{item.bold}</strong>
              {item.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DayCard;
