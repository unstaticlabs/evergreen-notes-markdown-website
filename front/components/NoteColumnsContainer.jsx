/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import "./NoteColumnsContainer.scss";
import NoteContainer from "./NoteContainer";
import Db from "../db/Db";
import Popover from "./Popover";

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
  const [popoverData, setPopoverData] = useState(null);

  let query = useQuery();

  const handleScrollToNote = (notePath) => {
    const index = noteIds.indexOf(notePath);
    scrollToAmount((index === -1 ? noteIds.length : index) * NOTE_WIDTH)
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
        const noteIsTooFarOnTheLeft = scroll > NOTE_WIDTH * (index + 1) - 80;
        const lastNote = index === noteIds.length - 1;
        return (
          <NoteContainer
            verticalMode={
              noteIsTooFarOnTheLeft ||
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
            noteIdsStack={noteIds}
            scrollToNote={handleScrollToNote}
            showPopoverForNote={data => setPopoverData(data)}
            key={note.path ?? '.404'}
          />
        );
      })}
      {popoverData ? <Popover elementPosition={popoverData.elementPosition} noteId={popoverData.noteId} /> : <></>}
    </div>
  );
}

export default NoteColumnsContainer;
