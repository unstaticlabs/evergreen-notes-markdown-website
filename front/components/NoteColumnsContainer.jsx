/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react"
import { useParams, useSearchParams } from "react-router-dom"

import Db from "../db/Db"

import Popover from "./Popover"
import NoteContainer from "./NoteContainer"

import "./NoteColumnsContainer.scss"

const NOTE_WIDTH = 585

const NoteColumnsContainer = ({ scrollRef }) => {
  const { entrypoint } = useParams()
  const query = useSearchParams()[0]
  const [noteIds, setNoteIds] = useState([entrypoint])
  const [title, setTitle] = useState("Loading notes...")
  const [notes, setNotes] = useState([])
  const [popoverData, setPopoverData] = useState()
  const [scroll, setScroll] = useState(0)

  const scrollToAmount = useCallback((amount) => {
    if (!scrollRef.current) return
    scrollRef.current.scroll(amount, 0)
  }, [scrollRef])

  useEffect(() => {
    setInterval(() => {
      // console.log('interval up!');
      setScroll(scrollRef?.current?.scrollLeft)
    }, 200)
  }, [scrollRef])

  const handleScrollToNote = useCallback((notePath) => {
    const index = noteIds.indexOf(notePath)
    scrollToAmount((index === -1 ? noteIds.length : index) * NOTE_WIDTH)
  }, [noteIds, scrollToAmount])

  useEffect(() => {
    setNoteIds(
      [entrypoint, ...query.getAll("stacked")].map((e) => decodeURIComponent(e))
    )
  }, [entrypoint, query])

  useEffect(() => {
    Promise.all(noteIds.map((n) => Db.getNote(n))).then(
      notes => setNotes(notes)
    )
  }, [noteIds])

  useEffect(() => {
    setTitle(notes.length === 1 ?
      notes[0].title : notes.map((n) => n.title).join(" | ")
    );
  }, [notes])

  useEffect(() => {
    document.title = title;
  }, [title])

  useEffect(() => {
    console.log('rererender')
  })

  return (
    <div className="NoteColumnsContainer">
      {notes.map((note, index) => {
        const noteIsTooFarOnTheLeft = scroll > NOTE_WIDTH * (index + 1) - 80
        const lastNote = index === noteIds.length - 1
        const noteIsTooFarOnTheRight = lastNote &&
          (window.innerWidth + scroll - NOTE_WIDTH * (noteIds.length - 1) < 150) &&
          (scroll < NOTE_WIDTH * (noteIds.length - 2) - 65)
        return (
          <NoteContainer
            verticalMode={
              noteIsTooFarOnTheLeft || noteIsTooFarOnTheRight
            }
            overlay={
              scroll > Math.max(NOTE_WIDTH * (index - 1), 0) ||
              (lastNote && scroll < NOTE_WIDTH * (noteIds.length - 2) - 400)
            }
            style={{ left: `${index * 40}px`, right: `-${NOTE_WIDTH}px` }}
            note={note}
            noteIdsStack={noteIds}
            scrollToNote={handleScrollToNote}
            showPopoverForNote={() => { }}//showPopoverForNote={setPopoverData}
            //TODO: bug with popover, alternates between .404 and note to display
            //TODO: bug with popover, causes MANY re-renders (on NoteContainer, but not on Footer links)
            key={note.path ?? '.404'}
          />
        );
      })}
      {popoverData ? <Popover elementPosition={popoverData.elementPosition} noteId={popoverData.noteId} /> : <></>}
    </div>
  )
}

export default NoteColumnsContainer
