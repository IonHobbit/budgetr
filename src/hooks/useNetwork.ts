import { useEffect, useState } from "react";

const useNetwork = () => {
  const [isOffline, setNetwork] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("offline",
        () => setNetwork(!window.navigator.onLine)
      );
      window.addEventListener("online",
        () => setNetwork(!window.navigator.onLine)
      );
    }
  })

  return { isOffline };
}

export default useNetwork;