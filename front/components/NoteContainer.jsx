/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useParams } from "react-router-dom";

import "./NoteContainer.scss";
import Db from "../db/Db";

function NoteContainer({ style, verticalMode, overlay, path }) {
  const [note, setNote] = useState({ index: 0 });

  const { entrypoint } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getNoteAndParseLinks = async () => {
      const note = await Db.getNote(path);
      setNote({
        ...note,
        content: `# ${note.title}\n\n${note.content}`.replaceAll(
          /\[\[([^\]]*)\]\]/g,
          (_match, group1) => {
            return `[${group1}](/${encodeURIComponent(group1)})`;
          }
        ),
      });
    };
    getNoteAndParseLinks();
  }, [path]);

  const handleClick = (e) => {
    if (e.target.nodeName.toLowerCase() === "a") {
      if (!e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const notePath = e.target.pathname.slice(1);
        const currentPaths = searchParams.getAll("stacked");
        if (currentPaths.includes(notePath) || entrypoint === notePath) {
          console.log("Should scroll");
        } else {
          const index = currentPaths.indexOf(path);
          setSearchParams({
            stacked: [...currentPaths.slice(0, index + 1), notePath],
          });
        }
      }
    }
  };

  return (
    <main className={`NoteContainer ${overlay ? "Overlay" : ""}`} style={style}>
      <div
        className="PresentedNote"
        style={{ opacity: verticalMode ? 0 : undefined }}
      >
        <div className="NoteContainer">
          <div className="PrimaryNote">
            <div>
              <div className="MarkdownContainer" onClick={handleClick}>
                <ReactMarkdown>{note?.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      {verticalMode ? <div className="ObscuredLabel">{note?.title}</div> : <></>}
    </main>
  );
}

export default NoteContainer;
