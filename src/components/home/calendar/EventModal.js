"use-client";
import styles from "@/styles/home/calendar/eventModal.module.css";
import checkboxStyles from "@/styles/checkbox.module.css";
import buttonStyles from "@/styles/button.module.css";
import modalStyles from "@/styles/modal.module.css";
import inputStyles from "@/styles/input.module.css";
import dropdownListStyles from "@/styles/dropdownList.module.css";
import datePickerStyles from "@/styles/datePicker.module.css";
import timePickerStyles from "@/styles/timePicker.module.css";
import textAreaStyles from "@/styles/textArea.module.css";
import userStyles from "@/styles/home/user.module.css";
import validationMessageStyles from "@/styles/validationMessage.module.css";
import { useContext, useRef, useState } from "react";
import moment from "moment";
import { auth } from "@/config/firebase";
import { CalendarColorContext } from "@/context/calendar-color-context";
import { CalendarNameContext } from "@/context/calendar-name-context";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import DropdownList from "@/components/DropdownList";
import TextArea from "@/components/TextArea";
import ValidationMessage from "@/components/ValidationMessage";
import { EventModalContext } from "@/context/event-modal-context";
import { translateRruleObject } from "@/api/calendarAPI";
import { ShareToUserModalContext } from "@/context/share-to-user-modal-context";
import { ContactContext } from "@/context/contact-context";
import User from "../User";

const recurOptions = ["Doesn't recur", "Daily", "Weekly", "Monthly", "Annually", "Every weekday"];

