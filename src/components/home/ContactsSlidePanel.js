"use client";
import { useContext } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import SlidePanel from "./SlidePanel";
import Contacts from "./contactsSlidePanelElements/Contacts";
import IncomingInvitations from "./contactsSlidePanelElements/IncomingInvitations";
import AddContact from "./contactsSlidePanelElements/AddContact";
import IncomingCalendars from "./contactsSlidePanelElements/IncomingCalendars";
import IncomingEvents from "./contactsSlidePanelElements/IncomingEvents";

export default function ContactsSlidePanel() {
  const { panel } = useContext(SlidePanelContext);

  return (
    <SlidePanel title={"Contacts"} isSlidePanelOpen={panel.openSlidePanel === "contacts"}>
      <Contacts />
      <AddContact />
      <IncomingInvitations />
      <IncomingCalendars />
      <IncomingEvents />
    </SlidePanel>
  );
}
