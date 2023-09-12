/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import "./NoteColumnsContainer.scss";
import NoteContainer from "./NoteContainer";

const NOTE_WIDTH = 585;

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function NoteColumnsContainer({ scroll }) {
  const { entrypoint } = useParams();
  const [notePaths, setNotePaths] = useState([entrypoint]);

  let query = useQuery();

  useEffect(() => {
    setNotePaths(
      [entrypoint, ...query.getAll("stacked")].map((e) => decodeURIComponent(e))
    );
  }, [entrypoint, query]);

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
          />
        );
      })}
    </div>
  );
}

export default NoteColumnsContainer;
