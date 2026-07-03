import { useEffect, useState } from 'react';

/** Live HH:MM:SS clock for a given IANA timezone, e.g. "14:32:07 EST". */
export function useClock(timeZone: string, label: string) {
  const [time, setTime] = useState('—');

  useEffect(() => {
    const tick = () => {
      const s = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone,
      });
      setTime(`${s} ${label}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone, label]);

  return time;
}
