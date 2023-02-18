import { EffectCallback, useEffect, useRef } from "react";

export function useTimer(func: () => any, time: number) {
  useEffect(() => {
    func();
    const interval = setInterval(func, time);
    return () => clearInterval(interval);
  }, []);
}

export function useInitialMount(func: EffectCallback) {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return func();
    }
  });
}
