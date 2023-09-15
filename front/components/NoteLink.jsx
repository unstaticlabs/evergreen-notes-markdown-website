/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { useBase } from "../utils"

import "./NoteLink.scss"

const isLinkRemote = (href) =>
  (new URL(document.baseURI).origin !== new URL(href, document.baseURI).origin)

const NoteLink = ({ href, text, openNoteId, noteIdsStack, scrollToNote, showPopoverForNote }) => {

  const [isRemote, setIsRemote] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [targetNoteId, setTargetNoteId] = useState("");
  const setSearchParams = useSearchParams()[1]

  const base = useBase()

  useEffect(() => {
    setIsRemote(isLinkRemote(href))
  }, [href])

  useEffect(() => {
    setTargetNoteId(decodeURIComponent(href.slice(
      base.length === 1 ? 1 : base.length + 1
    )))
  }, [href, base])

  useEffect(() => {
    setIsTargetOpen(noteIdsStack.includes(targetNoteId))
  }, [noteIdsStack, targetNoteId])

  const extractPathAndAddToStack = useCallback((mouseEvent) => {
    if (isRemote) return
    mouseEvent.preventDefault()
    if (isTargetOpen) {
      scrollToNote(targetNoteId)
    } else {
      const from = noteIdsStack.indexOf(openNoteId);
      setSearchParams({
        stacked: [...noteIdsStack.slice(1, from + 1), targetNoteId],
      })
    }
  }, [isRemote, isTargetOpen, noteIdsStack, targetNoteId, openNoteId, scrollToNote, setSearchParams])

  const onMouseEnter = useCallback((e) => {
    console.log('on mouse Enter');
    if (isRemote) return
    showPopoverForNote({
      noteId: targetNoteId,
      elementPosition: e.target.getBoundingClientRect()
    })
  }, [isRemote, showPopoverForNote, targetNoteId])

  const onMouseLeave = useCallback(() => {
    console.log('on mouse Leave');
    if (isRemote) return
    showPopoverForNote()
  }, [isRemote, showPopoverForNote])

  return (
    <a
      onClick={extractPathAndAddToStack} href={href} rel="noreferrer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={"NoteLink " + (isTargetOpen ? 'open' : '')}
      target="_blank"
    >{text}</a>
  )

}

export default NoteLink
