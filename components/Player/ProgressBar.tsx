import moment from "moment";
import "moment-duration-format";
import { MouseEvent, useEffect, useRef, useState } from "react";

import { usePlayer, usePlayerDispatch } from "@/context/Player";

export default function ProgressBar() {
  const { audioRef, currentTime = 0, duration = 0 } = usePlayer();
  const dispatch = usePlayerDispatch();

  const progress = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLButtonElement>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [thumbPosition, setThumbPosition] = useState<number | undefined>();

  useEffect(() => {
    setPercentage(
      currentTime && duration > 0 ? (currentTime / duration) * 100 : 0,
    );
  }, [currentTime, duration]);

  const getClickedTime = (event: any) => {
    if (progress.current && duration) {
      const pageClickPosition = event.pageX;
      const barStart =
        progress.current.getBoundingClientRect().left + window.scrollX;
      const barWidth = progress.current.offsetWidth;
      const barClickPosition = pageClickPosition - barStart;
      const timePerPixel = duration / barWidth;
      const result = timePerPixel * barClickPosition;

      if (result <= 0) return 0;
      if (result >= duration) return duration;
      return result;
    }

    return 0;
  };

  const onMouseDown = (event: MouseEvent) => {
    if (!audioRef.current || !duration) return;
    let clickedTime = getClickedTime(event);
    let percentage = (clickedTime / duration) * 100;
    setThumbPosition(percentage < 100 ? percentage : 100);

    const onMouseMove = (event: any) => {
      clickedTime = getClickedTime(event);
      percentage = (clickedTime / duration) * 100;
      setThumbPosition(percentage < 100 ? percentage : 100);
    };

    const onMouseUp = () => {
      setPercentage(percentage);
      setThumbPosition(undefined);
      dispatch({ type: "SET_CLICKED_TIME", payload: clickedTime });
      document.removeEventListener("mousemove", onMouseMove);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const formatTime = (time: number) => {
    return moment.duration(time, "seconds").format("mm:ss", { trim: false });
  };

  return (
    <div className="seekbar">
      <span className="bar__time">{formatTime(currentTime)}</span>
      <div className="bar">
        <div
          className="bar__progress"
          ref={progress}
          onMouseDown={onMouseDown}
          style={{
            background:
              thumbPosition ?? percentage
                ? `linear-gradient(to right, #5555df ${
                    thumbPosition ?? percentage
                  }%, #999 0)`
                : "#999",
          }}
        >
          <button
            ref={thumb}
            className="bar__thumb"
            style={{ left: `${thumbPosition ?? percentage}%` }}
          >
            <svg viewBox="0 0 24 24" fill="white" width={14}>
              <circle cx="50%" cy="50%" r="50%" />
            </svg>
          </button>
        </div>
      </div>
      <span className="bar__time">{formatTime(duration)}</span>
    </div>
  );
}
