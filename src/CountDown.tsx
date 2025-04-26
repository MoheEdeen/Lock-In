import { useEffect, useState } from "react";
import Circle from "./Circle";
import InputFields from "./InputFields";

export default function CountDown({
  onBlockSitesClick,
}: {
  onBlockSitesClick: () => void;
}) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const updateTimerFromStorage = () => {
    chrome.storage.session.get(
      ["hours", "minutes", "seconds", "isRunning"],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        setHours(result.hours || 0);
        setMinutes(result.minutes || 0);
        setSeconds(result.seconds || 0);
        setIsRunning(result.isRunning || false);
      }
    );
  };

  useEffect(() => {
    updateTimerFromStorage();
    const interval = setInterval(updateTimerFromStorage, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = (h: number, m: number, s: number) => {
    chrome.storage.session.get(["hours", "minutes", "seconds"], (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      const newHour = result.hours !== undefined ? result.hours : h;
      const newMinute = result.minutes !== undefined ? result.minutes : m;
      const newSecond = result.seconds !== undefined ? result.seconds : s;

      setHours(newHour);
      setMinutes(newMinute);
      setSeconds(newSecond);
      setIsRunning(true);
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    chrome.runtime.sendMessage({
      type: "resetTimer",
    });
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div className="flex h-screen flex-wrap items-center justify-center">
      <div className="flex flex-wrap gap-5 items-center justify-center">
        <Circle color="text-custom_red-700" percentage={hours} hour />
        <Circle color="text-custom_red-700" percentage={minutes} />
        <Circle color="text-custom_red-700" percentage={seconds} />
      </div>
      <div className="flex flex-col items-center">
        <InputFields
          setHour={setHours}
          setMinute={setMinutes}
          setSecond={setSeconds}
          onStart={handleStart}
          onReset={handleReset}
        />
        {isRunning === false && (
          <div className="pt-6">
            <button
              onClick={onBlockSitesClick}
              className="bg-custom_red-500 hover:bg-custom_red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Block Sites
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
