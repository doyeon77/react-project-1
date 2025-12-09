import { useState, useEffect } from "react";

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // 함수형 업데이트 지원
  const setStoredValue = (valOrFunc) => {
    setValue((prev) => {
      const newValue =
        typeof valOrFunc === "function" ? valOrFunc(prev) : valOrFunc;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  };

  // 복용 기록 초기화 함수 추가
  const clearStoredValue = () => {
    localStorage.removeItem(key);
    setValue(initial);
  };

  return [value, setStoredValue, clearStoredValue];
}
