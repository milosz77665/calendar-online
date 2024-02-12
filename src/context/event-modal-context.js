"use client";
import { addEvent, addEventAndSendToParticipants, updateEvent } from "@/api/calendarAPI";
import EventModal from "@/components/home/calendar/EventModal";
import { createContext, useReducer } from "react";

export const EventModalContext = createContext();
const initialState = {
  isOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "OPEN_EDIT_EVENT_MODAL":
      return {
        isOpen: true,
        oldEvent: action.oldEvent,
        oldCalendarName: action.calendarName,
      };
    case "OPEN_ADD_EVENT_MODAL":
      return {
        isOpen: true,
      };
    case "OPEN_ADD_EVENT_MODAL_WITH_PROPOSED_DATE":
      return {
        isOpen: true,
        proposedDate: action.proposedDate,
        participants: action.participants,
      };
    case "OPEN_ADD_EVENT_MODAL_WITH_DATE":
      return {
        isOpen: true,
        date: action.date,
      };
    case "CLOSE_MODAL":
      return {
        isOpen: false,
      };
    default:
      return state;
  }
}

export function EventModalContextProvider({ children }) {
  const [eventModal, handleEventModalAction] = useReducer(reducer, initialState);

  async function saveEvent(userId, calendarName, event, participants) {
    if (participants.length > 0) {
      await addEventAndSendToParticipants(userId, calendarName, event, participants);
    } else {
      await addEvent(userId, calendarName, event);
    }
    handleEventModalAction({ type: "CLOSE_MODAL" });
  }

  async function editEvent(userId, newCalendarName, newEvent) {
    await updateEvent(userId, eventModal.oldCalendarName, newCalendarName, eventModal.oldEvent, newEvent);
    handleEventModalAction({ type: "CLOSE_MODAL" });
  }

  return (
    <EventModalContext.Provider
      value={{
        saveEvent,
        editEvent,
        eventModal,
        handleEventModalAction,
      }}
    >
      {children}
      {eventModal.isOpen && <EventModal />}
    </EventModalContext.Provider>
  );
}
