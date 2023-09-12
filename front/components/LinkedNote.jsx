/* eslint-disable react/prop-types */
import "./LinkedNote.scss";

import { useHref } from "react-router";

const LinkedNote = ({ noteId }) => {
  const _base = useHref("/");
  const base = _base === '/' ? '' : _base

  return (
    <a href={`${base}/${encodeURIComponent(noteId)}`}>
      <div className="LinkedNote Backlink">
        <p className="Title">{noteId}</p>
      </div>
    </a>
  );
}

export default LinkedNote;
