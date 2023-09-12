import { useState, useRef } from "react";

import "./NoteColumnsScrollingContainer.scss";
import NoteColumnsContainer from "./NoteColumnsContainer";

function NoteColumnsScrollingContainer() {
  const [scroll, setScroll] = useState(0);
  const scrollingContainerRef = useRef(null)

  const handleScrollToAmount = (amount) => {
    scrollingContainerRef.current.scroll(amount, 0)
  }

  return (
    <main
      ref={scrollingContainerRef}
      className="NoteColumnsScrollingContainer"
      onScroll={(e) => {
        setScroll(e.currentTarget.scrollLeft)
      }}
    >
      <NoteColumnsContainer scroll={scroll} scrollToAmount={handleScrollToAmount} />
    </main>
  );
}

export default NoteColumnsScrollingContainer;
