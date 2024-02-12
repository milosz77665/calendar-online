import Sidebar from "./Sidebar";
import SettingsSlidePanel from "./SettingsSlidePanel";
import { SlidePanelContextProvider } from "@/context/slide-panel-context";
import ContactsSlidePanel from "./ContactsSlidePanel";
import ExtensionsSlidePanel from "./ExtensionsSlidePanel";

export default function Menu() {
  return (
    <SlidePanelContextProvider>
      <Sidebar />
      <SettingsSlidePanel />
      <ContactsSlidePanel />
      <ExtensionsSlidePanel />
    </SlidePanelContextProvider>
  );
}
