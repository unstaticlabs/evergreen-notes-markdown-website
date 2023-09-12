import "./Header.scss";

function Header() {
  return (
    <header id="header">
      <h1>My notes</h1>
      <a className="noteLink" href="/note1">
        note1
      </a>
    </header>
  );
}

export default Header;
