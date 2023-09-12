import "./NoteColumnsScrollingContainer.scss";
import NoteColumnsContainer from "./NoteColumnsContainer";
import { useState } from "react";

function NoteColumnsScrollingContainer() {
  const [scroll, setScroll] = useState(0);

  return (
    <main
      className="NoteColumnsScrollingContainer"
      onScroll={(e) => {
        setScroll(e.currentTarget.scrollLeft)
      }}
    >
      <NoteColumnsContainer scroll={scroll} />
    </main>
  );
}

export default NoteColumnsScrollingContainer;
