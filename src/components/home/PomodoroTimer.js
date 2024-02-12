import styles from "@/styles/home/pomodoroTimer.module.css";
import moment from "moment";

export default function PomodoroTimer({ time, isFocus }) {
  function formatTime(seconds) {
    const duration = moment.duration(seconds, "seconds");
    return Math.floor(duration.asMinutes()) + ":" + moment.utc(duration.asMilliseconds()).format("ss");
  }

  return (
    <div
      className={styles.timer}
      style={{
        background: isFocus
          ? `radial-gradient(closest-side, var(--light-blue) 79%, transparent 80% 100%),
      conic-gradient(var(--dark-red) ${(time.currentTime / time.totalTime) * 100}%, var(--red) 0)`
          : `radial-gradient(closest-side, var(--light-blue) 79%, transparent 80% 100%),
      conic-gradient(var(--primary) ${(time.currentTime / time.totalTime) * 100}%, var(--secondary) 0)`,
      }}
    >
      <p className={styles.time}>{formatTime(time.currentTime)}</p>
    </div>
  );
}
