import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import TrashIcon from "@/assets/icons/TrashIcon";
import { useContext } from "react";
import { ConfirmContext } from "@/context/confirm-context";
import { removeNote } from "@/api/noteAPI";
import { auth } from "@/config/firebase";

export default function Note({
  id,
  title,
  content,
  chosenNote,
  setChosenNote,
  handleNoteTitleChange = () => {},
  handleNoteContentChange = () => {},
  handleNoteClick = () => {},
  isEditable,
}) {
  const trashIconId = `trashIcon${id}`;
  const { showConfirm } = useContext(ConfirmContext);
  const noteCardClasses = isEditable
    ? `${extensionsSlidePanelStyles.noteCardOpen} ${extensionsSlidePanelStyles.noteCard}`
    : extensionsSlidePanelStyles.noteCard;

  async function handleDeleteNote() {
    setChosenNote(null);
    if (chosenNote) {
      await removeNote(auth.currentUser.uid, id, chosenNote.title, chosenNote.content);
    } else {
      await removeNote(auth.currentUser.uid, id, title, content);
    }
  }

  return (
    <div
      id={id}
      onClick={(event) => {
        if (event.target.id !== trashIconId) {
          handleNoteClick(id, title, content);
        }
      }}
      className={noteCardClasses}
    >
      <div className={extensionsSlidePanelStyles.noteUpperSectionContainer}>
        {isEditable ? (
          <input
            className={extensionsSlidePanelStyles.titleInput}
            value={title}
            onInput={handleNoteTitleChange}
            spellCheck={false}
          />
        ) : (
          <p className={extensionsSlidePanelStyles.noteTitle}>{title}</p>
        )}
        <TrashIcon
          id={trashIconId}
          size={20}
          color="var(--black)"
          onClick={() => {
            showConfirm(`Note "${title}" will be deleted`, {
              action: handleDeleteNote,
            });
          }}
          className={extensionsSlidePanelStyles.trashIcon}
          title="Delete"
        />
      </div>
      {isEditable ? (
        <textarea
          className={extensionsSlidePanelStyles.textarea}
          value={content}
          onInput={handleNoteContentChange}
          spellCheck={false}
        />
      ) : (
        <p className={extensionsSlidePanelStyles.noteContent}>{content}</p>
      )}
    </div>
  );
}
