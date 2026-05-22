import { useEffect, useState } from "react";
import { readLS, writeLS } from "@/lib/storage";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  // hydrate after mount to avoid SSR mismatch
  useEffect(() => {
    setValue(readLS<T>(key, initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    writeLS(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}