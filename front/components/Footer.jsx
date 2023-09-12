/* eslint-disable react/prop-types */
import "./Footer.scss";

import Db from "../db/Db";
import { useEffect, useState } from "react";
import LinkedNote from "./LinkedNote";

function Footer({ path }) {
  const [note, setNote] = useState({});

  useEffect(() => {
    const a = async () => {
      setNote(await Db.getNote(path));
    };
    a();
  }, [path]);

  return (
    <div className="Footer">
      <h3 className="BacklinksHeading">Links to this note</h3>
      <div className="BacklinksContainer">
        {note?.referenced_by?.map((k) => (
          <LinkedNote key={k} path={k} />
        ))}
      </div>
    </div>
  );
}

export default Footer;
