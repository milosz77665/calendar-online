import styles from "@/styles/home/homeLayout.module.css";
import Menu from "@/components/home/Menu";
import Main from "@/components/home/Main";
import { CalendarNameContextProvider } from "@/context/calendar-name-context";
import { ErrorContextProvider } from "@/context/error-context";
import { ExtensionContextProvider } from "@/context/extension-context";
import { EventModalContextProvider } from "@/context/event-modal-context";
import { CalendarContextProvider } from "@/context/calendar-context";
import { CalendarColorContextProvider } from "@/context/calendar-color-context";
import { ConfirmContextProvider } from "@/context/confirm-context";
import { ContactContextProvider } from "@/context/contact-context";
import { ShareToUserModalContextProvider } from "@/context/share-to-user-modal-context";
import { SharingContextProvider } from "@/context/sharing-context";
import { NoteContextProvider } from "@/context/note-context";
import { ToDoListContextProvider } from "@/context/toDoList-context";

export default function HomeLayout({ children }) {
  return (
    <ExtensionContextProvider>
      <ErrorContextProvider>
        <ContactContextProvider>
          <SharingContextProvider>
            <ShareToUserModalContextProvider>
              <ConfirmContextProvider>
                <NoteContextProvider>
                  <ToDoListContextProvider>
                    <CalendarNameContextProvider>
                      <CalendarContextProvider>
                        <CalendarColorContextProvider>
                          <EventModalContextProvider>
                            <div className={styles.container}>
                              <Main>{children}</Main>
                              <Menu />
                            </div>
                          </EventModalContextProvider>
                        </CalendarColorContextProvider>
                      </CalendarContextProvider>
                    </CalendarNameContextProvider>
                  </ToDoListContextProvider>
                </NoteContextProvider>
              </ConfirmContextProvider>
            </ShareToUserModalContextProvider>
          </SharingContextProvider>
        </ContactContextProvider>
      </ErrorContextProvider>
    </ExtensionContextProvider>
  );
}
