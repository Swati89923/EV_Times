import { useEffect, useRef, useState } from "react";
import "./VoiceReader.css";
const VoiceReader = ({ title, description }) => {
  const utteranceRef = useRef(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    window.speechSynthesis.cancel();

    const text = `${title}. ${description}`;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);

    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="voice-reader">
      {!isSpeaking && (
        <button onClick={speak}>
          🔊 Listen
        </button>
      )}

      {isSpeaking && !isPaused && (
        <>
          <button onClick={pause}>⏸ Pause</button>

          <button onClick={stop}>⏹ Stop</button>
        </>
      )}

      {isSpeaking && isPaused && (
        <>
          <button onClick={resume}>▶ Resume</button>

          <button onClick={stop}>⏹ Stop</button>
        </>
      )}
    </div>
  );
};

export default VoiceReader;