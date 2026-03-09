import { useState, useEffect, useRef } from "react";

export default function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0; const step = Math.ceil(target / 40);
    const t = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(t); } else setCount(start); }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <span>{count}{suffix}</span>;
}