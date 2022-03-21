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
  const auxDate = new Date(
    elapsedTime.getTime() + new Date().getTimezoneOffset() * 60000
  );
  const hours = auxDate.getHours();
  const minutes = auxDate.getMinutes();
  const seconds = auxDate.getSeconds();

  return `${hours > 0 ? `${getTwoDigit(hours)}h ` : ""}${getTwoDigit(
    minutes
  )}m ${getTwoDigit(seconds)}s`;
};
