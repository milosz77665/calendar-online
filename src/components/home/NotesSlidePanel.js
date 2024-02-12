"use client";
import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import slidePanelStyles from "@/styles/home/slidePanel.module.css";
import { useContext, useState } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import SlidePanel from "./SlidePanel";
import AddNote from "./notesSlidePanelElements/AddNote";
import NoteBackButton from "./notesSlidePanelElements/NoteBackButton";
import Note from "./notesSlidePanelElements/Note";
import { NoteContext } from "@/context/note-context";

export default function NotesSlidePanel() {
  const { panel } = useContext(SlidePanelContext);
  const { notes } = useContext(NoteContext);
  const [chosenNote, setChosenNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState(null);
  const [noteContent, setNoteContent] = useState(null);

  function handleNoteClick(noteId, title, content) {
    setChosenNote({ id: noteId, title, content });
    setNoteTitle(title);
    setNoteContent(content);
  }

  function handleNoteTitleChange(event) {
    setNoteTitle(event.target.value);
  }

  function handleNoteContentChange(event) {
    setNoteContent(event.target.value);
  }

  return (
    <SlidePanel
      title={"Notes"}
      className={slidePanelStyles.extensionSlidePanel}
      isSlidePanelOpen={panel.openSlidePanel === "notes"}
    >
      {!chosenNote && <AddNote />}
      <div className={extensionsSlidePanelStyles.documentContainer}>
        <div className={extensionsSlidePanelStyles.notesContainer}>
          {notes.length !== 0 ? (
            notes.map((note) => {
              if (!chosenNote) {
                return (
                  <Note
                    id={note.id}
                    key={note.id}
                    title={note.title}
                    content={note.content}
                    setChosenNote={setChosenNote}
                    handleNoteClick={handleNoteClick}
                  />
                );
              } else {
                if (chosenNote.id === note.id) {
                  return (
                    <Note
                      id={note.id}
                      key={note.id}
                      title={noteTitle}
                      content={noteContent}
                      chosenNote={chosenNote}
                      setChosenNote={setChosenNote}
                      handleNoteTitleChange={handleNoteTitleChange}
                      handleNoteContentChange={handleNoteContentChange}
                      isEditable={true}
                    />
                  );
                }
              }
            })
          ) : (
            <p className={extensionsSlidePanelStyles.text}>No notes</p>
          )}
        </div>
        {chosenNote && (
          <NoteBackButton
            title={noteTitle}
            content={noteContent}
            chosenNote={chosenNote}
            setChosenNote={setChosenNote}
          />
        )}
      </div>
    </SlidePanel>
  );
}
