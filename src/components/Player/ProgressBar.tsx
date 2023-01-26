import useAudioPlayer from "@/hooks/useAudioPlayer";
import { MouseEvent, useRef, useState } from "react";

const ProgressBar = () => {
  const {
    audio,
    currentTime = 0,
    duration = 0,
    setClickedTime,
  } = useAudioPlayer();

  const progress = useRef<HTMLProgressElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const percentage =
    currentTime && duration > 0 ? (currentTime / duration) * 100 : 0;
  const [thumbPosition, setThumbPosition] = useState<number | undefined>();

  const getClickedTime = (event: any) => {
    if (progress.current && duration) {
      const pageClickPosition = event.pageX;
      const barStart =
        progress.current.getBoundingClientRect().left + window.scrollX;
      const barWidth = progress.current.offsetWidth;
      const barClickPosition = pageClickPosition - barStart;
      const timePerPixel = duration / barWidth;

      return timePerPixel * barClickPosition;
    }

    return 0;
  };

  const onHold = (event: MouseEvent) => {
    if (!audio.current) return;
    let clickedTime = getClickedTime(event);

    const onMove = (event: any) => {
      clickedTime = getClickedTime(event);
      const percentage = (clickedTime / duration) * 100;
      setThumbPosition(percentage < 100 ? percentage : 100);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", () => {
      setThumbPosition(undefined);
      setClickedTime(clickedTime);
      document.removeEventListener("mousemove", onMove);
    });
  };

  return (
    <div
      className="bar"
      style={{
        position: "relative",
        display: "flex",
        margin: "10px",
        padding: "10px 0",
        width: "max-content",
        height: "12px",
        alignItems: "center",
      }}
      onMouseDown={onHold}
    >
      <progress
        max={duration}
        value={currentTime}
        className="test"
        ref={progress}
      />
      <button
        ref={thumb}
        style={{
          background: "none",
          border: 0,
          position: "absolute",
          left: `${thumbPosition ?? percentage}%`,
          top: "50%",
          transform: "translate3d(-6px,-42%,0)",
          outline: "none",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          width={14}
        >
          <circle cx="50%" cy="50%" r="50%" />
        </svg>
      </button>
    </div>
  );
};

export default ProgressBar;
