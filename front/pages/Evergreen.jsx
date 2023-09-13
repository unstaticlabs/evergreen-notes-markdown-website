import Db from "../db/Db"

import NotePageRoot from "../components/NotePageRoot";

import "./Evergreen.scss";
import { useEffect, useState } from "react";

const Evergreen = () => {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Db.loadIndex().then(
      () => setLoading(false)
    )
  }, [])

  return (
    <>
      {loading || <NotePageRoot />}
    </>
  );
}

export default Evergreen;
