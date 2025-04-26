import { useState, useEffect } from "react";

interface InputFieldsProps {
  setHour: React.Dispatch<React.SetStateAction<number>>;
  setMinute: React.Dispatch<React.SetStateAction<number>>;
  setSecond: React.Dispatch<React.SetStateAction<number>>;
  onStart: (h: number, m: number, s: number) => void;
  onReset: () => void;
}

export default function InputFields({
  setHour,
  setMinute,
  setSecond,
  onStart,
  onReset,
}: InputFieldsProps) {
  const [hours, setHours] = useState<number | "">("");
  const [minutes, setMinutes] = useState<number | "">("");
  const [seconds, setSeconds] = useState<number | "">("");
  const [startText, setStartText] = useState("Start");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoredValues = async () => {
      const result = await chrome.storage.session.get(["startText", "started"]);

      if (result.startText !== undefined) setStartText(result.startText);
    };

    loadStoredValues();
  }, []);

  useEffect(() => {
    chrome.storage.session.set({
      startText,
    });
  }, [startText]);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    max: number,
    setState: React.Dispatch<React.SetStateAction<number | "">>
  ) => {
    const value = Math.min(Number(event.target.value), max);
    const validValue = value >= 0 ? value : "";
    setState(validValue);
  };

  const handleReset = () => {
    setHours("");
    setMinutes("");
    setSeconds("");
    setStartText("Start");
    setError(null);
    onReset();
  };

  const handleBegin = () => {
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const s = Number(seconds) || 0;

    if (
      h < 0 ||
      h > 23 ||
      m < 0 ||
      m > 59 ||
      s < 0 ||
      s > 59 ||
      (h === 0 && m === 0 && s === 0)
    ) {
      setError("Please enter valid values for hours, minutes, and seconds.");
      onReset();
      return;
    }

    setError(null);

    chrome.storage.session.set({ hours: h, minutes: m, seconds: s }, () => {
      setHour(h);
      setMinute(m);
      setSecond(s);
      onStart(h, m, s);

      chrome.runtime.sendMessage({
        type: "startPomodoroTimer",
        payload: { hour: h, minute: m, second: s, isRunning: true },
      });
    });

    chrome.storage.sync.get("websites", (result) => {
      if (result.websites) {
        chrome.runtime.sendMessage(
          { type: "updateWebsites", payload: result.websites },
          () => {}
        );
      }
    });

    setStartText("Stop");
  };

  const handleStop = () => {
    chrome.runtime.sendMessage({ type: "clearBlockingRules" }, () => {});
    handleReset();
  };

  return (
    <form className="w-full max-w-sm">
      <div className="border-b-2 flex items-center  border-custom_red-500 py-2">
        {startText === "Start" && (
          <>
            <input
              className="rounded-full disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-zinc-400 appearance-none bg-transparent border-none w-full font-bold text-custom_red-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="number"
              placeholder="Hours"
              aria-label="Hours"
              value={hours}
              onChange={(e) => handleInput(e, 23, setHours)}
              min="0"
              max="23"
            />
            <input
              className="rounded-full disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-zinc-400 appearance-none bg-transparent border-none w-full font-bold text-custom_red-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="number"
              placeholder="Minutes"
              aria-label="Minutes"
              value={minutes}
              onChange={(e) => handleInput(e, 59, setMinutes)}
              min="0"
              max="59"
            />
            <input
              className="rounded-full disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none placeholder:text-zinc-400 appearance-none bg-transparent border-none w-full font-bold text-custom_red-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="number"
              placeholder="Seconds"
              aria-label="Seconds"
              value={seconds}
              onChange={(e) => handleInput(e, 59, setSeconds)}
              max="59"
            />
          </>
        )}
        <button
          className="flex-shrink-0 bg-custom_red-500 hover:bg-custom_red-700 border-custom_red-500 hover:border-custom_red-700 text-sm border-4 text-white py-1 px-2 rounded-full"
          type="button"
          onClick={startText === "Start" ? handleBegin : handleStop}
        >
          {startText}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </form>
  );
}
