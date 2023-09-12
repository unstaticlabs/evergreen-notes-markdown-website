/* eslint-disable react/prop-types */
import "./LinkedNote.scss";

import Db from "../db/Db";
import { useEffect, useState } from "react";
import { useHref } from "react-router";

function LinkedNote({ path }) {
  const [note, setNote] = useState({});
  const base = useHref("/");

  useEffect(() => {
    const a = async () => {
      setNote(await Db.getNote(path));
    };
    a();
  }, [path]);

  return (
    <a href={`${base}/${path}`}>
      <div className="LinkedNote Backlink">
        <p className="Title">{note.title}</p>
        <p className="Preview">
          <span>{note?.content?.substr(0, 140)}</span>
        </p>
      </div>
    </a>
  );
}

export default LinkedNote;
