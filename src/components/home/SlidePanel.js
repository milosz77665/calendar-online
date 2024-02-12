import RightArrowIcon from "@/assets/icons/RightArrowIcon";
import { SlidePanelContext } from "@/context/slide-panel-context";
import styles from "@/styles/home/slidePanel.module.css";
import { useContext, useEffect, useState } from "react";

export default function SlidePanel({ children, title, className, isSlidePanelOpen }) {
  const { handleOpenSlidePanel } = useContext(SlidePanelContext);
  const [wasSlidePanelOpen, setWasSlidePanelOpen] = useState(false);

  const customSlidePanelClasses = className ? `${className} ${styles.slidePanel}` : styles.slidePanel;
  const slidePanelClasses = isSlidePanelOpen
    ? `${customSlidePanelClasses} ${styles.slidePanelOpen}`
    : wasSlidePanelOpen
    ? `${customSlidePanelClasses} ${styles.slidePanelHidden}`
    : customSlidePanelClasses;

  useEffect(() => {
    if (!wasSlidePanelOpen && isSlidePanelOpen) {
      setWasSlidePanelOpen(true);
    }
  }, [isSlidePanelOpen]);

  return (
    <div className={slidePanelClasses}>
      <RightArrowIcon
        onClick={() => {
          handleOpenSlidePanel({ type: "CLOSE_PANEL" });
        }}
        color="var(--black)"
        size={25}
        className={styles.rightArrowIcon}
      />
      <h3 className={styles.title}>{title}</h3>
      {children}
    </div>
  );
}
