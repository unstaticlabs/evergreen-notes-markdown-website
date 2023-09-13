/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useSearchParams, useParams, useHref } from "react-router-dom"

import Footer from "./Footer"
import { noteToMarkdownContent } from "../utils"

import "./NoteContainer.scss"

const NoteContainer = ({ style, verticalMode, overlay, note, noteIdsStack, scrollToNote, hidePopover, showPopoverForNote }) => {

  const [noteContent, setNoteContent] = useState("Loading...")

  const { entrypoint } = useParams()
  const setSearchParams = useSearchParams()[1]

  const _base = useHref("/")
  const base = _base === '/' ? '' : _base

  useEffect(() => {
    setNoteContent(noteToMarkdownContent(base, note))
  }, [note, base])

  useEffect(() => {
    scrollToNote();
  }, [])

  const findParentA = (target, count = 5) => {
    if (target.nodeName.toLowerCase() === "a")
      return target
    if (count === 0)
      return null
    return findParentA(target.parentNode, count - 1)
  }

  const isLinkRemote = (targetA) =>
    (new URL(document.baseURI).origin !== new URL(targetA.href, document.baseURI).origin)

  const extractNoteId = (pathname) => {
    return decodeURIComponent(pathname.slice(
      base.length === 1 ? 1 : base.length + 1
    ))
  }

  const extractPathAndAddToStack = (targetA) => {
    const linkNoteId = extractNoteId(targetA.pathname);

    if (noteIdsStack.includes(linkNoteId) || entrypoint === linkNoteId) {
      scrollToNote(linkNoteId)
    } else {
      const index = noteIdsStack.indexOf(note.id);
      setSearchParams({
        stacked: [...noteIdsStack.slice(0, index + 1), linkNoteId],
      })
    }
  }

  const handleClick = (e) => {
    if (e.target.nodeName.toLowerCase() === "a") {
      if (!e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (!isLinkRemote(e.target)) {
          e.preventDefault()
          extractPathAndAddToStack(e.target)
        }
      }
    } else {
      const target = findParentA(e.target)
      if (target) {
        e.preventDefault()
        extractPathAndAddToStack(target)
      }
    }
  }

  return (
    <main className={`NoteContainer ${overlay ? "Overlay" : ""}`} style={style}>
      <div
        className="PresentedNote"
        style={{ opacity: verticalMode ? 0 : undefined }}
      >
        <div className="NoteContainer" onClick={handleClick}>
          <div className="PrimaryNote">
            <div>
              <div className="MarkdownContainer">
                <ReactMarkdown
                  components={{
                    a: ({ ...props }) => <a
                      href={props.href}
                      onMouseEnter={(e) => showPopoverForNote({
                        noteId: extractNoteId(new URL(props.href, document.baseURI).pathname),
                        elementPosition: e.target.getBoundingClientRect()
                      })}
                      onMouseLeave={() => hidePopover()}
                    >{props.children[0]}</a>
                  }}
                >{noteContent}</ReactMarkdown>
              </div>
            </div>
          </div>
          <Footer note={note} showPopoverForNote={showPopoverForNote} hidePopover={hidePopover} />
        </div>
      </div>
      {verticalMode ? (
        <div className="ObscuredLabel">{note?.title}</div>
      ) : (
        <></>
      )}
    </main>
  )
}

export default NoteContainer
