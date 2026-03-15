const bgColors = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export const getRandomColor = () => {
  return bgColors[Math.floor(Math.random() * bgColors.length)];
};

export const getColorFromString = (str: string) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return bgColors[Math.abs(hash) % bgColors.length];
};
