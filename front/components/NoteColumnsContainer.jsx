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

const NoteColumnsContainer = ({ scroll, scrollToAmount }) => {
  const { entrypoint } = useParams();
  const [noteIds, setNoteIds] = useState([entrypoint]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);

  let query = useQuery();

  const handleScrollToNote = (notePath) => {
    const index = noteIds.indexOf(notePath);
    scrollToAmount(index * NOTE_WIDTH)
  }

  useEffect(() => {
    setNoteIds(
      [entrypoint, ...query.getAll("stacked")].map((e) => decodeURIComponent(e))
    );
  }, [entrypoint, query]);

  useEffect(() => {
    Promise.all(noteIds.map((n) => Db.getNote(n))).then(
      notes => setNotes(notes)
    )
  }, [noteIds]);

  useEffect(() => {
    setTitle(notes.map((n) => n.title).join(" | "));
  }, [notes]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="NoteColumnsContainer">
      {notes.map((note, index) => {
        const noteTropAGauche = scroll > NOTE_WIDTH * (index + 1) - 80;
        const lastNote = index === noteIds.length - 1;
        return (
          <NoteContainer
            verticalMode={
              noteTropAGauche ||
              (lastNote &&
                window.innerWidth +
                scroll -
                NOTE_WIDTH * (noteIds.length - 1) <
                150 &&
                scroll < NOTE_WIDTH * (noteIds.length - 2) - 65)
            }
            overlay={
              scroll > Math.max(NOTE_WIDTH * (index - 1), 0) ||
              (lastNote && scroll < NOTE_WIDTH * (noteIds.length - 2) - 400)
            }
            style={{ left: `${index * 40}px`, right: `-${NOTE_WIDTH}px` }}
            note={note}
            noteIdsStack={noteIds.slice(1)}
            scrollToNote={handleScrollToNote}
            key={note.path ?? '.404'}
          />
        );
      })}
    </div>
  );
}

export default NoteColumnsContainer;
