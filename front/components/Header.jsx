import { useHref } from "react-router";
import "./Header.scss";
import Config from "../../config.json";

function Header() {
  const _base = useHref("/");
  const base = _base === '/' ? '' : _base

  return (
    <header id="header">
      <h1>{Config.title}</h1>
      {(Config.bookmarks ?? []).map((noteIndex) => (
        <a key={noteIndex} className="noteLink" href={`${base}/${noteIndex}`}>
          {noteIndex}
        </a>
      ))}
    </header>
  );
}

export default Header;
