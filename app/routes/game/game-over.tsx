import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MetaFunction, useNavigate } from "remix";
import { BoxType } from "~/components/game";
import Share from "~/components/share";
import styles from "~/styles/end-game.css";
import { formatElapsedTime, resetGame } from "~/utils";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return {
    title: "Amiwordle · Has perdido",
  };
};

export default function GameOver() {
  const [word, setWord] = useState("");
  const [board, setBoard] = useState<BoxType[][]>([]);
  const [elapsedTime, setElapsedTime] = useState<Date>();
  const navigate = useNavigate();

  useEffect(() => {
    const board: BoxType[][] = JSON.parse(
      localStorage.getItem("board") || "[]"
    );
    setBoard(board);

    const gameOver = board[board.length - 1].every((box) => box.state !== null); // Last row is full
    if (!gameOver) return navigate("/game");
    setWord(atob(localStorage.getItem("word") || ""));

    const localStorageStartTime = parseInt(
      localStorage.getItem("start-time") || "0"
    );
    const localStorageEndTime = parseInt(
      localStorage.getItem("end-time") || "0"
    );

    setElapsedTime(new Date(localStorageEndTime - localStorageStartTime));
  }, []);

  return (
    <main className="container">
      <div className="inner-container">
        {word && (
          <>
            <h2 className="end-message">¡Has perdido!</h2>

            <div className="winner-word-container">
              <h4 className="word-was">La palabra era... </h4>
              <h4 className="winner-word">{word.toUpperCase()}</h4>
            </div>

            {elapsedTime && (
              <h5 className="elapsed">
                Tiempo: {formatElapsedTime(elapsedTime)}
              </h5>
            )}

            <Share board={board} word={word} type="lose" />

            <div className="try-again-container hide-on-screenshot">
              <p>¿Quieres volver a intentarlo con otra palabra?</p>
              <Link to="/game" onClick={() => resetGame({ reload: false })}>
                Volver a intentarlo
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
