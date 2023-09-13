/* eslint-disable react/prop-types */
import "./Footer.scss"

import LinkedNote from "./LinkedNote"

const Footer = ({ note, showPopoverForNote, hidePopover }) => {

  const elem = (
    <div className="Footer">
      <h3 className="BacklinksHeading">Links to this note</h3>
      <div className="BacklinksContainer">
        {note?.referenced_by?.map((originNote) => (
          <LinkedNote key={originNote} noteId={originNote} showPopoverForNote={showPopoverForNote} hidePopover={hidePopover} />
        ))}
      </div>
    </div>
  )

  return note?.referenced_by?.length > 0 ? elem : <></>
}

export default Footer
