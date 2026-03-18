function DayNavbar() {
  const days = [
    { num: 1 },
    { num: 2 },
    { num: 3 },
    { num: 4 },
    { num: 5 },
    { num: 6 },
    { num: 7 },
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: "60px",
        zIndex: 50,
        background: "white",
        padding: "15px 0",
        borderBottom: "2px solid #e0e0e0",
        marginBottom: "30px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {days.map((day) => (
          <a
            key={day.num}
            href={`#day-${day.num}`}
            style={{
              padding: "10px 20px",
              background: "#3498db",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.95em",
              transition: "all 0.2s ease",
            }}
          >
            Day {day.num}
          </a>
        ))}
      </div>
    </div>
  );
}

export default DayNavbar;
