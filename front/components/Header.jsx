import { useHref } from "react-router";
import "./Header.scss";
import Config from "../../config.json";

function Header() {
  const base = useHref("/");
  return (
    <header id="header">
      <h1>{Config.title}</h1>
      {(Config.notes ?? []).map((n) => (
        <a key={n.link} className="noteLink" href={`${base}/${n.link}`}>
          {n.title}
        </a>
      ))}
    </header>
  );
}

export default Header;
