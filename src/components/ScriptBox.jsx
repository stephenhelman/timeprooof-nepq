const ScriptBox = ({ script }) => {
  const { title, subtitle, ordered, content } = script;
  const scriptContent = content.map((item, index) => {
    return <li key={index}>{item}</li>;
  });
  const scriptList = ordered ? (
    <ol>{scriptContent}</ol>
  ) : (
    <ul>{scriptContent}</ul>
  );

  return (
    <>
      {title && (
        <div>
          <strong className="title">{title}</strong>
        </div>
      )}
      {subtitle && <p>{subtitle}</p>}
      {scriptList}
    </>
  );
};

export default ScriptBox;
