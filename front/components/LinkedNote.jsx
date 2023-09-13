/* eslint-disable react/prop-types */
import { useBase } from "../utils";

import "./LinkedNote.scss";

const LinkedNote = ({ noteId, showPopoverForNote }) => {

  const base = useBase()

  return (
    <a
      href={`${base}/${encodeURIComponent(noteId)}`}
      onMouseEnter={(e) => showPopoverForNote({
        noteId,
        elementPosition: e.target.getBoundingClientRect()
      })}
      onMouseLeave={() => showPopoverForNote()}
    >
      <div className="LinkedNote Backlink">
        <p className="Title">{noteId}</p>
      </div>
    </a>
  );
}

export default LinkedNote;
