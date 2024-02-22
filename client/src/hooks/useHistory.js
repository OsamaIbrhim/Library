import { useState, useEffect } from "react";

const useHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleHistoryChange = () => {
      const newHistory = [...history, window.location.pathname];
      setHistory(newHistory);
    };

    window.addEventListener("popstate", handleHistoryChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, [history]);

  const goTo = (route) => {
    window.history.pushState({}, "", route);
    setHistory([...history, route]);
  };

  return { goTo };
};

export default useHistory;
