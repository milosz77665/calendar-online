"use client";
import { useContext } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import SlidePanel from "./SlidePanel";
import ImportCalendarSection from "./settingsSlidePanelElements/ImportCalendarSection";
import CalendarsSection from "./settingsSlidePanelElements/CalendarsSection";

export default function SettingsSlidePanel() {
  const { panel } = useContext(SlidePanelContext);

  return (
    <SlidePanel title={"Settings"} isSlidePanelOpen={panel.openSlidePanel === "settings"}>
      <ImportCalendarSection />
      <CalendarsSection />
    </SlidePanel>
  );
}
