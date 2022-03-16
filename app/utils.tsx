export const resetGame = ({ reload }: { reload: boolean }) => {
  localStorage.removeItem("board");
  localStorage.removeItem("word");
  localStorage.removeItem("usedLetters");
  localStorage.removeItem("surrendered");
  localStorage.removeItem("start-time");
  localStorage.removeItem("end-time");

  if (reload) window.location.reload();
};

export const getTwoDigit = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

export const formatElapsedTime = (elapsedTime: Date) => {
  const hours = elapsedTime.getHours();
  const minutes = elapsedTime.getMinutes();
  const seconds = elapsedTime.getSeconds();

  return `${hours > 0 ? `${getTwoDigit(hours)}h ` : ""}${getTwoDigit(
    minutes
  )}m ${getTwoDigit(seconds)}s`;
};
