/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import "./NoteColumnsContainer.scss";
import NoteContainer from "./NoteContainer";
import Db from "../db/Db";

const NOTE_WIDTH = 585;

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function NoteColumnsContainer({ scroll, scrollToAmount }) {
  const { entrypoint } = useParams();
  const [notePaths, setNotePaths] = useState([entrypoint]);
  const [title, setTitle] = useState("");

  let query = useQuery();

  const handleScrollToNote = (notePath) => {
    const index = notePaths.indexOf(notePath);
    scrollToAmount(index * NOTE_WIDTH)
  }

  useEffect(() => {
    setNotePaths(
      [entrypoint, ...query.getAll("stacked")].map((e) => decodeURIComponent(e))
    );
  }, [entrypoint, query]);

  useEffect(() => {
    const updateTitle = async () => {
      const notes = await Promise.all(notePaths.map((n) => Db.getNote(n)));
      setTitle(notes.map((n) => n.title).join(" | "));
    };
    updateTitle();
  }, [notePaths]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="NoteColumnsContainer">
      {notePaths.map((path, index) => {
        const noteTropAGauche = scroll > NOTE_WIDTH * (index + 1) - 80;
        const lastNote = index === notePaths.length - 1;
        return (
          <NoteContainer
            verticalMode={
              noteTropAGauche ||
              (lastNote &&
                window.innerWidth +
                scroll -
                NOTE_WIDTH * (notePaths.length - 1) <
                150 &&
                scroll < NOTE_WIDTH * (notePaths.length - 2) - 65)
            }
            overlay={
              scroll > Math.max(NOTE_WIDTH * (index - 1), 0) ||
              (lastNote && scroll < NOTE_WIDTH * (notePaths.length - 2) - 400)
            }
            style={{ left: `${index * 40}px`, right: `-${NOTE_WIDTH}px` }}
            key={path}
            path={path}
            scrollToNote={handleScrollToNote}
          />
        );
      })}
    </div>
  );
}

export default NoteColumnsContainer;
