import styles from "@/styles/home/meetingAssistantSlidePanel.module.css";
import slidePanelStyles from "@/styles/home/slidePanel.module.css";
import checkboxStyles from "@/styles/checkbox.module.css";
import datePickerStyles from "@/styles/datePicker.module.css";
import timePickerStyles from "@/styles/timePicker.module.css";
import dropdownListStyles from "@/styles/dropdownList.module.css";
import buttonStyles from "@/styles/button.module.css";
import paperStyles from "@/styles/paper.module.css";
import { useContext, useRef, useState } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import { ContactContext } from "@/context/contact-context";
import SlidePanel from "./SlidePanel";
import Checkbox from "../Checkbox";
import User from "./User";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import moment from "moment";
import DropdownList from "../DropdownList";
import Button from "../Button";
import { getAllPossibleMeetingDates } from "@/api/meetingAssistantAPI";
import { auth } from "@/config/firebase";
import LoadingSpinner from "../LoadingSpinner";
import Paper from "../Paper";
import { EventModalContext } from "@/context/event-modal-context";

export default function MeetingAssistantSlidePanel() {
  const { panel, handleOpenSlidePanel } = useContext(SlidePanelContext);
  const { eventModal, handleEventModalAction } = useContext(EventModalContext);
  const { contacts } = useContext(ContactContext);
  const durationRef = useRef("1h");
  const [numberOfVisibleFreeSlots, setNumberOfVisibleFreeSlots] = useState(10);
  const [numberOfVisibleMeetingDates, setNumberOfVisibleMeetingDates] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [allPossibleMeetingDates, setAllPossibleMeetingDates] = useState(null);
  const [chosenContacts, setChosenContacts] = useState([auth.currentUser.uid]);
  const [chosenFreeSlot, setChosenFreeSlot] = useState(null);
  const [searchFromDate, setSearchFromDate] = useState(moment().format("Y-MM-DD"));
  const [searchFromTime, setSearchFromTime] = useState("08:00");
  const [searchToDate, setSearchToDate] = useState(moment().add(14, "days").format("Y-MM-DD"));
  const [searchToTime, setSearchToTime] = useState("20:00");

  async function handleButtonClick() {
    setChosenFreeSlot(null);
    setIsLoading(true);
    const possibleMeetingDates = await getAllPossibleMeetingDates(
      chosenContacts,
      moment(searchFromDate, "Y-MM-DD").unix(),
      moment(searchToDate, "Y-MM-DD").add(1, "days").unix(),
      searchFromTime,
      searchToTime,
      durationRef.current.textContent
    );
    setAllPossibleMeetingDates(possibleMeetingDates);
    setIsLoading(false);
  }

  function handleShowMoreFreeSlots() {
    setNumberOfVisibleFreeSlots((prevNumberOfVisibleFreeSlots) => prevNumberOfVisibleFreeSlots + 10);
  }

  function handleShowMoreMeetingDates() {
    setNumberOfVisibleMeetingDates((prevNumberOfVisibleMeetingDates) => prevNumberOfVisibleMeetingDates + 10);
  }

  function handleCheckboxChange(event) {
    const value = event.target.id;
    const isChecked = event.target.checked;
    if (isChecked) {
      setChosenContacts((prevChosenContacts) => {
        return [...prevChosenContacts, value.slice(0, -24)];
      });
    } else {
      setChosenContacts((prevChosenContacts) => {
        return prevChosenContacts.filter((chosenContact) => {
          return chosenContact !== value.slice(0, -24);
        });
      });
    }
  }

  return (
    <SlidePanel
      title={"Meeting assistant"}
      className={slidePanelStyles.extensionSlidePanel}
      isSlidePanelOpen={panel.openSlidePanel === "meetingAssistant"}
    >
      <div className={styles.contactsContainer}>
        {contacts.length > 0 ? (
          contacts.map((contact) => {
            return (
              <Checkbox
                key={contact.uid}
                checkboxId={contact.uid + "MeetingAssistant"}
                name="contacts"
                className={checkboxStyles.meetingAssistant}
                value={
                  <User name={contact.name} surname={contact.surname} email={contact.email} actionButton={<></>} />
                }
                onChange={handleCheckboxChange}
              />
            );
          })
        ) : (
          <p className={styles.text}>No contacts</p>
        )}
      </div>
      <div className={styles.searchDateTimeContainer}>
        <DatePicker
          isCalendarIndicatorVisible={true}
          onChange={(e) => {
            setSearchFromDate(e.target.value);
          }}
          className={datePickerStyles.meetingAssistant}
          value={searchFromDate}
        >
          From date
        </DatePicker>
        <DatePicker
          isCalendarIndicatorVisible={true}
          onChange={(e) => {
            setSearchToDate(e.target.value);
          }}
          className={datePickerStyles.meetingAssistant}
          value={searchToDate}
        >
          To date
        </DatePicker>
        <TimePicker
          isCalendarIndicatorVisible={true}
          onChange={(e) => {
            setSearchFromTime(e.target.value);
          }}
          className={timePickerStyles.meetingAssistant}
          value={searchFromTime}
        >
          From time
        </TimePicker>
        <TimePicker
          isCalendarIndicatorVisible={true}
          onChange={(e) => {
            setSearchToTime(e.target.value);
          }}
          className={timePickerStyles.meetingAssistant}
          value={searchToTime}
        >
          To time
        </TimePicker>
      </div>
      <div className={styles.meetingDurationContainer}>
        <p className={styles.meetingDurationText}>Meeting duration:</p>
        <DropdownList
          dropdownListRef={durationRef}
          list={["0.5h", "1h", "2h", "3h", "4h", "5h"]}
          initialValue={"1h"}
          className={dropdownListStyles.meetingAssistant}
        />
      </div>
      <Button onClick={handleButtonClick} className={buttonStyles.meetingAssistant}>
        Find available dates
      </Button>

      <div className={styles.proposedDatesContainer}>
        {isLoading ? (
          <LoadingSpinner />
        ) : allPossibleMeetingDates ? (
          allPossibleMeetingDates.length > 0 ? (
            <>
              <p className={styles.title}>All free slots:</p>
              <div className={styles.proposedDatesContainer}>
                {allPossibleMeetingDates.slice(0, numberOfVisibleFreeSlots).map((freeSlot, index) => {
                  return (
                    <Paper
                      className={paperStyles.meetingAssistantSlidePanel}
                      key={freeSlot.start.unix()}
                      onClick={() => {
                        setChosenFreeSlot(index);
                      }}
                    >
                      {`${freeSlot.start.format("DD.MM.YYYY HH:mm")} - ${freeSlot.end.format("DD.MM.YYYY HH:mm")}`}
                    </Paper>
                  );
                })}
                {numberOfVisibleFreeSlots < allPossibleMeetingDates.length ? (
                  <Paper className={paperStyles.meetingAssistantSlidePanel} onClick={handleShowMoreFreeSlots}>
                    Show more...
                  </Paper>
                ) : null}
              </div>
              {chosenFreeSlot !== null ? (
                <>
                  <p className={styles.title}>Proposed meeting dates:</p>
                  <div className={styles.proposedDatesContainer}>
                    {allPossibleMeetingDates[chosenFreeSlot].possibleMeetingDates
                      .slice(0, numberOfVisibleMeetingDates)
                      .map((possibleMeetingDate) => {
                        return (
                          <Paper
                            key={possibleMeetingDate.start.unix()}
                            className={paperStyles.meetingAssistantSlidePanel}
                            onClick={() => {
                              handleOpenSlidePanel({ type: "CLOSE_PANEL" });
                              if (eventModal.isOpen) {
                                handleEventModalAction({ type: "CLOSE_MODAL" });
                              } else {
                                handleEventModalAction({
                                  type: "OPEN_ADD_EVENT_MODAL_WITH_PROPOSED_DATE",
                                  proposedDate: {
                                    start: possibleMeetingDate.start.clone(),
                                    end: possibleMeetingDate.end.clone(),
                                  },
                                  participants: chosenContacts.filter(
                                    (participant) => participant !== auth.currentUser.uid
                                  ),
                                });
                              }
                            }}
                          >
                            {`${possibleMeetingDate.start.format(
                              "DD-MM-YYYY HH:mm"
                            )} - ${possibleMeetingDate.end.format("DD-MM-YYYY HH:mm")}`}
                          </Paper>
                        );
                      })}
                    {numberOfVisibleMeetingDates <
                    allPossibleMeetingDates[chosenFreeSlot].possibleMeetingDates.length ? (
                      <Paper className={paperStyles.meetingAssistantSlidePanel} onClick={handleShowMoreMeetingDates}>
                        Show more...
                      </Paper>
                    ) : null}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <p className={styles.text}>No free slots</p>
          )
        ) : null}
      </div>
    </SlidePanel>
  );
}
