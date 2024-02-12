import styles from "@/styles/home/pomodoroSlidePanel.module.css";
import buttonStyles from "@/styles/button.module.css";
import { useContext, useEffect, useState } from "react";
import SlidePanel from "./SlidePanel";
import slidePanelStyles from "@/styles/home/slidePanel.module.css";
import { SlidePanelContext } from "@/context/slide-panel-context";
import Button from "../Button";
import PomodoroTimer from "./PomodoroTimer";
import NumberPicker from "../NumberPicker";

export default function PomodoroSlidePanel() {
  const [audio] = useState(new Audio("/audio/alarm_sound.mp3"));
  const initialFocusTime = 25 * 60;
  const initialBreakTime = 5 * 60;
  const { panel } = useContext(SlidePanelContext);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [time, setTime] = useState({
    currentTime: initialFocusTime,
    totalTime: initialFocusTime,
    focusTime: initialFocusTime,
    breakTime: initialBreakTime,
  });
  const [isFocus, setIsFocus] = useState(true);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  function startTimer() {
    audio.pause();
    setIsTimerRunning(true);
    if (!intervalId) {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.currentTime === 0) {
            audio.currentTime = 0;
            audio.play();
            clearInterval(interval);
            setIntervalId(null);
            setIsTimerRunning(false);
            setIsFocus((prevIsFocus) => !prevIsFocus);
            return isFocus
              ? { ...prevTime, currentTime: prevTime.breakTime, totalTime: prevTime.breakTime }
              : { ...prevTime, currentTime: prevTime.focusTime, totalTime: prevTime.focusTime };
          }
          return { ...prevTime, currentTime: prevTime.currentTime - 1 };
        });
      }, 1000);
      setIntervalId(interval);
    }
  }

  function stopTimer() {
    setIsTimerRunning(false);
    clearInterval(intervalId);
    setIntervalId(null);
  }

  function resetTimer() {
    setTime((prevTime) => {
      return { ...prevTime, currentTime: prevTime.totalTime };
    });
  }

  function handleFocusTimeChange(event) {
    const chosenTime = event.target.value * 60;
    setTime((prevTime) => {
      return {
        ...prevTime,
        currentTime: isFocus ? chosenTime : prevTime.currentTime,
        totalTime: isFocus ? chosenTime : prevTime.totalTime,
        focusTime: chosenTime,
      };
    });
  }

  function handleBreakTimeChange(event) {
    const chosenTime = event.target.value * 60;
    setTime((prevTime) => {
      return {
        ...prevTime,
        currentTime: isFocus ? prevTime.currentTime : chosenTime,
        totalTime: isFocus ? prevTime.totalTime : chosenTime,
        breakTime: chosenTime,
      };
    });
  }

  return (
    <SlidePanel
      title={"Pomodoro timer"}
      className={slidePanelStyles.extensionSlidePanel}
      isSlidePanelOpen={panel.openSlidePanel === "pomodoro"}
    >
      <div className={styles.chooseTimeSection}>
        <div className={styles.chooseTimeContainer}>
          <p className={styles.radioSectionLabel}>Focus time</p>
          <form className={styles.radioSection}>
            <NumberPicker
              min={1}
              max={60}
              initialValue={25}
              onChange={handleFocusTimeChange}
              disabled={isTimerRunning}
            />
          </form>
        </div>
        <div className={styles.chooseTimeContainer}>
          <p className={styles.radioSectionLabel}>Break time</p>
          <form className={styles.radioSection}>
            <NumberPicker
              min={1}
              max={60}
              initialValue={5}
              onChange={handleBreakTimeChange}
              disabled={isTimerRunning}
            />
          </form>
        </div>
      </div>
      <PomodoroTimer time={time} isFocus={isFocus} />
      {isFocus ? (
        <p className={styles.infoText}>Time to focus!</p>
      ) : (
        <p className={styles.infoText}>Time to take a break!</p>
      )}
      <div className={styles.buttonContainer}>
        {!intervalId ? (
          <Button className={buttonStyles.pomodoroSlidePanelButton} onClick={startTimer}>
            Start
          </Button>
        ) : (
          <Button className={buttonStyles.pomodoroSlidePanelButton} onClick={stopTimer}>
            Stop
          </Button>
        )}
        <Button className={buttonStyles.pomodoroSlidePanelButton} onClick={resetTimer}>
          Reset
        </Button>
      </div>
    </SlidePanel>
  );
}
