/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useBase } from "../utils";

import "./NoteLink.scss";

const isLinkRemote = (href) =>
    new URL(document.baseURI).origin !== new URL(href, document.baseURI).origin;

const NoteLink = ({
    children,
    href,
    openNoteId,
    noteIdsStack,
    scrollToNote,
    showPopoverForNote,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    "data-footnote-ref": dataFootnoteRef,
    "data-footnote-backref": dataFootnoteBackref,
    className,
}) => {
    const navigate = useNavigate();

    const [isRemote, setIsRemote] = useState(false);
    const [isAnchor, setIsAnchor] = useState(false);
    const [isTargetOpen, setIsTargetOpen] = useState(false);
    const [targetNoteId, setTargetNoteId] = useState("");
    const setSearchParams = useSearchParams()[1];

    const base = useBase();

    useEffect(() => {
        setIsRemote(isLinkRemote(href));
        setIsAnchor(href.startsWith("#"));
    }, [href]);

    useEffect(() => {
        setTargetNoteId(
            decodeURIComponent(
                href.slice(base.length === 1 ? 1 : base.length + 1)
            ).toLowerCase()
        );
    }, [href, base]);

    useEffect(() => {
        setIsTargetOpen(noteIdsStack.includes(targetNoteId));
    }, [noteIdsStack, targetNoteId]);

    const extractPathAndAddToStack = useCallback(
        (mouseEvent) => {
            if (isRemote || isAnchor) return;
            mouseEvent.preventDefault();
            const isSmallScreen = window.innerWidth < 800;
            if (isSmallScreen) {
                navigate(`/${encodeURIComponent(targetNoteId)}`);
                return;
            }
            if (isTargetOpen) {
                scrollToNote(targetNoteId);
            } else {
                const from = noteIdsStack.indexOf(openNoteId);
                setSearchParams({
                    stacked: [...noteIdsStack.slice(1, from + 1), targetNoteId],
                });
            }
        },
        [
            isRemote,
            isAnchor,
            isTargetOpen,
            navigate,
            targetNoteId,
            scrollToNote,
            noteIdsStack,
            openNoteId,
            setSearchParams,
        ]
    );

    const onMouseEnter = useCallback(
        (e) => {
            if (isRemote) return;
            showPopoverForNote({
                noteId: targetNoteId,
                elementPosition: e.target.getBoundingClientRect(),
            });
        },
        [isRemote, showPopoverForNote, targetNoteId]
    );

    const onMouseLeave = useCallback(() => {
        if (isRemote) return;
        showPopoverForNote();
    }, [isRemote, showPopoverForNote]);

    return (
        <a
            id={id}
            onClick={extractPathAndAddToStack}
            href={href}
            rel="noreferrer"
            onMouseEnter={onMouseEnter}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
            data-footnote-ref={dataFootnoteRef}
            data-footnote-backref={dataFootnoteBackref}
            onMouseLeave={onMouseLeave}
            className={
                "NoteLink " +
                (isTargetOpen ? "open " : "") +
                (isRemote ? "remote-link " : "") +
                className
            }
            target={isAnchor ? undefined : "_blank"}
        >
            {children}
        </a>
    );
};

export default NoteLink;
