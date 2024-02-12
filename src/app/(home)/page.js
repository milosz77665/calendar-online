import { VisibleCalendarContextProvider } from "@/context/visible-calendar-context";
import BookmarkCalendars from "@/components/home/calendar/BookmarkCalendars";
import Calendar from "@/components/home/calendar/Calendar";
import { EventModalContextProvider } from "@/context/event-modal-context";

export default function CalendarPage() {
  return (
    <EventModalContextProvider>
      <VisibleCalendarContextProvider>
        <BookmarkCalendars />
        <Calendar />
      </VisibleCalendarContextProvider>
    </EventModalContextProvider>
  );
}