export default function EventModal() {
  const { calendarNames } = useContext(CalendarNameContext);
  const { handleShareToUserModalAction } = useContext(ShareToUserModalContext);
  const { allCalendarsColors } = useContext(CalendarColorContext);
  const { saveEvent, editEvent, eventModal, handleEventModalAction } = useContext(EventModalContext);
  const [eventModalErrorMess, setEventModalErrorMess] = useState("");
  const { contacts } = useContext(ContactContext);
  const [participants, setParticipants] = useState(eventModal.participants || []);

  let startTimeOldEvent;
  let endTimeOldEvent;
  let startDateOldEvent;
  let endDateOldEvent;
  if (eventModal.proposedDate) {
    startTimeOldEvent = eventModal.proposedDate.start.format("HH:mm");
    endTimeOldEvent = eventModal.proposedDate.end.format("HH:mm");
    startDateOldEvent = eventModal.proposedDate.start.format("Y-MM-DD");
    endDateOldEvent = eventModal.proposedDate.end.format("Y-MM-DD");
  } else if (eventModal.date) {
    startDateOldEvent = eventModal.date.start.format("Y-MM-DD");
    endDateOldEvent = eventModal.date.end.format("Y-MM-DD");
  } else {
    startTimeOldEvent = eventModal.oldEvent?.dtstart.seconds
      ? moment.unix(eventModal.oldEvent?.dtstart.seconds).format("HH:mm")
      : null;
    endTimeOldEvent = eventModal.oldEvent?.dtend.seconds
      ? moment.unix(eventModal.oldEvent?.dtend.seconds).format("HH:mm")
      : null;
    startDateOldEvent = eventModal.oldEvent?.dtstart.seconds
      ? moment.unix(eventModal.oldEvent?.dtstart.seconds).format("Y-MM-DD")
      : null;
    endDateOldEvent = eventModal.oldEvent?.dtend.seconds
      ? startTimeOldEvent === "00:00" && endTimeOldEvent === "00:00"
        ? moment.unix(eventModal.oldEvent?.dtend.seconds).subtract(1, "day").format("Y-MM-DD")
        : moment.unix(eventModal.oldEvent?.dtend.seconds).format("Y-MM-DD")
      : null;
  }
  const recurOptionOldEvent =
    eventModal.oldEvent?.rrule && translateRruleObject(eventModal.oldEvent.rrule, eventModal.oldEvent.dtstart);
  const untilOldEvent =
    eventModal.oldEvent?.rrule.until && moment.unix(eventModal.oldEvent.rrule.until.seconds).format("Y-MM-DD");

  const initialStartDate =
    23 <= moment().hours() && moment().hours() < 24
      ? moment().add(1, "days").format("Y-MM-DD")
      : moment().format("Y-MM-DD");
  const initialEndDate =
    22 <= moment().hours() && moment().hours() < 24
      ? moment().add(1, "days").format("Y-MM-DD")
      : moment().format("Y-MM-DD");
  const initialStartTime = `${moment().add(1, "hours").format("HH")}:00`;
  const initialEndTime = `${moment().add(2, "hours").format("HH")}:00`;
  const [startDate, setStartDate] = useState(startDateOldEvent || initialStartDate);
  const [endDate, setEndDate] = useState(endDateOldEvent || initialEndDate);
  const [untilDate, setUntilDate] = useState(untilOldEvent || "");
  const [startTime, setStartTime] = useState(startTimeOldEvent || initialStartTime);
  const [endTime, setEndTime] = useState(endTimeOldEvent || initialEndTime);

  const [isAllDayEvent, setIsAllDayEvent] = useState(startTimeOldEvent === "00:00" && endTimeOldEvent === "00:00");
  const [chosenRecurOption, setChosenRecurOption] = useState(recurOptionOldEvent || recurOptions[0]);
  const calendarRef = useRef();
  const titleRef = useRef();
  const locationRef = useRef();
  const linkRef = useRef();
  const descriptionRef = useRef();

  const gridContainerClasses = isAllDayEvent
    ? `${styles.gridContainer} ${styles.gridContainerAllDay}`
    : styles.gridContainer;

  function getDaysDiff(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), "days");
  }

  function getMinutesDiff(startTime, endTime) {
    return moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm"), "minutes");
  }

  function onStartDateChange(e) {
    if (getDaysDiff(startDate, endDate) < 2) {
      const startDateDiff = getDaysDiff(e.target.value, startDate);
      setEndDate(moment(endDate).subtract(startDateDiff, "days").format("Y-MM-DD"));
    }
    setStartDate(e.target.value);
  }

  function onStartTimeChange(e) {
    if (getDaysDiff(startDate, endDate) < 1) {
      if (getMinutesDiff(startTime, endTime) < 120) {
        const startTimeDiff = getMinutesDiff(e.target.value, startTime);
        setEndTime(moment(endTime, "HH:mm").subtract(startTimeDiff, "minutes").format("HH:mm"));
      }
    }
    setStartTime(e.target.value);
  }

  function onSave() {
    if (titleRef.current.value) {
      if (startDate) {
        setEventModalErrorMess("");
        const summary = titleRef.current.value;
        const description = descriptionRef.current.value;
        const location = locationRef.current.value;
        const link = linkRef.current.value;
        const rrule = chosenRecurOption;
        const dtstamp = new Date();
        // Check if untilDate is defined if not set until to ""
        const until = untilDate ? new Date(untilDate) : "";
        // Check if startTime is defined if not set eventStartTime to "00:00"
        const eventStartTime = startTime || "00:00";
        // Check if endTime is defined if not check if endDate is defined and if it is set eventEndTime to "00:00" otherwise set it to eventStartTime
        const eventEndTime = endTime ? endTime : endDate ? "00:00" : eventStartTime;
        // Check if endDate is defined if not set eventEndDate to startDate
        const eventEndDate = endDate || startDate;
        // Check if isAllDayEvent is true if it is true set time to "00:00"
        const dtstart = isAllDayEvent
          ? new Date(createDate(startDate, "00:00"))
          : new Date(createDate(startDate, eventStartTime));
        const dtend = isAllDayEvent
          ? new Date(createDate(endDate, "00:00"))
          : new Date(createDate(eventEndDate, eventEndTime));

        if (dtstart <= dtend) {
          if (isAllDayEvent) {
            dtend.setDate(dtend.getDate() + 1);
          }

          const event = {
            description,
            dtend,
            dtstart,
            dtstamp,
            location,
            link,
            rrule,
            until,
            summary,
          };

          eventModal.oldEvent
            ? editEvent(auth.currentUser.uid, calendarRef.current.textContent, event)
            : saveEvent(auth.currentUser.uid, calendarRef.current.textContent, event, participants);
        } else {
          setEventModalErrorMess("Event must start before it ends");
        }
      } else {
        setEventModalErrorMess("Start date must be provided");
      }
    } else {
      setEventModalErrorMess("Title must be provided");
    }
  }

  function createDate(dateStr, timeStr) {
    const date = new Date(dateStr);
    const [hourStr, minuteStr] = timeStr.split(":");
    date.setHours(parseInt(hourStr));
    date.setMinutes(parseInt(minuteStr));
    return date;
  }

  function handleShareEvent(calendarName, dtstamp, eventName) {
    handleShareToUserModalAction({ type: "OPEN_SHARE_EVENT_TO_USER_MODAL", calendarName, dtstamp, eventName });
  }

  function handleCheckboxChange(event) {
    const value = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setParticipants((prevParticipants) => {
        return [...prevParticipants, value.slice(0, -18)];
      });
    } else {
      setParticipants((prevParticipants) => {
        return prevParticipants.filter((participant) => {
          return participant !== value.slice(0, -18);
        });
      });
    }
  }

  return (
    <Modal className={modalStyles.eventModal}>
      <Button
        className={buttonStyles.closeButton}
        onClick={() => {
          handleEventModalAction({ type: "CLOSE_MODAL" });
        }}
      >
        X
      </Button>
      <p className={styles.title}>{eventModal.oldEvent ? "Event details" : "Add event"}</p>
      <form className={styles.form}>
        {eventModalErrorMess && (
          <ValidationMessage className={validationMessageStyles.eventModal}>{eventModalErrorMess}</ValidationMessage>
        )}
        <Input
          inputRef={titleRef}
          className={inputStyles.eventModal}
          inputType="text"
          initialValue={eventModal.oldEvent?.summary}
        >
          Title
        </Input>
        <div className={gridContainerClasses}>
          <DropdownList
            dropdownListRef={calendarRef}
            list={calendarNames}
            initialValue={eventModal.oldCalendarName}
            colors={allCalendarsColors}
            className={dropdownListStyles.eventModal}
          />
          <Checkbox
            name="allDayEvent"
            value="All day event"
            className={checkboxStyles.eventModal}
            checked={isAllDayEvent}
            onChange={() => {
              setIsAllDayEvent((allDayEvent) => !allDayEvent);
            }}
          />
          <DatePicker
            isCalendarIndicatorVisible={true}
            onChange={onStartDateChange}
            className={datePickerStyles.eventModal}
            value={startDate}
          >
            Start date
          </DatePicker>
          {isAllDayEvent ? null : (
            <TimePicker
              isCalendarIndicatorVisible={true}
              onChange={onStartTimeChange}
              className={timePickerStyles.eventModal}
              value={startTime}
            >
              Start time
            </TimePicker>
          )}
          <DatePicker
            isCalendarIndicatorVisible={true}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            className={datePickerStyles.eventModal}
            value={endDate}
          >
            End date
          </DatePicker>
          {isAllDayEvent ? null : (
            <TimePicker
              isCalendarIndicatorVisible={true}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
              className={timePickerStyles.eventModal}
              value={endTime}
            >
              End time
            </TimePicker>
          )}
          <Input
            inputRef={linkRef}
            inputType="text"
            className={`${inputStyles.eventModal} ${inputStyles.link}`}
            initialValue={eventModal.oldEvent?.link}
            copy={true}
          >
            Meeting link
          </Input>
          <Input
            inputRef={locationRef}
            inputType="text"
            className={`${inputStyles.eventModal} ${
              !recurOptionOldEvent && eventModal.oldEvent?.rrule ? inputStyles.location : null
            }`}
            initialValue={eventModal.oldEvent?.location}
          >
            Location
          </Input>
          {!recurOptionOldEvent && eventModal.oldEvent?.rrule ? null : (
            <DropdownList
              list={recurOptions}
              className={dropdownListStyles.eventModal}
              initialValue={recurOptionOldEvent}
              onChange={(recurOption) => {
                setChosenRecurOption(recurOption);
              }}
            />
          )}
        </div>
        {chosenRecurOption !== recurOptions[0] && (
          <DatePicker
            isCalendarIndicatorVisible={true}
            onChange={(e) => {
              setUntilDate(e.target.value);
            }}
            className={datePickerStyles.eventModal}
            value={untilDate}
          >
            Recurs until
          </DatePicker>
        )}
        <TextArea
          textAreaRef={descriptionRef}
          initialValue={eventModal.oldEvent?.description}
          placeholder="Description"
          className={textAreaStyles.eventModal}
        />
        {!eventModal.oldEvent && (
          <div className={styles.participantsContainer}>
            {contacts.map((contact) => {
              return (
                <Checkbox
                  key={contact.uid}
                  checkboxId={contact.uid + "EventModal"}
                  name="contacts"
                  className={checkboxStyles.eventModal}
                  checked={participants.includes(contact.uid)}
                  value={
                    <User
                      className={userStyles.eventModal}
                      name={contact.name}
                      surname={contact.surname}
                      email={contact.email}
                      actionButton={<></>}
                    />
                  }
                  onChange={handleCheckboxChange}
                />
              );
            })}
          </div>
        )}
      </form>
      <div className={styles.buttonSection}>
        <Button className={buttonStyles.saveButton} onClick={onSave}>
          Save
        </Button>
        {eventModal.oldEvent && (
          <Button
            className={buttonStyles.shareButton}
            onClick={() => {
              handleShareEvent(
                eventModal.oldCalendarName,
                eventModal.oldEvent.dtstamp.seconds,
                eventModal.oldEvent.summary
              );
            }}
          >
            Share
          </Button>
        )}
        <Button
          className={buttonStyles.cancelButton}
          onClick={() => {
            handleEventModalAction({ type: "CLOSE_MODAL" });
          }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
