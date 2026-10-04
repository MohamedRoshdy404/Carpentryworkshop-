import { useEffect, useRef, useState } from "react";

export function ToastContainer() {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      setMessage(customEvent.detail.message);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setMessage(null), 2600);
    };

    window.addEventListener("app-toast", handleToast);
    return () => {
      window.removeEventListener("app-toast", handleToast);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-50 flex justify-center md:inset-x-auto md:right-8 md:bottom-8">
      <div
        role="status"
        aria-live="polite"
        className="rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-stone-900/20"
      >
        {message}
      </div>
    </div>
  );
}
