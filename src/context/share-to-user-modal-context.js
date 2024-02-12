"use client";
import { shareCalendar, shareEvent } from "@/api/sharingAPI";
import ShareToUserModal from "@/components/home/ShareToUserModal";
import { createContext, useReducer } from "react";

export const ShareToUserModalContext = createContext();
const initialState = {
  isOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SHARE_CALENDAR_TO_USER_MODAL":
      return {
        isOpen: true,
        objectType: "calendar",
        objectToShare: action.calendarName,
      };
    case "OPEN_SHARE_EVENT_TO_USER_MODAL":
      return {
        isOpen: true,
        objectType: "event",
        calendarName: action.calendarName,
        dtstamp: action.dtstamp,
        objectToShare: action.eventName,
      };
    case "CLOSE_MODAL":
      return {
        isOpen: false,
      };
    default:
      return state;
  }
}

export function ShareToUserModalContextProvider({ children }) {
  const [shareToUserModal, handleShareToUserModalAction] = useReducer(reducer, initialState);

  async function shareCalendarToUser(userId, calendarName, targetUserId) {
    await shareCalendar(userId, calendarName, targetUserId);
    handleShareToUserModalAction({ type: "CLOSE_MODAL" });
  }

  async function shareEventToUser(userId, calendarName, eventName, dtstamp, targetUserId) {
    await shareEvent(userId, calendarName, eventName, dtstamp, targetUserId);
    handleShareToUserModalAction({ type: "CLOSE_MODAL" });
  }

  return (
    <ShareToUserModalContext.Provider
      value={{
        shareToUserModal,
        shareCalendarToUser,
        shareEventToUser,
        handleShareToUserModalAction,
      }}
    >
      {children}
      {shareToUserModal.isOpen && <ShareToUserModal />}
    </ShareToUserModalContext.Provider>
  );
}
