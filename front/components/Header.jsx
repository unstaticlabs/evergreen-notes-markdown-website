import { useBase } from "../utils"

import Config from "../../config.json"

import "./Header.scss"

const Header = () => {

  const base = useBase()

  return (
    <header id="header">
      <h1>{Config.title}</h1>
      {(Config.bookmarks ?? []).map((noteTitle) => (
        <a key={noteTitle}
          className="noteLink"
          href={`${base}/${noteTitle.toLowerCase()}`}
        >{noteTitle}</a>
      ))}
    </header>
  )
}

export default Header
