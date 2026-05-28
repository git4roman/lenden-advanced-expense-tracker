export const formatDateTime = (isoString: string) => {
  if (!isoString) return { date: "", time: "" };
  const dateObj = new Date(isoString);

  const date = dateObj.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};
