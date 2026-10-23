import { useEffect, useRef, useState } from 'react';

// 요소가 뷰포트에 들어왔는지. once=true 면 한 번 보이면 계속 true.
export function useInView({ rootMargin = '0px', threshold = 0, once = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
