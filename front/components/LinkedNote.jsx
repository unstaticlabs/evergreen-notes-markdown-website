/* eslint-disable react/prop-types */
import "./LinkedNote.scss";

import Db from "../db/Db";
import { useEffect, useState } from "react";
import { useHref } from "react-router";

function LinkedNote({ path }) {
  const [note, setNote] = useState({});
  const _base = useHref("/");
  const base = _base === '/' ? '' : _base

  useEffect(() => {
    const a = async () => {
      setNote(await Db.getNote(path));
    };
    a();
  }, [path]);

  return (
    <a href={`${base}/${encodeURIComponent(path)}`}>
      <div className="LinkedNote Backlink">
        <p className="Title">{note.title}</p>
      </div>
    </a>
  );
}

export default LinkedNote;
